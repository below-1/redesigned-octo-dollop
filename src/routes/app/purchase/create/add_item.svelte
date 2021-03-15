<script>
  import { onMount } from 'svelte'
  import { get, del } from '../../../../commons/api'
  import { items } from './store'

  let product_id = null
  let mrp = null
  let quantity = 0
  let available = 0
  let defective = 0
  let price = 0
  let discount = 0
  let products = []

  $: product_ids = $items.map(item => item.product_id)
  $: free_products = products.filter(product => {
    return !product_ids.includes(product.id)
  })
  $: selected_product = free_products.find(product => product.id == product_id)

  async function load_products () {
    const result = await get({ url: '/api/v1/product' })
    products = result.items
  }

  function save () {
    let payload = {
      product_id,
      product_title: selected_product.title,
      mrp,
      quantity,
      available,
      defective,
      discount,
      price
    }
    items.set([
      ...$items,
      payload
    ])
    window.history.back()
  }

  onMount(async () => {
    await load_products()
  })
</script>

<div class="bg-white px-4 mb-4 py-2">
  <div class="flex items-center">
    <div class="font-semibold">Form Tambah Item Pembelian</div>
    <div class="flex-grow"></div>
    <button 
      on:click={save}
      class="appearance-none border-2 border-green-500 px-4 py-1 flex items-center font-bold rounded mr-4"
    >
      simpan
    </button>
  </div>
</div>

<div class="w-3/5 bg-white p-4">

  <div class="flex items-center mb-4">
    <label class="w-1/3">Pilih Item</label>
    <div class="w-2/3">
      <select bind:value={product_id} class="w-full border border-gray-300 rounded px-2 py-1">
        <option disabled value={null}>-- pilih produk --</option>
        {#each free_products as product}
          <option value={product.id}>{product.title}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Harga (Rp.)</label>
    <div class="w-2/3">
      <input bind:value={price} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Harga Jual Maximum (Rp.)</label>
    <div class="w-2/3">
      <input bind:value={mrp} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Qty</label>
    <div class="w-2/3">
      <input bind:value={quantity} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Qty kondisi baik</label>
    <div class="w-2/3">
      <input bind:value={available} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Qty kondisi rusak</label>
    <div class="w-2/3">
      <input bind:value={defective} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

  <div class="flex items-center mb-4">
    <label class="w-1/3">Diskon (%)</label>
    <div class="w-2/3">
      <input bind:value={discount} class="w-full border border-gray-300 rounded px-2 py-1" />
    </div>
  </div>

</div>