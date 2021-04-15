<script>
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import rupiah from '../../../commons/rupiah'
  import fdate from '../../../commons/fdate'

  let total_data = 0
  let total_page = 0
  let page = 0
  let per_page = 10

  let items = []

  async function load_ar ({ per_page, page }) {
    if (!process.browser) return;
    const url = '/api/v1/ar'
    try {
      const result = await get({
        url,
        params: {
          per_page,
          page
        }
      })
      total_data = result.total_data
      total_page = result.total_page
      items = result.items.map(it => ({
        ...it,
        order_grand_total: parseInt(it.order_grand_total),
        total: parseInt(it.total),
        paid: it.paid ? parseInt(it.paid) : 0
      }))
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data piutang')
    }
  }

  $: load_ar({ per_page, page })
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>data hutang</div>
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
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>kustomer</th>
          <th>penjualan</th>
          <th>total bayar</th>
          <th>tersisa</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{(i + 1) + (per_page * page)}</td>
            <td>
              <a href={`/app/customer/${item.customer_id}/edit`} class="just-link">{item.customer}</a>
            </td>
            <td>
              <a href={`/app/sale/${item.order_id}/detail`} class="just-link">{item.order_id}</a>
            </td>
            <td>{rupiah(item.total)}</td>
            <td>{rupiah(item.paid)}</td>
            <td></td>
            <td>
            <td>
              <div class="flex items-center">
                <a href={`/app/ar/${item.id}/detail`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
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