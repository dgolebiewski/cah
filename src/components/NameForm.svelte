<script>
  import { createEventDispatcher, onMount } from 'svelte';

  import gameClient from '../game/client';
import Button from './Button.svelte';
import Input from './Input.svelte';
import PageHeader from './PageHeader.svelte';

  const dispatch = createEventDispatcher();

  let name = '';

  const submit = async () => {
    console.log('submitted');
    const response = await gameClient.setName(name);
    console.log(response);

    if(response.status === 'Error') {
      return;
    }

    dispatch('submit', response);
  }

  onMount(async () => {
    await gameClient.start();

    name = gameClient.getClient().name;
  })
</script>

<PageHeader>What's your name?</PageHeader>

<Input bind:value={name} label="Your name" />

<Button on:click={() => submit()}>Save</Button>