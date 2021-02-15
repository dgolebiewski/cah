<script>
  import { onMount } from "svelte";
  import NavButton from "./NavButton.svelte";
  import gameClient from '../game/client';
  import UpdateNameModal from "./UpdateNameModal.svelte";
import { ACTION_UPDATE_CLIENT } from "../game/actions";

  export let segment;

  let nameModalOpen = false;
  let playerName = null;

  const openNameModal = () => {
    nameModalOpen = true;
  }

  onMount(async () => {
    await gameClient.start();

    playerName = gameClient.getClient().name;

    gameClient.subscribeAction((data) => {
      playerName = data.client.name;
    }, ACTION_UPDATE_CLIENT);
  });
</script>

<div class="border-b border-white">
  <div class="container mx-auto flex justify-between">
    <div>
      <NavButton link={true} href="/decks">
        Create a room
      </NavButton>
      <NavButton link={true} href="/">
        Browse games
      </NavButton>
    </div>
    {#if playerName}
    <div>
      <NavButton on:click={openNameModal}>
        {playerName}
      </NavButton>
    </div>
    {/if}
  </div>
</div>

<UpdateNameModal open={nameModalOpen} on:close={() => nameModalOpen = false} />