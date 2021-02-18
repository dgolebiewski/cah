import {
  ACTION_CREATE_GAME,
  ACTION_ESTABLISH_CONNECTION,
  ACTION_GAMES_LIST_UPDATE,
  ACTION_GAME_STATE_UPDATE,
  ACTION_JOIN_GAME,
  ACTION_PICK_CARD,
  ACTION_PLAY_CARD,
  ACTION_START_GAME,
  ACTION_UPDATE_CLIENT,
} from './actions';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const adress = '188.137.69.131';
const port = 8080;

export default {
  client: null,
  clientInfo: null,
  ready: false,
  readyListeners: [],
  gamesList: [],
  game: null,
  actionSubscribers: [],
  requests: [],
  start() {
    if (!process.browser) {
      return new Promise(resolve => resolve(null));
    }

    if (this.ready) {
      return new Promise(res => res(this.client));
    }

    if (this.client && !this.ready) {
      return new Promise(resolve => {
        this.readyListeners.push(resolve);
      });
    }

    this.client = new WebSocket(`ws://${adress}:${port}`);

    const promise = new Promise(res => {
      this.readyListeners.push(res);
    });

    this.client.onmessage = message => {
      const msgObject = JSON.parse(message.data);

      switch (msgObject.action) {
        case ACTION_ESTABLISH_CONNECTION:
          if (this.clientInfo) {
            return;
          }

          this.clientInfo = {
            id: msgObject.data.client.id,
            name: msgObject.data.client.name,
          };

          Cookies.set('clientId', this.clientInfo.id);
          this.ready = true;
          if (this.readyListeners.length) {
            this.readyListeners.forEach(resolve => {
              resolve(this.client);
            });
          }
          return;
        case ACTION_GAMES_LIST_UPDATE:
          this.gamesList = msgObject.data;
          break;
        case ACTION_GAME_STATE_UPDATE:
          this.game = msgObject.data;
          break;
        case ACTION_UPDATE_CLIENT:
          this.clientInfo = msgObject.data.client;
          break;
      }

      const request = this.requests.find(r => r.id === msgObject.requestId);
      if (request) {
        request.resolve(msgObject.data || { error: msgObject.error });
      }

      const subscribers = this.actionSubscribers.filter(
        a => a.action === msgObject.action,
      );
      subscribers.forEach(s => s.callback(msgObject.data));
    };

    this.client.onopen = () => {
      this.client.send(
        JSON.stringify({
          clientId: Cookies.get('clientId') || null,
          name: Cookies.get('clientName') || null,
          action: ACTION_ESTABLISH_CONNECTION,
        }),
      );
    };

    return promise;
  },
  setName(name) {
    Cookies.set('clientName', name);
    const request = { name };

    return this.sendRequest(request, ACTION_UPDATE_CLIENT);
  },
  getClient() {
    return this.clientInfo;
  },
  subscribeAction(callback, action) {
    this.actionSubscribers.push({
      callback,
      action,
    });
  },
  unsubscribeAction(callback, action) {
    const index = this.actionSubscribers.findIndex(
      a => a.callback === callback && a.action === action,
    );
    if (index > -1) {
      this.actionSubscribers.splice(index, 1);
    }
  },
  createGame(decks, settings = {}) {
    const request = {
      settings: {
        decks: decks.map(d => d._id),
        ...settings,
      },
    };

    return this.sendRequest(request, ACTION_CREATE_GAME);
  },
  getGames() {
    return this.gamesList;
  },
  joinGame(id, onGameUpdate) {
    const request = {
      gameId: id,
    };

    if (onGameUpdate) {
      this.subscribeAction(onGameUpdate, ACTION_GAME_STATE_UPDATE);
    }
    return this.sendRequest(request, ACTION_JOIN_GAME);
  },
  startGame() {
    if (!this.game) {
      return;
    }

    return this.sendRequest({}, ACTION_START_GAME);
  },
  playCards(cards) {
    if (!this.game) {
      return;
    }

    const request = {
      whiteId: cards,
    };

    return this.sendRequest(request, ACTION_PLAY_CARD);
  },
  pickCard(winnerId) {
    if (!this.game) {
      return;
    }

    const request = {
      winnerId,
    };

    return this.sendRequest(request, ACTION_PICK_CARD);
  },
  sendRequest(request, action) {
    if (!this.ready) {
      return new Promise(resolve => resolve(null));
    }

    let req = {
      id: uuidv4(),
      clientId: this.clientInfo.id,
      action,
    };

    if (this.game) {
      req.gameId = this.game.id;
    }

    req = {
      ...req,
      ...request,
    };

    this.client.send(JSON.stringify(req));

    return new Promise(resolve => {
      this.requests.push({ ...req, resolve });
    });
  },
};
