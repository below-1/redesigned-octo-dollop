<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import { addDays, format } from 'date-fns'
  import { post, get } from '../../../../commons/api'
  import datetime_validator from '../../../../commons/datetime_validator'
  import DateTimeInput from '../../../../components/DateTimeInput.svelte'
  import Currency from '../../../../components/Currency.svelte'
  import OrderForm from '../../_comps/OrderForm.svelte'
  import OrderTransactionForm from '../../_comps/OrderTransactionForm.svelte'
  import chrome_fdate from '../../../../commons/chrome_fdate'
  import fdate from '../../../../commons/fdate'
  import rupiah from '../../../../commons/rupiah'
  import '../../../../styles/jo-table.css'
  import ItemForm from './_comps/ItemForm.svelte'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'

  let order = {
    user_id: null,
    status: null,
    content: '',
    shipping: 0,
    discount: 0,
    tax: 0,
    created_at: new Date()
  }
  let transaction = {
    status: null,
    mode: null,
    nominal: 0,
    delay_due_date: null
  }
  let items = []

  function calculate_sub_total ({ items }) {
    return items.map(it => (it.price - (it.price * it.discount)) * it.quantity).reduce((a,b) => a + b, 0)
  }

  function calculate_grand_total ({ items, order }) {
    const { discount, tax, shipping } = order
    const items_total = items
      .map(it => (it.price - (it.price * it.discount)) * it.quantity )
      .reduce((a, b) => a + b, 0)
    const discounted = items_total - (items_total * discount)
    const taxed = discounted + (discounted * tax)
    return taxed
  }

  $: sub_total = calculate_sub_total({ items })
  $: grand_total = calculate_grand_total({ items, order })
  $: total_ap = grand_total - transaction.nominal
  $: formatted_total_ap = rupiah(total_ap)
  $: need_delay = total_ap > 0
  $: {
    console.log('grand_total = ', grand_total)
    console.log('transaction.nominal', transaction.nominal)
    console.log('total_ap = ', total_ap)
    console.log('need_delay = ', need_delay)
  }

  function format_due_date ({ need_delay, order, transaction }) {
    const { created_at } = order
    const { delay_due_date } = transaction
    if (!need_delay) return '-'
    if (!delay_due_date) return '-'
    const new_date = addDays(created_at, delay_due_date)
    return fdate(new_date)
  }
  $: formatted_due_date = format_due_date ({ need_delay, order, transaction })

  let suppliers = []
  let show_add_form = false
  let show_edit_form = false
  let edit_item_data = {}

  let main_form = form(() => ({
    user_id: {
      value: order.user_id,
      validators: ['required']
    },
    status: {
      value: order.status,
      validators: ['required']
    },
    shipping: {
      value: order.shipping,
      validators: ['required', 'min:0'],
    },
    discount: {
      value: order.discount,
      validators: ['required', 'min:0']
    },
    tax: {
      value: order.tax,
      validators: ['required', 'min:0']
    },
    created_at: {
      value: order.created_at,
      validators: [datetime_validator]
    },
    trans_status: {
      value: transaction.status,
      validators: ['required']
    },
    trans_mode: {
      value: transaction.mode,
      validators: ['required']
    },
    trans_nominal: {
      value: transaction.nominal,
      validators: ['required', 'min:0', (x) => {
        const valid = x <= grand_total
        return {
          valid,
          name: 'max'
        }
      }]
    },
    delay: {
      value: transaction.delay_due_date,
      validators: [(x) => {
        if (!need_delay) return {
          valid: true,
          name: 'required'
        }
        if (x === null || x === undefined) return {
          valid: false,
          name: 'required'
        }
        if (x < 1) return {
          valid: false,
          name: 'min'
        }
        return {
          valid: true,
          name: 'min'
        }
      }]
    }
  }))

  $: form_valid = $main_form.valid && items.length > 0

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
      supplier_id: order.user_id,
      tax: `${order.tax}`,
      created_at: (new Date(order.created_at)),
      content: order.created_at,
      status: order.status,
      shipping: `${order.shipping}`,
      discount: `${order.discount}`,
      trans_status: transaction.status,
      trans_mode: transaction.mode,
      trans_nominal: transaction.nominal,
      delay_due_date: transaction.delay_due_date,
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
      alert('sukses menambah data pembelian')
      window.history.back()
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
      disabled={!form_valid}
      class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded py-1 disabled:opacity-50"
    >
      simpan
    </button>
  </div>

  <OrderForm 
    type="PURCHASE"
    bind:order={order}
    validation={$main_form}
  />

  <OrderTransactionForm
    bind:transaction={transaction}
    validation={$main_form}
    delay={need_delay}
    {formatted_due_date}
    {formatted_total_ap}
  />

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
          <th>jumlah</th>
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
            <td>{item.product_title} ({item.product_unit})</td>
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