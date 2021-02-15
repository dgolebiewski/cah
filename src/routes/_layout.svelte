<script>
import { fade } from "svelte/transition";

  import Nav from "../components/Nav.svelte";
  export let segment;
</script>

<Nav {segment} />

<main>
  <div class="container mx-auto py-1">
    <slot />
  </div>
</main>
