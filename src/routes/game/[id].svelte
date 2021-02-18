<script context="module">
  export function preload({ params }) {
    return { gameId: params.id };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { GAME_STATUS_CZAR_PICKING, GAME_STATUS_FINISHED, GAME_STATUS_PLAYING, GAME_STATUS_POST_ROUND, GAME_STATUS_WAITING } from '../../game/gameStatus';
  import gameClient from '../../game/client';
  import PageHeader from "../../components/PageHeader.svelte";
  import Button from "../../components/Button.svelte";
  import Card from "../../components/Card.svelte";
  import Label from "../../components/Label.svelte";
import NameForm from "../../components/NameForm.svelte";

  export let gameId;

  let game = null;
  let client = null;
  let error = null;
  let winner = null;
  let selectedCards = [];
  let played = false;

  const gameUpdate = (data) => {
    game = data;

    if(game.status === GAME_STATUS_POST_ROUND || game.status === GAME_STATUS_FINISHED) {
      selectedCards = [];
      winner = null;
      played = false;
    }
  }

  const startGame = () => {
    if(!game) {
      return;
    }

    gameClient.startGame();
  }

  const selectCard = (cardId) => {
    if(game.status !== GAME_STATUS_PLAYING || game.client.cardCzar || selectedCards.includes(cardId)) {
      return;
    }

    selectedCards = [...selectedCards, cardId];
    if(selectedCards.length > game.black.pick) {
      selectedCards.shift();
      selectedCards = selectedCards;
    }
  }

  const play = () => {
    if(game.status !== GAME_STATUS_PLAYING || game.client.cardCzar || selectedCards.length < game.black.pick || played) {
      return;
    }
    
    played = true;
    gameClient.playCards(selectedCards);
  }

  const getClientLabels = (client, game) => {
    let attrs = [];
    if(client.host) {
      attrs.push('Host');
    }

    if(client.cardCzar) {
      attrs.push('Card Czar');
    }

    if(client.score >= game.settings.maxScore) {
      attrs.push('Winner');
    }

    return attrs.join(', ');
  }

  const pick = (winnerId) => {
    if(!game.client.cardCzar || game.status !== GAME_STATUS_CZAR_PICKING) {
      return;
    }

    winner = winnerId;
  }

  const confirmPick = () => {
    gameClient.pickCard(winner);
  }

  const joinGame = async () => {
    if(!client.name) {
      client = gameClient.getClient();
      if(!client.name) {
        return;
      }
    }

    const response = await gameClient.joinGame(gameId, gameUpdate);
    if(response.error) {
      error = response.error;
      return;
    }

    game = response.game;
  }

  onMount(async () => {
    await gameClient.start();

    client = gameClient.getClient();

    if(client.name) {
      joinGame();
    }
  });
</script>

<svelte:head>
  <title>{game ? (game.settings.name || game.id) : 'Game'}</title>
</svelte:head>

{#if game }
  <PageHeader>{game.settings.name || `Game id: ${game.id}`}</PageHeader>
  {#if game.status === GAME_STATUS_WAITING}
    <PageHeader secondary>Waiting room</PageHeader>
  {/if}
  
  <div class="flex items-start">
    {#if game.black}
    <div class="w-56">
      <Card color="black" card={game.black} />
    </div>
    {/if}
    <div class="text-white">
      <table class="divide-y divide-white text-left">
        <thead>
          <tr>
            <th class="py-3 px-2">Player</th>
            <th class="py-3 px-2">Score</th>
            <th class="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white">
          {#each game.clients as client}
          <tr class={`${client.winner ? 'bg-blue-500' : ''}`}>
            <td class="py-3 px-2 max-w-4xl w-56 whitespace-nowrap overflow-hidden overflow-ellipsis">{client.name || client.id}</td>
            <td class="py-3 px-2">{client.score}</td>
            <td class="py-3 px-2">{getClientLabels(client, game)}</td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>


  {#if client && client.id === game.host && [GAME_STATUS_WAITING, GAME_STATUS_FINISHED].includes(game.status)}
    <Button on:click={startGame} disabled={game.clients.length < 3}>Start</Button>
  {/if}

  {#if game.client.cardCzar}
    {#if !winner}
      <Label>You are the card czar.</Label>
    {:else}
      <Button on:click={confirmPick} disabled={game.status !== GAME_STATUS_CZAR_PICKING}>Pick</Button>
    {/if}
  {:else if game.status === GAME_STATUS_PLAYING}
    <Button on:click={play} disabled={selectedCards.length < game.black.pick || played}>Play</Button>
  {/if}

  <div class="my-3 flex flex-row flex-wrap">
    {#each game.table as play}
      <div class="border border-white p-3 rounded-lg mx-2">
        {#each play.white as card}
          <div class="w-56">
            <Card color="white" {card} on:click={() => pick(play.id)} interactable={game.client.cardCzar && game.status === GAME_STATUS_CZAR_PICKING} selected={play.id === winner || play.id === game.lastRoundWinner} />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <div class="my-3 flex flex-row flex-wrap">
    {#each game.client.hand as card}
      <div class="w-56">
        <Card color="white" {card} on:click={() => selectCard(card._id)} interactable={!game.client.cardCzar && !game.client.white.length} selected={selectedCards.includes(card._id)} index={game.black.pick > 1 && selectedCards.includes(card._id) ? (selectedCards.findIndex(c => c === card._id) + 1) : null} />
      </div>
    {/each}
  </div>

  <!-- <pre class="text-white mt-5">{JSON.stringify(game, null, 2)}</pre> -->
{:else if error}
  <PageHeader>Something went wrong</PageHeader>
  <PageHeader secondary>{error}</PageHeader>
{:else if client && !client.name}
  <NameForm on:submit={() => joinGame()} />
{/if}