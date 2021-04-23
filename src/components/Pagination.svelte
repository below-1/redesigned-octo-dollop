<script>
  import { createEventDispatcher } from 'svelte'
  import FaAngleRight from 'svelte-icons/fa/FaAngleRight.svelte'
  import FaAngleLeft from 'svelte-icons/fa/FaAngleLeft.svelte'

  const dispatch = createEventDispatcher()

  export let total_page
  export let show = 5
  export let page
  let part = 0

  function compute_items ({ total_page, show, part }) {
    let start = part * show
    let length = show
    if ((start + show - 1) > total_page) {
      length = total_page - start
    }
    const result = [...Array(length).keys()].map((i) => {
      return start + i
    })
    return result
  }

  $: max_part = Math.ceil(total_page / show) - 1
  $: items = compute_items({ total_page, show, part })
</script>

<section class="pagination flex items-center">
  {#if part > 0}
    <button
      on:click={() => {
        part -= 1
        const target_page = items[0] - show
        console.log(target_page)
        dispatch('change', target_page)
      }}
      class="inline-block rounded px-2 py-1 text-center text-xs font-bold border border-gray-300 mr-2"
    >
      <div class="w-4 h-4">
        <FaAngleLeft/>
      </div>
    </button>
  {/if}
  {#each items as i}
    <button
      on:click={() => {
        dispatch('change', i)
      }}
      class="inline-block rounded px-2 py-1 text-center text-xs font-bold border border-gray-300 mr-2"
      class:bg-blue-700="{i == page}"
      class:text-white="{i == page}"
    >
      { i + 1 }
    </button>
  {/each}
  {#if part < max_part}
    <button
      on:click={() => {
        part += 1
        dispatch('change', items[items.length - 1] + 1)
      }}
      class="inline-block rounded px-2 py-1 text-center text-xs font-bold border border-gray-300"
    >
      <div class="w-4 h-4">
        <FaAngleRight/>
      </div>
    </button>
  {/if}
</section>