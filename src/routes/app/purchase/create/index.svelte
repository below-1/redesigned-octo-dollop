<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import { post, get } from '../../../../commons/api'
  import chrome_fdate from '../../../../commons/chrome_fdate'
  import fdate from '../../../../commons/fdate'
  import rupiah from '../../../../commons/rupiah'
  import '../../../../styles/jo-table.css'
  import ItemForm from './_comps/ItemForm.svelte'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'

  let supplier_id = null
  let status = null
  let content = ''
  let shipping = 0
  let discount = 0
  let created_at = chrome_fdate(new Date())
  let tax = 0
  let items = []
  let trans_status = null
  let trans_mode = null

  function calculate_grand_total ({ items, tax, discount, shipping }) {
    const items_total = items
      .map(it => (it.price - (it.price * it.discount)) * it.quantity )
      .reduce((a, b) => a + b, 0)
    console.log(`items_total = ${items_total}`)
    const discounted = items_total - (items_total * discount)
    console.log(`discounted = ${discounted}`)
    const taxed = discounted + (discounted * tax)
    console.log(`taxed = ${taxed}`)
    return taxed
  }

  $: nominal = rupiah(calculate_grand_total({ items, tax, discount, shipping }))

  let suppliers = []
  let show_add_form = false
  let show_edit_form = false
  let edit_item_data = {}

  let main_form = form(() => ({
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
    },
    trans_status: {
      value: trans_status,
      validators: ['required']
    },
    trans_mode: {
      value: trans_mode,
      validators: ['required']
    }
  }))

  function edit_item (product_id) {
    let item = items.find(it => it.product_id == product_id)
    edit_item_data = { ...item }
    show_edit_form = true
  }

  function remove_item (product_id) {
    items = items.filter(it => it.product_id != product_id)
  }

  async function load_supplier () {
    try {
      const result = await get({ url: '/api/v1/supplier' })
      suppliers = result.items
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data supplier')
    }
  }

  async function save () {
    let payload = {
      supplier_id,
      tax: `${tax}`,
      created_at: (new Date(created_at)).toISOString(),
      content,
      status,
      shipping: `${shipping}`,
      discount: `${discount}`,
      trans_status,
      trans_mode,
      items: items.map(it => ({
        ...it,
        price: `${it.price}`,
        sale_price: `${it.sale_price}`,
        discount: `${it.discount}`
      }))
    }
    try {
      const response = await post({
        url: '/api/v1/purchase',
        payload
      })
      console.log(response.data)
    } catch (err) {
      console.log(err)
      alert('gagal menambah data pembelian')
    }
  }

  onMount(async () => {
    await load_supplier()
  })
</script>

<div>
  <div class="bg-white mb-4 flex items-center px-4 py-2">
    <div class="font-bold text-lg">pembelian / pembelian baru</div>
    <div class="flex-grow"></div>
    <button 
      on:click={save}
      class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded py-1"
    >
      simpan
    </button>
  </div>

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
            {#if $main_form.fields.supplier_id.errors.includes('required')}
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
            {#if $main_form.fields.status.errors.includes('required')}
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
            {#if $main_form.fields.tax.errors.includes('required')}
              <small class="block text-red-500 text-xs">pajak harus diisi</small>
            {/if}
            {#if $main_form.fields.tax.errors.includes('min')}
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
            {#if $main_form.fields.shipping
              .errors.includes('required')}
              <small class="block text-red-500 text-xs">biaya pengiriman harus diisi</small>
            {/if}
            {#if $main_form.fields.shipping.errors.includes('min')}
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
            {#if $main_form.fields.discount
              .errors.includes('required')}
              <small class="block text-red-500 text-xs">diskon harus diisi</small>
            {/if}
            {#if $main_form.fields.discount.errors.includes('min')}
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

  <div class="bg-white px-4 mb-4 py-2">
    <div class="font-semibold mb-4">Form Transaksi</div>
    <div class="flex">
      <div class="w-1/2 text-sm pr-2">

        <div class="flex items-center mb-2">
          <label class="w-1/5">Status Transaksi</label>
          <div class="w-3/5">
            <select bind:value={trans_status} class="w-full border border-gray-300 rounded px-2 py-1">
              <option disabled value={null}>-- pilih status transaksi --</option>
              <option value='PENDING'>Sedang Diproses</option>
              <option value='CANCELLED'>Dibatalkan</option>
              <option value='FAILED'>Gagal</option>
              <option value='REJECTED'>Ditolak</option>
              <option value='SUCCESS'>Sukses</option>
            </select>
            {#if $main_form.fields.trans_status.errors.includes('required')}
              <small class="block text-red-500 text-xs">status harus diisi</small>
            {/if}
          </div>
        </div>

        <div class="flex items-center mb-2">
          <label class="w-1/5">Mode Pembayaran</label>
          <div class="w-3/5">
            <select bind:value={trans_mode} class="w-full border border-gray-300 rounded px-2 py-1">
              <option disabled value={null}>-- pilih mode transaksi --</option>
              <option value='OFFLINE'>Offline</option>
              <option value='CASH'>Kes</option>
              <option value='ON_DELIVERY'>On Delivery</option>
              <option value='CHEQUE_DRAFT'>Cheque</option>
              <option value='WIRED'>Wired</option>
              <option value='ONLINE'>Online</option>
            </select>
            {#if $main_form.fields.trans_mode.errors.includes('required')}
              <small class="block text-red-500 text-xs">mode transaksi harus diisi</small>
            {/if}
          </div>
        </div>

        <div class="flex items-center mb-2">
          <label class="w-1/5">Nominal</label>
          <div class="w-3/5">
            <input value={nominal} class="border border-gray-300 rounded px-2 py-1" />
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="bg-white px-4 mb-4 py-2">
    <div class="flex items-center">
      <div class="font-semibold mb-4">List Item Pembelian</div>
      <div class="flex-grow"></div>
      <button
        on:click={() => {
          show_add_form = true
        }}
        class="appearance-none border border-green-500 px-4 flex items-center font-bold rounded mr-4"
      >
        tambah item
      </button>
    </div>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>produk</th>
          <th>pcs</th>
          <th>harga beli</th>
          <th>harga jual</th>
          <th>diskon</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>{item.product_title}</td>
            <td>{item.quantity}</td>
            <td>{rupiah(item.price)}</td>
            <td>{item.sale_price}</td>
            <td>{item.discount}</td>
            <td>
              <div class="flex items-center justify-end">
                <button 
                  on:click={() => {
                    edit_item(item.product_id)
                  }}
                  class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300"
                >
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </button>
                <button 
                  on:click={() => {
                    remove_item(item.product_id)
                  }}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300 mr-2">
                  <div class="w-3 h-3 text-red-500">
                    <FaTrash />
                  </div>
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if show_add_form}
  <ItemForm 
    {items}
    on:done={(event) => {
      items = [ ...items, event.detail ]
      show_add_form = false
    }}
    on:close={() => {
      show_add_form = false
    }}
  />
{/if}

{#if show_edit_form}
  <ItemForm 
    {items}
    edit
    initial={edit_item_data}
    on:done={(event) => {
      let edit_index = items.findIndex(it => it.product_id == edit_item_data.product_id)
      items[edit_index] = event.detail
      items = [ ...items ]
      show_edit_form = false
    }}
    on:close={() => {
      show_edit_form = false
    }}
  />
{/if}