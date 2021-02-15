<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let color;
  export let card;
  export let interactable = false;
  export let selected = false;
  export let index = null;

  const whiteClasses = 'bg-white';
  const blackClasses = 'bg-black text-white';
  const interactableClasses = 'cursor-pointer transform hover:scale-105 hover:bg-gray-200';
  const selectedClasses = 'bg-blue-500 hover:bg-blue-500 text-white';

  const getComputedClasses = (s) => {
    if(!s) {
      return `${color === 'white' ? whiteClasses : blackClasses} ${interactable ? interactableClasses : ''}`;
    }

    return `${interactable ? interactableClasses : ''} ${selectedClasses}`;
  }

  const onClick = (e) => {
    dispatch('click', e);
  }
</script>

<div
  class={`p-3 rounded-lg m-2 font-semibold h-40 overflow-hidden overflow-ellipsis transition-all relative ${getComputedClasses(selected)}`}
  on:click={onClick}>
  {card.text}
  {#if index}
    <div class="absolute right-2 bottom-2 rounded-full bg-gray-500 text-white text-center w-6 h-6">
      {index}
    </div>
  {/if}
</div>