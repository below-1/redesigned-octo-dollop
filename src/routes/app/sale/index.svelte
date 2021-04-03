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
  import { del_confirm } from '../store'

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
      pembelian baru
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

  <section class="pagination">
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
  </section>

</div>