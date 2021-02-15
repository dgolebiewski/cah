<script>
  export let secondary = false;
  export let noMargins = false;
  export let className = '';
</script>

{#if !secondary}
<h1 class:my-10={!noMargins} class={`font-mono text-5xl font-bold uppercase text-white ${className}`}>
  <slot />
</h1>
{:else}
<h2 class:my-7={!noMargins} class={`font-mono text-3xl font-bold uppercase text-white ${className}`}>
  <slot />
</h2>
{/if}
