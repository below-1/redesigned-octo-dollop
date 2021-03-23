<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import { post, get } from '../../../commons/api'
  import chrome_fdate from '../../../commons/chrome_fdate'
  import fdate from '../../../commons/fdate'
  import rupiah from '../../../commons/rupiah'
  import '../../../styles/jo-table.css'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import OrderItemForm  from './_comps/OrderItemForm.svelte'

  let customer_id = null
  let tax = 0
  let discount = 0
  let shipping = 0
  let content = null
  let created_at = chrome_fdate(new Date())
  let status = null
  let trans_status = null
  let trans_mode = null
  let trans_nominal = 0
  let delay_due_date = null
  let items = []

  function calculate_sub_total ({ items }) {
    return items.map(it => (it.price - (it.price * it.discount)) * it.quantity).reduce((a,b) => a + b, 0)
  }

  function calculate_grand_total ({ items, tax, discount, shipping }) {
    const items_total = items
      .map(it => (it.sale_price - (it.sale_price * it.discount)) * it.quantity )
      .reduce((a, b) => a + b, 0)
    console.log(`items_total = ${items_total}`)
    const discounted = items_total - (items_total * discount)
    console.log(`discounted = ${discounted}`)
    const taxed = discounted + (discounted * tax)
    console.log(`taxed = ${taxed}`)
    return taxed
  }

  $: sub_total = calculate_sub_total({ items })
  $: grand_total = calculate_grand_total({ items, tax, discount, shipping })
  $: total_ap = grand_total - trans_nominal
  $: need_delay = total_ap > 0

  let customers = []
  let show_add_form = false
  let show_edit_form = false
  let edit_item_data = {}

  let main_form = form(() => ({
    customer_id: {
      value: customer_id,
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
    },
    trans_nominal: {
      value: trans_nominal,
      validators: ['required']
    }
  }))

  $: form_valid = $main_form.valid && items.length > 0

  async function load_customer () {
    try {
      const result = await get({ url: '/api/v1/customer' })
      customers = result.items
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data customer')
    }
  }

  async function save () {
    let payload = {
      customer_id,
      tax,
      discount,
      shipping,
      status,
      trans_mode,
      trans_status,
      trans_nominal,
      created_at: (new Date(created_at)).toISOString(),
      content,
      delay_due_date: `${delay_due_date}`,
      items: items.map(it => ({
        product_id: it.product_id,
        item_id: it.item_id,
        quantity: it.quantity
      }))
    }
    try {
      const response = await post({
        url: '/api/v1/sale',
        payload
      })
      console.log(response)
    } catch (err) {
      console.log(err)
      alert('gagal menambah data penjualan')
    }
  }

  onMount(async () => {
    await load_customer()
  })
</script>

<div>
  <div class="bg-white mb-4 flex items-center px-4 py-2">
    <div class="font-bold text-lg">penjualan / penjualan baru</div>
    <div class="flex-grow"></div>
    <button 
      on:click={save}
      disabled={!form_valid}
      class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded py-1 disabled:opacity-50"
    >
      simpan
    </button>
  </div>

  <div class="bg-white px-4 mb-4 py-2">
    <div class="font-semibold mb-4">Form Order</div>
    <div class="flex">

      <div class="w-1/2 text-sm pr-2">

        <div class="flex items-center mb-4">
          <label class="w-1/5">Pilih Pelanggan</label>
          <div class="w-3/5">
            <select 
              bind:value={customer_id} 
              class="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option disabled value={null}>--  pilih pelanggan --</option>
              {#each customers as customer}
                <option value={customer.id}>{customer.first_name}</option>
              {/each}
            </select>
            {#if $main_form.fields.customer_id.errors.includes('required')}
              <small class="block text-red-500 text-xs">pelanggan harus diisi</small>
            {/if}
          </div>
        </div>

        <div class="flex items-center mb-4">
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

        <div class="flex items-center mb-4">
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

        <div class="flex items-center mb-4">
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
            <input 
              placeholder={grand_total} 
              bind:value={trans_nominal} class="border border-gray-300 rounded px-2 py-1" />
          </div>
        </div>

        {#if trans_nominal < grand_total}
          <div class="flex items-center mb-2">
            <label class="w-1/5">batas waktu (hari)</label>
            <div class="w-3/5">
              <input 
                type="number"
                bind:value={delay_due_date}
                class="border border-gray-300 rounded px-2 py-1" />
            </div>
          </div>
        {/if}

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
            <td>{rupiah(item.sale_price)}</td>
            <td>{(item.discount * 100)} %</td>
            <td>
              <div class="flex items-center justify-end">
                <button 
                  on:click={() => {
                    let data = items.find(it => it.product_id == item.product_id)
                    edit_item_data = { ...data }
                    show_edit_form = true
                  }}
                  class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300"
                >
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </button>
                <button 
                  on:click={() => {
                    // remove_item(item.product_id)
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
        <tr>
          <td colspan="6">sub total</td>
          <td>{rupiah(sub_total)}</td>
        </tr>
        <tr>
          <td colspan="6">grand total</td>
          <td>{rupiah(grand_total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

{#if show_add_form}
  <OrderItemForm 
    order_items={items}
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
  <OrderItemForm 
    order_items={items}
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