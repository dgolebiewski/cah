<script>
  import { createEventDispatcher } from 'svelte';

  export let centered = false;
  export let disabled = false;
  export let as = 'button';
  export let to = '#';
  export let className = '';

  const dispatch = createEventDispatcher();

  function onClick(e) {
    if(disabled) {
      return;
    }

    dispatch('click', e);
  }

  const classes = `px-3 py-2 bg-blue-600 transition-colors text-white rounded-lg`;
</script>

{#if as === 'link'}
  <a class={classes} href={to} on:click={onClick}>
    <slot />
  </a>
{:else}
<button class={`${classes} ${centered ? 'text-center' : ''} ${disabled ? 'opacity-50 cursor-default' : 'hover:bg-blue-700'} ${className}`} on:click={onClick} {disabled}>
  <slot />
</button>
{/if}