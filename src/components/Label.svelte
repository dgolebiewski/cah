<script>
  export let htmlFor = '';
</script>

{#if htmlFor}
<label class="font-semibold text-white text-lg uppercase block mt-4 mb-2" for={htmlFor}>
  <slot />
</label>
{:else}
<p class="font-semibold text-white text-lg uppercase block mt-4 mb-2">
  <slot />
</p>
{/if}