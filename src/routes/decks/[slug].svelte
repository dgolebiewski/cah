<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`deck/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { deck: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import Card from '../../components/Card.svelte';
  import PageHeader from '../../components/PageHeader.svelte';

  export let deck;
</script>

<PageHeader>{deck.name}</PageHeader>

<PageHeader secondary>Black cards</PageHeader>

<div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
  {#each deck.black as card}
    <Card color="black" {card} />
  {/each}
</div>

<PageHeader secondary>White cards</PageHeader>

<div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
  {#each deck.white as card}
    <Card color="white" {card} />
  {/each}
</div>
