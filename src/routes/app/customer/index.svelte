<script>
  import { onMount } from 'svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'  
  import { del_confirm } from '../store'

  let items = []
  let keyword = ''
  let page = 0
  let per_page = 10
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

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>total data</div>
      <div>{items.length}</div>
    </div>
    <div class="group-input">
      <label>pencarian</label>
      <input
        value={keyword}
        on:change={(event) => {
          page = 0
          keyword = event.target.value
        }}
      />
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
    <a href="/app/customer/create" class="primary">
      tambah pelanggan
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>nama</th>
          <th>alamat</th>
          <th>no.hp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{(i + 1) + (per_page * page)}</td>
            <td>{item.first_name}</td>
            <td>{item.address ? item.address : ''}</td>
            <td>{item.mobile ? item.mobile : ''}</td>
            <td>
              <div class="flex items-center">
                <a href={`/app/customer/${item.id}/edit`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
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
  </section>

  <Pagination
    total_page={total_page}
    {page}
    on:change={event => {
      page = event.detail
    }}
  />

</div>