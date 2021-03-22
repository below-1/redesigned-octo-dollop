<script>
  import { onMount } from 'svelte'
  export let cls;
  export let value;

  $: formatted = ( value === 0 ) ? "" : value.toLocaleString( "id-ID" );
</script>

<div class="flex">
  <div class="bg-gray-200 text-sm font-medium text-gray-600 px-2 flex items-center">
    Rp
  </div>
  <input 
    class={"border-r border-t border-b border-gray-300 pl-1 pr-2 py-1 text-sm font-mono" + ' ' + cls}
    value={formatted}
    on:keyup={event => {
      let selection = window.getSelection().toString();
      if ( selection !== '' ) {
          return;
      }
      if ([38,40,37,39].includes(event.keyCode)) {
        return;
      }
      let input = event.target.value
      input = input.replace(/[\D\s\._\-]+/g, "");
      value = input ? parseInt( input, 10 ) : 0;
    }}
  />
</div>