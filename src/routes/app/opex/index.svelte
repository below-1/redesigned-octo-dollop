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

  async function remove_op_instance (id) {
    try {
      const result = await del({
        url: `/api/v1/opex/${id}`
      })
      console.log(result)
    } catch (err) {
      console.log(err)
      alert('gagal menghapus data beban usaha')
    } finally {
      await load_op_instances({ per_page, page })
    }
  }

  async function load_op_instances ({ per_page, page }) {
    if (!process.browser) return;
    try {
      const result = await get({
        url: '/api/v1/opex',
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
      alert('gagal mengambil data beban usaha')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/opex/${id}`
    del_confirm.show({
      entity: 'beban usaha',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_op_instances({ per_page, page })
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data beban usaha')
        }
      }
    })
  }

  $: load_op_instances({ per_page, page })
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="flex mr-4">
      <div class="bg-gray-200 font-bold px-2 py-1 flex items-center">data beban usaha</div>
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
    <a href="/app/opex/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded">
      data baru
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>jenis</th>
          <th>waktu</th>
          <th>metod pembayaran</th>
          <th>status</th>
          <th>nominal</th>
          <th>keterangan</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item}
          <tr>
            <td>{item.opex.name}</td>
            <td>{fdate(new Date(item.created_at))}</td>
            <td class="lowercase">{item.mode}</td>
            <td class="lowercase">{item.status}</td>
            <td>{rupiah(parseInt(item.nominal))}</td>
            <td>{item.content ? item.content : ''}</td>
            <td>
              <div class="flex items-center">
                <button 
                  on:click={() => {
                    on_delete(item.id)
                  }}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300 mr-2">
                  <div class="w-3 h-3 text-red-500">
                    <FaTrash />
                  </div>
                </button>
                <a 
                  href={`/app/opex/${item.id}/edit`}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300"
                >
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