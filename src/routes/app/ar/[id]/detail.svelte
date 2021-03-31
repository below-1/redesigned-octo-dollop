<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<style>
  .card-detail {
    border: 2px dashed rgb(210, 210, 210);
    border-collapse: collapse;
  }
  .card-detail h1 {
    font-size: 1rem;
    font-weight: 600;
    padding: 4px 20px;
  }
  .card-detail li {
    border-bottom: 2px dashed rgb(210, 210, 210);
    padding: 6px 20px;
    font-size: 1rem;
    font-weight: bold;
    font-family: monospace;
    display: flex;
    justify-content: space-between;
    align-items: center; 
  }
  .card-detail li:last-child {
    border-bottom: none;
  }
</style>

<script>
  import { onMount } from 'svelte'
  import { format } from 'date-fns'
  import rupiah from '../../../../commons/rupiah'
  import { put, get } from '../../../../commons/api'
  import '../../../../styles/jo-table.css'

  export let id
  let delay = {}
  let order = {}
  let customer = {}
  let payments = []
  let transaction = {}

  function just_date (s) {
    if (!s) return ''
    return format(new Date(s), "dd MMMM',' yyyy")
  }
  
  async function load_ar (id) {
    if (!process.browser) return
    const url = `/api/v1/ar/${id}`
    try {
      const result = await get({
        url
      })
      const { order: _order, payments: _payments, ..._delay } = result
      const { user: _user, transaction: _transaction, ...__order } = _order
      order = __order
      payments = _payments
      delay = _delay
      customer = _user
      transaction = _transaction
      delay = _delay

      // console.log('delay')
      // console.log(delay)
      // console.log('order')
      // console.log(order)
      // console.log('customer')
      // console.log(customer)
      // console.log('payments')
      // console.log(payments)
      // console.log('transaction')
      // console.log(transaction)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data piutang')
    }
  }

  $: load_ar(id)
</script>

<div class="cont">
  <section class="header flex text-sm">
    <div class="font-bold text-lg">piutang / detail piutang #{id}</div>
    <div class="flex-grow"></div>
    <a href={`/app/ar/${id}/add_payment`} class="primary">
      tambah pembayaran
    </a>
  </section>
  <section class="bg-white w-1/2 mr-4 card-detail">
    <h1>Detail Piutang</h1>
    <ul>
      <li>
        <div>Kustomer</div>
        <div>
          <a href={`/app/customer/${customer.id}/edit`}>{customer.first_name}</a>
        </div>
      </li>
      <li>
        <div>Tanggal Hutang</div>
        <div>
          {just_date(order.created_at)}
        </div>
      </li>
      <li>
        <div>Batas Waktu</div>
        <div>
          {just_date(delay.due_date)}
        </div>
      </li>
      <li>
        <div>Total Piutang</div>
        <div>
          {rupiah(parseInt(delay.total))}
        </div>
      </li>
      <li>
        <div>Sudah Dibayar</div>
        <div></div>
      </li>
    </ul>
  </section>

  <section class="bg-white">
    <h1 class="p-4 font-bold">
      Daftar Pembayaran
    </h1>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>tanggal</th>
          <th>nominal</th>
          <th></th>
        </tr>
      </thead>
    </table>
  </section>
</div>