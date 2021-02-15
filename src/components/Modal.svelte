<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let open;

  const dispatch = createEventDispatcher();

  const onClose = (e) => {
    dispatch('close', e);
  }
</script>

{#if open}
<div on:mousedown={onClose} transition:fade class="fixed z-50 w-screen h-screen bg-black bg-opacity-60 flex justify-center items-center">
  <div on:mousedown|stopPropagation={() => {}} transition:fly={{ y: 50, duration: 200 }} class="p-5 bg-gray-900 text-white">
    <slot />
  </div>
</div>
{/if}