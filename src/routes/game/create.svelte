<script>
  import { goto } from '@sapper/app';
  import { onMount } from 'svelte';
  import Button from '../../components/Button.svelte';
  import Input from '../../components/Input.svelte';
  import PageHeader from '../../components/PageHeader.svelte';
  import RoomSettings from '../../components/RoomSettings.svelte';
  import gameClient from '../../game/client';
  import { validateRoomSettings } from '../../validation/index';
  import { selectedDecks } from '../../stores';
  import Label from '../../components/Label.svelte';

  let client = null;
  let playerName = '';
  let settings = {
    name: 'My room',
    maxScore: 8
  };
  let settingsErrors = {};

  const createGame = async () => {
    if(!client) {
      return;
    }

    settingsErrors = validateRoomSettings(settings);
    if(Object.values(settingsErrors).length) {
      return;
    }

    gameClient.setName(playerName);

    const response = await gameClient.createGame($selectedDecks, settings);

    goto(`/game/${response.game.id}`);
  }

  onMount(async () => {
    if(!$selectedDecks.length) {
      goto('/decks');
      return;
    }

    client = await gameClient.start();

    playerName = gameClient.getClient().name;
  })
</script>

<PageHeader>Room settings</PageHeader>

<Input bind:value={playerName} label="Your name" />

<RoomSettings bind:settings={settings} errors={settingsErrors} />

<Label>Selected decks</Label>
<ul class="list-disc list-inside pl-3 text-white mb-4">
  {#each $selectedDecks as deck}
    <li>{deck.name}</li>
  {/each}
</ul>

<Button on:click={createGame}>Create</Button>