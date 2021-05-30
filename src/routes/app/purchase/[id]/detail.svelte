<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import rupiah from '../../../../commons/rupiah'
  import { put, get } from '../../../../commons/api'
  import '../../../../styles/jo-table.css'

  export let id

  let order = {}
  let transaction = {}
  let delay = {}
  let user = {}
  let items = []

  $: total_pcs = items.map(it => it.quantity).reduce((a, b) => a + b, 0)

  let order_status = null
  let transaction_status = null
  let transaction_mode = null

  const update_form = form(() => ({
    transaction_status: {
      value: transaction_status,
      validators: ['required']
    },
    transaction_mode: {
      value: transaction_mode,
      validators: ['required']
    },
    order_status: {
      value: order_status,
      validators: ['required']
    }
  }))

  function calculate_sub_total ({ items }) {
    return items.map(it => (it.price - (it.price * it.discount)) * it.quantity).reduce((a,b) => a + b, 0)
  }

  function calculate_grand_total ({ items, order }) {
    const { discount, tax, shipping } = order
    const items_total = items
      .map(it => (it.sale_price - (it.sale_price * it.discount)) * it.quantity )
      .reduce((a, b) => a + b, 0)
    const discounted = items_total - (items_total * discount)
    const taxed = discounted + (discounted * tax)
    return taxed
  }

  async function load_order (id) {
    try {
      const result = await get({
        url: `/api/v1/purchase/${id}`
      })
      order = result.order
      user = order.user
      transaction = order.transaction
      delay = order.delay
      items = result.items

      order_status = order.status
      transaction_status = transaction.status
      transaction_mode = transaction.mode
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data penjualan')
    }
  }

  async function save () {
    const payload = {
      order_status,
      transaction_status,
      transaction_mode
    }
    const url = `/api/v1/purchase/${id}`
    try {
      const result = await put({
        url,
        payload
      })
      alert('sukses mengubah data pembelian')
    } catch (err) {
      console.log(err)
      alert('gagal mengubah data pembelian')
    }
  }

  onMount(() => {
    if (id) {
      load_order(id)
    }
  })
</script>

<style>
  .hor-field {
    display: flex;
    align-items: center;
  }
  .hor-field label {
    width: 40%;
  }
  .hor-field > div, .hor-field > input, .hor-field > select {
    width: 60%;
  }
  .hor-field input, .hor-field select {
    padding: 2px 4px;
    border: 1px solid rgb(230, 230, 230);
  }

  .order-detail {
    border: 2px dashed rgb(210, 210, 210);
    border-collapse: collapse;
  }
  .order-detail h1 {
    font-size: 1rem;
    font-weight: 600;
    padding: 4px 20px;
  }
  .order-detail li {
    border-bottom: 2px dashed rgb(210, 210, 210);
    padding: 6px 20px;
    font-size: 1rem;
    font-weight: bold;
    font-family: monospace;
    display: flex;
    justify-content: space-between;
    align-items: center; 
  }
  .order-detail li:last-child {
    border-bottom: none;
  }
</style>

<div class="cont">

  <section class="bg-white flex items-center px-4 py-2">
    <div class="font-bold text-lg">pembelian / detail pembelian #{id}</div>
    <div class="flex-grow"></div>
  </section>

  <section class="bg-white w-1/2 p-4">

    <div class="mb-4 hor-field">
      <label>status orderan:</label>
      <select bind:value={order_status}>
        <option disabled value={null}>--  pilih status orderan --</option>
        <option value='CHECKOUT'>Checkout</option>
        <option value='PAID'>Sudah Dibayar</option>
        <option value='DELIVERED'>Barang Diterima</option>
        <option value='RETURNED'>Retur</option>
        <option value='COMPLETE'>Selesai</option>
      </select>
    </div>

    <div class="mb-4 hor-field">
      <label>status pembayaran:</label>
      <select bind:value={transaction_status}>
        <option disabled value={null}>-- pilih status transaksi --</option>
        <option value='PENDING'>Sedang Diproses</option>
        <option value='CANCELLED'>Dibatalkan</option>
        <option value='FAILED'>Gagal</option>
        <option value='REJECTED'>Ditolak</option>
        <option value='SUCCESS'>Sukses</option>
      </select>
    </div>

    <div class="mb-4 hor-field">
      <label>mode pembayaran:</label>
      <select bind:value={transaction_mode}>
        <option disabled value={null}>-- pilih mode transaksi --</option>
        <option value='OFFLINE'>Offline</option>
        <option value='CASH'>Kes</option>
        <option value='ON_DELIVERY'>On Delivery</option>
        <option value='CHEQUE_DRAFT'>Cheque</option>
        <option value='WIRED'>Wired</option>
        <option value='ONLINE'>Online</option>
      </select>
    </div>

    <button :disabled={!$update_form.valid} on:click={save} class="primary disabled:opacity-50">simpan</button>
  </section>

  <section class="flex">
    <div class="bg-white w-1/2 mr-2 order-detail">
      <h1>Detail Order</h1>
      <ul>
        <li>
          <div>Supplier</div>
          <div>{user.first_name}</div>
        </li>
        <li>
          <div>Waktu</div>
          <div>{order.created_at}</div>
        </li>
        <li>
          <div>Total PCS</div>
          <div>{total_pcs}</div>
        </li>
        <li>
          <div>Total Harga</div>
          <div>{rupiah(parseInt(order.grand_total))}</div>
        </li>
        <li>
          <div>Diskon</div>
          <div>{(order.discount * 100).toFixed()} %</div>
        </li>
        <li>
          <div>Pajak</div>
          <div>{order.tax}</div>
        </li>
        <li>
          <div>Pengiriman</div>
          <div>{order.shipping}</div>
        </li>
        <li>
          <div>Keterangan</div>
          <div>{order.content ? order.content : '-'}</div>
        </li>
      </ul>
    </div>

    <div class="order-detail bg-white w-1/2 ml-2">
      <h1>Detail Pembayaran</h1>
      <ul>
        <li>
          <div>jumlah bayar</div>
          <div>{rupiah(parseInt(transaction.nominal))}</div>
        </li>
        <li>
          <div>status pembayaran</div>
          <div>{transaction.status}</div>
        </li>
        <li>
          <div>metode pembayaran</div>
          <div>{transaction.mode}</div>
        </li>
      </ul>
    </div>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>produk</th>
          <th>satuan</th>
          <th>jumlah</th>
          <th>harga beli</th>
          <th>harga jual</th>
          <th>diskon</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>{item.product.title}</td>
            <td>{item.product.unit}</td>
            <td>{item.quantity}</td>
            <td>{rupiah(parseInt(item.price))}</td>
            <td>{rupiah(parseInt(item.sale_price))}</td>
            <td>{(item.discount * 100).toFixed()} %</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

</div>