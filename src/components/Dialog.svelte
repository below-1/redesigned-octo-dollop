<script>
  import { fade } from 'svelte/transition';

  export let show = false;
</script>

{#if show}
  <!-- Backdrop -->
  <div 
    class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
    style="z-index: 100; background: rgb(250, 250, 250, 0.8);"
    transition:fade
    on:click|self={() => {
      show = false;
    }}
  >
    <div class="bg-white rounded shadow-xl">
      <slot>
      </slot>
    </div>
  </div>
{/if}