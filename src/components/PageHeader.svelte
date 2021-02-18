<script>
  export let secondary = false;
  export let noMargins = false;
  export let className = '';
</script>

{#if !secondary}
<h1 class={`font-mono text-5xl font-bold uppercase text-white ${className} ${!noMargins ? 'my-10' : ''}`}>
  <slot />
</h1>
{:else}
<h2 class={`font-mono text-3xl font-bold uppercase text-white ${className} ${!noMargins ? 'my-7' : ''}`}>
  <slot />
</h2>
{/if}
