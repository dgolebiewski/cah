<script>
  import { createEventDispatcher } from "svelte";
  import { v4 as uuidv4 } from 'uuid';
  import Label from "./Label.svelte";

  export let label = '';
  export let type = 'text';
  export let value = '';
  export let placeholder = '';
  export let error = '';

  const dispatch = createEventDispatcher();
  
  const id = uuidv4();
  const classes = "bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 transition-colors px-5 py-2 rounded-lg text-white focus:outline-none w-full";

  const change = (e) => {
    dispatch('change', e);
  }
</script>

<div class="mb-10">
  {#if label}
    <Label htmlFor={id}>
      {label}
    </Label>
  {/if}
  {#if type === 'number'}
    <input
      {id}
      class={classes}
      type="number"
      on:keydown={change}
      bind:value={value}
      {placeholder}
      />
  {:else}
    <input
      {id}
      class={classes}
      type="text"
      on:keydown={change}
      bind:value={value}
      {placeholder}
      />
  {/if}

  {#if error}
    <p class="text-red-500 mt-2">{error}</p>
  {/if}
</div>