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

  async function load_purchase ({ per_page, page }) {
    if (!process.browser) return;
    try {
      const result = await get({
        url: '/api/v1/purchase',
        params: {
          per_page,
          page
        }
      })
      items = result.items
      total_page = result.total_page
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data pembelian')
    }
  }

  $: load_purchase({ per_page, page })
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>total data</div>
      <div>{items.length}</div>
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
    <button class="outline-primary mr-4">
      print
    </button>
    <a href="/app/purchase/create" class="primary" role="button">
      pembelian baru
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>supplier</th>
          <th>total</th>
          <th>waktu</th>
          <th>status pembayaran</th>
          <th>status orderan</th>
          <th>metode pembayaran</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr>
            <td>
              <a class="just-link" href={`/app/supplier/${item.user.id}/detail`}>
                {item.user.first_name}
              </a>
            </td>
            <td>{rupiah(parseInt(item.grand_total))}</td>
            <td>{fdate(new Date(item.created_at))}</td>
            <td>
              {#if item.delay}
                <div class="text-yellow-700 font-bold">utang</div>
              {:else}
                <div class="text-gren-700 font-bold">lunas</div>
              {/if}
            </td>
            <td class="lowercase">{item.status}</td>
            <td class="lowercase">{item.transaction.mode}</td>
            <td>
              <div class="flex items-center justify-end">
                <a href={`/app/purchase/${item.id}/detail`} class="rd-action mr-2">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
                <button 
                  on:click={() => {
                    
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