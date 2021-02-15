<script>
import { createEventDispatcher } from "svelte";

  export let link = false;
  export let href = '#';

  const dispatch = createEventDispatcher();

  const onClick = (e) => {
    dispatch('click', e);
  }
</script>

{#if link}
<a {href} rel="prefetch" on:click={onClick} class="text-gray-200 hover:bg-gray-800 border-b border-transparent hover:border-red-600 transition-colors uppercase font-semibold inline-block py-4 px-2">
  <slot />
</a>
{:else}
<button on:click={onClick} class="text-gray-200 hover:bg-gray-800 focus:border-none focus:outline-none border-b border-transparent hover:border-red-600 transition-colors uppercase font-semibold inline-block py-4 px-2">
  <slot />
</button>
{/if}