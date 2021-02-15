<script>
  import Input from "./Input.svelte";

  export let settings = {};
  export let errors = {};
</script>

<Input bind:value={settings.name} error={errors.name} label="Room name" />

<Input bind:value={settings.maxScore} error={errors.maxScore} type="number" label="Max score" />