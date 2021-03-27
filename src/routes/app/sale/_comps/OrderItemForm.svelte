<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { get, del } from '../../../../commons/api'
  import fdate from '../../../../commons/fdate'
  import FaRegTimesCircle from 'svelte-icons/fa/FaRegTimesCircle.svelte'

  const dispatch = createEventDispatcher()

  export let order_items
  export let initial = null
  export let edit = false

  let product_id = null
  let quantity = 0
  
  let products = []

  $: product_ids = order_items.map(item => item.product_id)
  $: free_products = products.filter(product => {
    return !product_ids.includes(product.id)
  })
  $: selected_product = products.find(product => product.id == product_id)
  $: max_pcs = selected_product ? selected_product.available : 0

  async function load_items ({ product_id }) {
    if (!process.browser) return;
    if (!product_id) return;
    const result = await get({ url: '/api/v1/item', params: { product_id } })
    items = result.map(it => ({
      ...it,
      price: parseInt(it.price),
      sale_price: parseInt(it.sale_price),
      discount: parseFloat(it.discount)
    }))
  }

  async function load_products () {
    const result = await get({ url: '/api/v1/product', params: { only_available: true } })
    products = result.items
  }

  function save () {
    let payload = {
      product_id,
      product_title: selected_product.title,
      quantity,
      item_id: selected_product.item_id,
      discount: selected_product.discount,
      sale_price: selected_product.sale_price,
      price: selected_product.price
    }
    dispatch('done', payload)
  }

  onMount(async () => {
    // load items must be run first
    await load_products()
    if (initial) {
      product_id = initial.product_id
      item_id = initial.item_id
      quantity = initial.quantity
    }
  })
</script>

<!-- backdrop -->
<div 
  class="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center" 
  style="background-color: rgba(255, 255, 255, 0.7);"
>
  <div class="w-3/5 bg-white shadow-xl rounded border-2 border-gray-300">
    <div class="px-4 mb-4 py-2 border-b border-gray-300">
      <div class="flex items-center">
        <div class="font-semibold">Form Tambah Item Penjualan</div>
        <div class="flex-grow"></div>
        <button 
          on:click={save}
          class="appearance-none border-2 border-green-500 px-4 py-1 flex items-center font-bold rounded mr-4"
        >
          simpan
        </button>
        <button 
          on:click={() => {
            dispatch('close')
          }} 
          class="appearance-none text-red-500 rounded-full"
        >
          <div class="w-8">
            <FaRegTimesCircle />
          </div>
        </button>
      </div>
    </div>
    <div class="p-4">

      <div class="flex items-center mb-4">
        <label class="w-1/3">Pilih Item</label>
        <div class="w-2/3">
          {#if edit}
            <input 
              class="w-full border border-gray-300 rounded px-2 py-1"
              value={selected_product ? selected_product.title : '--'}
              readonly
            />
          {:else}
            <select 
              bind:value={product_id} 
              class="w-full border border-gray-300 rounded px-2 py-1">
              <option disabled value={null}>-- pilih produk --</option>

              {#each free_products as product}
                <option value={product.id}>{product.title} - ({product.available} pcs)</option>
              {/each}
            </select>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Qty</label>
        <div class="w-2/3">
          <input 
            type="number"
            min="0"
            max={max_pcs}
            bind:value={quantity} 
            class="w-full border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>

    </div>
  </div>
</div>
