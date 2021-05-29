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
    font-size: 0.94rem;
    font-weight: 600;
    padding: 8px 20px;
  }
  .card-detail li {
    border-bottom: 2px dashed rgb(210, 210, 210);
    padding: 6px 20px;
    font-size: 0.86rem;
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
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'

  export let id
  let delay = {}
  let order = {}
  let customer = {}
  let admin = {}
  let payments = []
  let transaction = {}

  $: paid = rupiah(payments.map(p => parseInt(p.nominal)).reduce((a, b) => a + b, 0))

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
      const { admin: _admin, order: _order, payments: _payments, ..._delay } = result
      const { user: _user, transaction: _transaction, ...__order } = _order
      admin = _admin
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

  function on_delete_payment(id) {
    console.log('deleting payment')
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
        <div>Pelanggan</div>
        <div>
          <a href={`/app/customer/${customer.id}/edit`}>{customer.first_name}</a>
        </div>
      </li>
      <li>
        <div>Pegawai</div>
        <div>
          {admin.first_name}
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
        <div>{paid}</div>
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
          <th>admin</th>
          <th>tanggal</th>
          <th>nominal</th>
          <th>metode pembayaran</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each payments as pay, i}
          <tr>
            <td>{i + 1}</td>
            <td>
              <a href={`/app/employee/${pay.user.id}/edit`} class="just-link">{pay.user.first_name}</a>
            </td>
            <td>{just_date(pay.created_at)}</td>
            <td>{rupiah(parseInt(pay.nominal))}</td>
            <td class="lowercase">{pay.mode}</td>
            <td>
              <div class="flex items-center justify-end">
                <a href={`/app/ar/payment/${pay.id}/edit`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
                <button 
                  on:click={() => {
                    on_delete_payment(pay.id)
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
  </section>
</div>