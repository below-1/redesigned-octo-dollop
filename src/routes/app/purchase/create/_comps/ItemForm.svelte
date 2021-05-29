<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { get, del } from '../../../../../commons/api'
  import rupiah from '../../../../../commons/rupiah'
  import FaRegTimesCircle from 'svelte-icons/fa/FaRegTimesCircle.svelte'
  import Currency from '../../../../../components/Currency.svelte'
  import { form } from 'svelte-forms'

  const dispatch = createEventDispatcher()

  export let items
  export let initial = null
  export let edit = false

  let money = 0
  $: fmoney = rupiah(money)

  let product_id = null
  let quantity = 0
  let available = 0
  let defective = 0
  let price = 0
  let sale_price = 0
  let discount = 0
  let products = []

  const available_valid = (x) => {
    console.log('defective = ', defective)
    console.log('available = ', available)
    console.log('quantity = ', available)
    const tot = x + defective
    const valid = tot == quantity
    return {
      valid,
      name: 'av_valid'
    }
  }

  const defective_valid = (x) => {
    const tot = x + available
    const valid = tot == quantity
    return {
      valid,
      name: 'de_valid'
    }
  }

  const item_form = form(() => ({
    product_id: {
      value: product_id,
      validators: ['required']
    },
    quantity: {
      value: quantity,
      validators: ['required', 'min:1']
    },
    available: {
      value: available,
      validators: ['required', 'min:0']
    },
    price: {
      value: price,
      validators: ['required', 'min:1']
    },
    sale_price: {
      value: sale_price,
      validators: ['required', 'min:1', (v) => ({
        valid: sale_price > price,
        name: 'sp'
      })]
    },
    quantity: {
      value: quantity,
      validators: ['required', 'min:0']
    },
    available: {
      value: available,
      validators: ['required', 'min:0', available_valid]
    },
    defective: {
      value: defective,
      validators: ['required', 'min:0', defective_valid]
    }
  }))

  $: product_ids = items.map(item => item.product_id)
  $: free_products = products.filter(product => {
    return !product_ids.includes(product.id)
  })
  $: selected_product = products.find(product => product.id == product_id)

  async function load_products () {
    const result = await get({ url: '/api/v1/product' })
    products = result.items
  }

  function save () {
    let payload = {
      product_id,
      product_title: selected_product.title,
      product_unit: selected_product.unit,
      quantity,
      available,
      defective,
      discount,
      price,
      sale_price
    }
    dispatch('done', payload)
  }

  onMount(async () => {
    await load_products()
    console.log(initial)
    console.log(products)
    if (initial) {
      product_id = initial.product_id
      quantity = initial.quantity
      available = initial.available
      defective = initial.defective
      price = initial.price
      sale_price = initial.sale_price
      discount = initial.discount
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
        <div class="font-semibold">Form Tambah Item Pembelian</div>
        <div class="flex-grow"></div>
        <button 
          on:click={save}
          disabled={!$item_form.valid}
          class="appearance-none border-2 border-green-500 px-4 py-1 flex items-center font-bold rounded mr-4 disabled:opacity-50"
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
                <option value={product.id}>{product.title}</option>
              {/each}
            </select>
          {/if}
          {#if $item_form.fields.product_id.errors.includes('required')}
            <small class="block text-red-500 text-xs">produk harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Harga (Rp.)</label>
        <div class="w-2/3 flex flex-col">
          <Currency 
            bind:value={price} cls="py-1" 
          />
          {#if $item_form.fields.price.errors.includes('required')}
            <small class="block text-red-500 text-xs">harga harus diisi</small>
          {/if}
          {#if $item_form.fields.price.errors.includes('min')}
            <small class="block text-red-500 text-xs">harga tidak boleh kurang dari 1</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Harga Jual(Rp.)</label>
        <div class="w-2/3">
          <Currency 
            bind:value={sale_price} cls="py-1" 
          />
          {#if $item_form.fields.sale_price.errors.includes('required')}
            <small class="block text-red-500 text-xs">harga jual harus diisi</small>
          {/if}
          {#if $item_form.fields.sale_price.errors.includes('sp')}
            <small class="block text-red-500 text-xs">harga jual harus lebih besar atau sama dengan harga beli</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Qty</label>
        <div class="w-2/3">
          <input 
            type="number"
            bind:value={quantity} 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $item_form.fields.quantity.errors.includes('required')}
            <small class="block text-red-500 text-xs">pcs barang harus diisi</small>
          {/if}
          {#if $item_form.fields.quantity.errors.includes('min')}
            <small class="block text-red-500 text-xs">pcs barang tidak boleh kurang dari 1</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Qty kondisi baik</label>
        <div class="w-2/3">
          <input type="number" bind:value={available} class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $item_form.fields.available.errors.includes('required')}
            <small class="block text-red-500 text-xs">pcs barang kondisi baik harus diisi</small>
          {/if}
          {#if $item_form.fields.available.errors.includes('min')}
            <small class="block text-red-500 text-xs">pcs barang kondisi baik tidak boleh kurang dari 0</small>
          {/if}
          {#if $item_form.fields.available.errors.includes('av_valid')}
            <small class="block text-red-500 text-xs">pcs baik + pcs rusak = total pcs</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Qty kondisi rusak</label>
        <div class="w-2/3">
          <input type="number" bind:value={defective} class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $item_form.fields.defective.errors.includes('required')}
            <small class="block text-red-500 text-xs">pcs barang kondisi rusak harus diisi</small>
          {/if}
          {#if $item_form.fields.defective.errors.includes('min')}
            <small class="block text-red-500 text-xs">pcs barang kondisi rusak tidak boleh kurang dari 0</small>
          {/if}
          {#if $item_form.fields.defective.errors.includes('de_valid')}
            <small class="block text-red-500 text-xs">pcs baik + pcs rusak = total pcs</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/3">Diskon (%)</label>
        <div class="w-2/3">
          <input bind:value={discount} class="w-full border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>
    </div>
  </div>
</div>
