<script>
  import { onMount } from 'svelte'
  import ButtonMenu from '../../../components/ButtonMenu.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import rupiah from '../../../commons/rupiah'
  import fdate from '../../../commons/fdate'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'
  import { del_confirm } from '../store'

  let per_page = 10
  let page = 0
  let items = []
  let total_page = 0
  let total_data = 0
  let report_year = 2020
  let report_month = 1
  let report_dialog = false

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

  function on_delete (id) {
    const url = `/api/v1/sale/${id}`
    del_confirm.show({
      entity: 'penjualan',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_sales({ per_page, page })
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data penjualan')
        }
      }
    })
  }

  $: load_sales({ per_page, page })
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>data penjualan</div>
      <div>{total_data}</div>
    </div>
    <div class="group-input">
      <label>per halaman</label>
      <input
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
    <button class="outline-primary mr-2">
      print
    </button>
    <a href="/app/sale/create" class="primary">
      penjualan baru
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th></th>
          <th>pelanggan</th>
          <th>waktu</th>
          <th>harga total</th>
          <th>nominal bayar</th>
          <th>keterangan</th>
          <th>status pembayaran</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr>
            <td>{item.id}</td>
            <td>
              <a class="just-link" href={`/app/customer/${item.user.id}/detail`}>
                {item.user.first_name}
              </a>
            </td>
            <td>{fdate(new Date(item.created_at))}</td>
            <td>{rupiah(parseInt(item.grand_total))}</td>
            <td>{rupiah(parseInt(item.transaction.nominal))}</td>
            <td>{item.content ? item.content : ''}</td>
            <td>{item.transaction.status}</td>
            <td>
              <div class="flex items-center justify-end">
                <a href={`/app/sale/${item.id}/detail`} class="rd-action mr-2">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
                <button 
                  on:click={() => {
                    on_delete(item.id)
                  }}
                  class="rd-action">
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

  <Pagination
    total_page={total_page}
    {page}
    on:change={event => {
      page = event.detail
    }}
  />

</div>

{#if report_dialog}
  <div
    class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
    style="z-index: 100; background: rgb(250, 250, 250, 0.8); min-width: 500px;"
  >
    <div class="p-6 bg-white rounded shadow-xl">
      <div 
        class="font-bold text-gray-600 text-lg"
        style="max-width: 500px;" 
      >Form Laporan Penjualan</div>
      <div class="flex flex-col items-center mt-2">
        <div>
          <div class="flex flex-col mb-3">
            <label class="text-sm">Tahun</label>
            <input type="number" placeholder="tahun" />
          </div>
          <div class="flex flex-col mb-3">
            <label class="text-sm">Bulan</label>
            <select>
              <option disabled>-- pilih bulan --</option>
            </select>
          </div>
        </div>
        <div>
          <button 
            class="apperance-none bg-blue-600 text-white px-6 py-1 font-bold mr-2 rounded">print</button>
        </div>
      </div>
    </div>
  </div>
{/if}