<script>
import { onMount } from "svelte";

  import { fly } from "svelte/transition";

  let show = false;

  onMount(() => {
    show = true;
  });
</script>

{#if show}
<div in:fly={{ x: -300, duration: 200 }} class="relative">
  <slot />
</div>
{/if}