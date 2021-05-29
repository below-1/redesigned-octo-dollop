<script>
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte';
  import FaTimesCircle from 'svelte-icons/fa/FaTimesCircle.svelte'
  import { createPopper } from '@popperjs/core';

  const dispatch = createEventDispatcher()

  export let options = null
  export let selected = null
  export let label = null

  let show_select = false
  let anchor = null
  let select_element = null

  $: selected_items = options.filter(it => selected.includes(it.value))
  $: free_options = options.filter(it => !selected.includes(it.value))

  function toggle_select () {
    show_select = !show_select
  }

  onMount(() => {
    createPopper(anchor, select_element, {})
  })
</script>

<div>
  <div 
    class="flex flex-wrap items-center rounded border-2 border-gray-200 p-1 w-100"
    bind:this={anchor}
  >
    <button 
      on:click={toggle_select}
      class="appearance-none px-2 py-1 rounded-r bg-gray-200 text-gray-700 text-xs font-bold mr-2 mb-1">
      {label}
    </button>
    {#each selected_items as it}
      <div class="rounded flex mr-2 mb-1">
        <div class="bg-blue-600 text-white font-medium text-xs px-2 py-1 rounded-l">
          {it.label}
        </div>
        <button 
          on:click={() => {
            if (!selected.includes(it.value)) return;
            dispatch('remove', it.value)
          }}
          class="appearance-none px-2 py-1 rounded-r bg-blue-800 text-white">
          <div class="w-4 h4">
            <FaTimesCircle />
          </div>
        </button>
      </div>
    {/each}
  </div>
  <div bind:this={select_element} class="w-100 flex flex-col bg-white" class:hidden="{ !show_select }">
    {#each free_options as opt}
      <button 
        class="appearance-none border-b border-gray-300 px-3 py-1"
        on:click={() => {
          if (selected.includes(opt.value)) return;
          dispatch('select', opt.value)
          show_select = false
        }}
      >{opt.label}</button>
    {/each}
  </div>
</div>
