<script>
  import { onMount } from 'svelte'
  import { createPopper } from '@popperjs/core';

  export let btn_class = ''
  export let menus = []

  let trigger = null
  let menu = null
  let show_menu = false

  $: wrapped_menus = menus.map(m => {
    if (m.to) return m
    return {
      ...m,
      action: async () => {
        await m.action()
        show_menu = false
      }
    }
  })

  function toggle_menu () {
    show_menu = !show_menu
    if (!show_menu) return
    createPopper(trigger, menu, {})
  }
</script>

<button bind:this={trigger} class={btn_class} on:click={toggle_menu}>
  <slot name="btn_content"></slot>
</button>

<ul bind:this={menu} class="text-sm shadow-xl" class:hidden="{ !show_menu }">
  {#each wrapped_menus as menu}
    <li class="flex">
      {#if menu.to}
        <a 
          href={menu.to} 
          class="bg-white px-2 py-1 border-b border-gray-300 flex-grow hover:bg-gray-100">
          {menu.label}
        </a>
      {:else}
        <button 
          on:click={menu.action}
          class="bg-white px-2 py-1 border-b border-gray-300 flex-grow hover:bg-gray-100"
        >
          {menu.label}
        </button>
      {/if}
    </li>
  {/each}
</ul>


