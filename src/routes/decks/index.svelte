<script context="module">
  export async function preload() {
    const res = await this.fetch('decks.json');
    const data = await res.json();

    return { decks: data };
  }
</script>

<script>
  import { goto } from '@sapper/app';
  import Button from '../../components/Button.svelte';
  import Card from '../../components/Card.svelte';
  import PageHeader from '../../components/PageHeader.svelte';
  import { selectedDecks } from '../../stores.js';
  import gameClient from '../../game/client';
  import Input from '../../components/Input.svelte';
  import PageTransition from '../../components/PageTransition.svelte';
  import InfiniteScroll from 'svelte-infinite-scroll';
  export let decks;

  let page = 1;
  let search = '';
  $: searchResult = search
    ? decks.docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    : decks.docs;

  const selectedClasses = 'border-white bg-gray-700';

  function toggleDeck(deck) {
    selectedDecks.update(s => {
      const index = s.findIndex(d => d.slug === deck.slug);
      const tab = [...s];

      if(index > -1) {
        tab.splice(index, 1);
      }
      else {
        tab.push(deck);
      }

      return tab;
    });
  }

  const filterDuplicates = () => {
    decks.docs = decks.docs.filter((value, index, self) => self.indexOf(value) === index);
  }

  const loadMore = async () => {
    page++;
    const res = await fetch(!search ? `/decks.json?page=${page}` :  `/decks.json?page=${page}&search=${search}`);
    const data = await res.json();

    const docs = [ ...decks.docs, ...data.docs ];
    decks = data;
    decks.docs = docs;

    filterDuplicates();
  }

  let searchTimeout = null;
  const searchDb = async () => {
    page = 1;
    if(searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if(!search) {
      loadMore();
      return;
    }

    searchTimeout = setTimeout(async () => {
      const res = await fetch(`/decks.json?search=${search}`);
      const data = await res.json();

      decks = data;

      filterDuplicates();
    }, 200);
  }

  const createGame = () => {
    goto(`/game/create`);
  }
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<PageTransition>
  <div class="flex justify-between">
    <PageHeader>Decks</PageHeader>
    <div class="flex items-center">
      <PageHeader secondary noMargins>Selected decks: {$selectedDecks.length}</PageHeader>
      <Button className="ml-4 w-24" centered on:click={() => createGame()}>Play</Button>
    </div>
  </div>
  
  <div class="mx-3">
    <Input on:change={() => searchDb()} bind:value={search} placeholder="Look for a deck" />
  </div>
  
  <div class="grid grid-cols-3">
    {#each searchResult as deck}
      <button
        class="block hover:bg-gray-700 focus:outline-none border-2 border-transparent transition-colors p-5 my-2 mx-3 rounded-lg text-left {$selectedDecks.find(d => d.slug === deck.slug) ? selectedClasses : 'bg-gray-800'}"
      >
        <div>
          <div class="flex justify-between items-center mb-5">
            <h2 class="font-mono text-xl font-bold uppercase text-white whitespace-nowrap overflow-hidden overflow-ellipsis w-3/4" on:click={() => toggleDeck(deck)}>
              {deck.name}
            </h2>
            <Button as="link" to={`/decks/${deck.slug}`}>View deck</Button>
          </div>
          <div class="grid grid-cols-3" on:click={() => toggleDeck(deck)}>
            {#each deck.black.slice(0, 3) as card}
              <Card color="black" {card} />
            {/each}
          </div>
          <div class="grid grid-cols-3" on:click={() => toggleDeck(deck)}>
            {#each deck.white.slice(0, 3) as card}
              <Card color="white" {card} />
            {/each}
          </div>
        </div>
      </button>
    {/each}
    <InfiniteScroll hasMore={decks.hasNextPage} window={true} threshold={150} on:loadMore={() => loadMore()} />
    {#if searchResult.length === 0}
      <p class="text-white text-xl font-mono uppercase py-5">No decks found.</p>
    {/if}
  </div>
</PageTransition>
