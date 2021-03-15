<script>
  import { onMount } from 'svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'  
  import { del_confirm } from '../store'

  let items = []
  let keyword = ''
  let page = 0
  let per_page = 20
  let total_page = 0

  $: load_customer({ keyword, page, per_page });

  async function load_customer ({ keyword, page, per_page }) {
    if (!process.browser) return; 
    try {
      const result = await get({
        url: '/api/v1/customer',
        params: {
          keyword,
          page,
          per_page
        }
      })
      items = result.items
      total_page = result.total_page
      console.log(items)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data pelanggan')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/customer/${id}`
    del_confirm.show({
      entity: 'pelanggan',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_customer({ keyword, per_page, page })
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data pelanggan')
        }
      }
    })
  }
</script>

<div class="bg-white p-4">
  <div class="flex my-4 text-sm">
    <div class="flex mr-4">
      <div class="bg-gray-200 font-bold px-2 py-1 flex items-center">total data</div>
      <div class="bg-blue-600 text-white font-bold flex items-center px-2">{items.length}</div>
    </div>
    <div class="border border-gray-400 flex items-stretch rounded mr-4">
      <div class="bg-gray-200 inline-block flex items-center px-3 text-gray-500 rounded-l">pencarian</div>
      <input
        class="font-thin rounded px-2 py-1"
        value={keyword}
        on:change={(event) => {
          page = 0
          keyword = event.target.value
        }}
      />
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
    <a href="/app/customer/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded">
      tambah pelanggan
    </a>
  </div>
  <table class="jo-table">
    <thead>
      <tr>
        <th>no.</th>
        <th>nama depan</th>
        <th>nama belakang</th>
        <th>alamat</th>
        <th>email</th>
        <th>no.hp</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each items as item, i}
        <tr>
          <td>{(i + 1) + (per_page * page)}</td>
          <td>{item.first_name}</td>
          <td>{item.last_name}</td>
          <td>{item.address ? item.address : ''}</td>
          <td>{item.email ? item.email : ''}</td>
          <td>{item.mobile ? item.mobile : ''}</td>
          <td>
            <div class="flex items-center">
              <button class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                <div class="w-3 h-3 text-blue-500">
                  <FaPencilAlt />
                </div>
              </button>
              <button 
                on:click={() => {
                  on_delete(item.id)
                }}
                class="appearance-none rounded-full p-1 hover:bg-gray-300">
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