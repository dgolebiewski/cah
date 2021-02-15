<script>
  import { onDestroy, onMount } from 'svelte';
  import gameClient from '../game/client';
  import PageHeader from '../components/PageHeader.svelte';
  import Button from '../components/Button.svelte';
  import { ACTION_GAMES_LIST_UPDATE } from '../game/actions';
  import PageTransition from '../components/PageTransition.svelte';

  let games = [];

  const updateGames = (g) => {
    games = g;
  };

  onMount(async () => {
    await gameClient.start();

    gameClient.subscribeAction(updateGames, ACTION_GAMES_LIST_UPDATE);
    games = gameClient.getGames();
  });

  onDestroy(() => {
    gameClient.unsubscribeAction(updateGames, ACTION_GAMES_LIST_UPDATE);
  })
</script>

<svelte:head>
  <title>CAH</title>
</svelte:head>

<PageTransition>
  <PageHeader>Browse games</PageHeader>
  <Button as="link" to="/decks">New game</Button>
  <ul class="mt-10">
    {#each games as game}
      <li class="my-3">
        <a href={`/game/${game.id}`}>
          <div class="text-white p-4 bg-gray-800 hover:bg-gray-700 rounded-lg">
            <h3 class="font-semibold text-lg uppercase mb-2">{game.settings.name || game.id}</h3>
            <div class="flex flex-row">
              <div class="mr-3">Players: {game.clients.length}</div>
              <div class="mr-3">Status: {game.status}</div>
            </div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</PageTransition>
