<script>
  import { onMount } from 'svelte'
  import { post, get } from '../../../../../commons/api'
  import chrome_fdate from '../../../../../commons/chrome_fdate'
  import { form } from 'svelte-forms'

  export let initial = null

  let supplier_id = null
  let status = null
  let content = ''
  let shipping = 0
  let discount = 0
  let created_at = chrome_fdate(new Date())
  let tax = 0

  let order_form = form(() => ({
    supplier_id: {
      value: supplier_id,
      validators: ['required']
    },
    status: {
      value: status,
      validators: ['required']
    },
    shipping: {
      value: shipping,
      validators: ['required', 'min:0'],
    },
    discount: {
      value: discount,
      validators: ['required', 'min:0']
    },
    tax: {
      value: tax,
      validators: ['required', 'min:0']
    }
  }))

  $: errors = $order_form.fields;

  let suppliers = []

  async function load_supplier () {
    try {
      const result = await get({ url: '/api/v1/supplier' })
      suppliers = result.items
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data supplier')
    }
  }

  export function get_data () {
    return {
      supplier_id,
      status,
      content,
      shipping,
      discount,
      created_at,
      tax
    }
  }

  onMount(async () => {
    await load_supplier()
    if (initial) {
      supplier_id = initial.supplier_id
      status = initial.status
      content = initial.content
      shipping = initial.shipping
      discount = initial.discount
      created_at = initial.created_at
      tax = initial.tax
    }
  })
</script>

<div class="bg-white px-4 mb-4 py-2">
  <div class="font-semibold mb-4">Form Order</div>
  <div class="flex">

    <div class="w-1/2 text-sm pr-2">

      <div class="flex items-center mb-2">
        <label class="w-1/5">Pilih Supplier</label>
        <div class="w-3/5">
          <select 
            bind:value={supplier_id} 
            class="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option disabled value={null}>--  pilih supplier --</option>
            {#each suppliers as supplier}
              <option value={supplier.id}>{supplier.first_name}</option>
            {/each}
          </select>
          {#if $order_form.fields.supplier_id.errors.includes('required')}
            <small class="block text-red-500 text-xs">supplier harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-2">
        <label class="w-1/5">Status Orderan</label>
        <div class="w-3/5">
          <select class="w-full border border-gray-300 rounded px-2 py-1" bind:value={status}>
            <option disabled value={null}>--  pilih status orderan --</option>
            <option value='CHECKOUT'>Checkout</option>
            <option value='PAID'>Sudah Dibayar</option>
            <option value='DELIVERED'>Barang Diterima</option>
            <option value='RETURNED'>Retur</option>
            <option value='COMPLETE'>Selesai</option>
          </select>
          {#if $order_form.fields.status.errors.includes('required')}
            <small class="block text-red-500 text-xs">status orderan harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-2">
        <label class="w-1/5">Pajak</label>
        <div class="w-3/5">
          <input 
            bind:value={tax}
            type="number" 
            step="0.1" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $order_form.fields.tax.errors.includes('required')}
            <small class="block text-red-500 text-xs">pajak harus diisi</small>
          {/if}
          {#if $order_form.fields.tax.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>
      <div class="flex items-center mb-2">
        <label class="w-1/5">Shipping</label>
        <div class="w-3/5">
          <input 
            bind:value={shipping}
            type="number" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $order_form.fields.shipping
            .errors.includes('required')}
            <small class="block text-red-500 text-xs">biaya pengiriman harus diisi</small>
          {/if}
          {#if $order_form.fields.shipping.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>
      <div class="flex items-center">
        <label class="w-1/5">Diskon (%)</label>
        <div class="w-3/5">
          <input 
            bind:value={discount}
            type="number" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if $order_form.fields.discount
            .errors.includes('required')}
            <small class="block text-red-500 text-xs">diskon harus diisi</small>
          {/if}
          {#if $order_form.fields.discount.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>

    </div>

    <div class="w-1/2 text-sm pl-2">
      <div class="flex items-center mb-2">
        <label class="w-1/5">Waktu Pembelian</label>
        <input bind:value={created_at} type="datetime-local" class="w-3/5 border border-gray-300 rounded px-2 py-1" />
      </div>
      <div class="flex flex-col">
        <label>Keterangan</label>
        <textarea rows="5" bind:value={content} class="w-4/5 border border-gray-300 rounded px-2 py-1"></textarea>
      </div>
    </div>
  </div>
</div>