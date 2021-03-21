<script>
  import { onMount } from 'svelte'
  import ButtonMenu from '../../../components/ButtonMenu.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import rupiah from '../../../commons/rupiah'
  import fdate from '../../../commons/fdate'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'

  let per_page = 10
  let page = 0
  let items = []
  let total_page = 0
  let total_data = 0

  async function load_sales ({ per_page, page }) {
    if (!process.browser) return;
    try {
      const result = await get({
        url: '/api/v1/sale',
        params: {
          per_page,
          page
        }
      })
      items = result.items
      total_page = result.total_page
      total_data = result.total_data
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data penjualan')
    }
  }

  $: load_sales({ per_page, page })
</script>

<div class="bg-white p-4">
  <div class="flex my-4 text-sm">
    <div class="flex mr-4">
      <div class="bg-gray-200 font-bold px-2 py-1 flex items-center">data penjualan</div>
      <div class="bg-blue-600 text-white font-bold flex items-center px-2">{total_data}</div>
    </div>
    <div class="border border-gray-400 flex items-stretch rounded">
      <div class="bg-gray-200 inline-block flex items-center px-3 text-gray-500 rounded-l">per halaman</div>
      <input
        class="font-thin rounded px-2"
        value={per_page}
        type="number"
        min="10"
        on:change={(event) => {
          page = 0
          per_page = parseInt(event.target.value)
        }}
      />
    </div>
    <div class="flex-grow"></div>
    <button class="appearance-none border border-green-500 px-4 flex items-center font-bold rounded mr-4">
      print
    </button>
    <a href="/app/sale/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded">
      pembelian baru
    </a>
  </div>

  <table class="jo-table">
    <thead>
      <tr>
        <th>pelanggan</th>
        <th>waktu</th>
        <th>total</th>
        <th>keterangan</th>
        <th>status pembayaran</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each items as item}
        <tr>
          <td>{item.user.first_name}</td>
          <td>{fdate(new Date(item.created_at))}</td>
          <td>{rupiah(item.grand_total)}</td>
          <td>{item.content ? item.content : ''}</td>
          <td>{item.transaction.status}</td>
          <td>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="my-4">
    {#each Array(total_page) as _, i}
      <button
        on:click={() => {
          page = i;
        }}
        class="inline-block rounded px-2 py-1 text-center text-xs font-bold border border-gray-300 mr-2"
      >
        { i + 1 }
      </button>
    {/each}
  </div>
</div>