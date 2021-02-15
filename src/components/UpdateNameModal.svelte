<script>
import { createEventDispatcher, onMount } from 'svelte';

  import gameClient from '../game/client';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Modal from './Modal.svelte';
import PageHeader from './PageHeader.svelte';

  export let open = false;
  
  let playerName = '';
  let client = null;

  const dispatch = createEventDispatcher();

  const updateName = () => {
    if(!client) {
      return;
    }

    gameClient.setName(playerName);
    onClose(null);
  }

  const onClose = (e) => {
    dispatch('close', e);
  }

  onMount(async () => {
    client = await gameClient.start();

    playerName = gameClient.getClient().name;
  });
</script>

<Modal open={open} on:close={onClose}>
  <div class="text-center">
    <PageHeader secondary noMargins className="mb-3">Choose a name</PageHeader>
    <Input bind:value={playerName} placeholder="Your name" />
    <Button on:click={() => updateName()}>Update</Button>
  </div>
</Modal>