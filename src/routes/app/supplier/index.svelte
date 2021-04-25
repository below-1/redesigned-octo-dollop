<script>
  import { onMount } from 'svelte'
  import ButtonMenu from '../../../components/ButtonMenu.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'
  import { del_confirm } from '../store'

  let keyword = ''
  let items = []
  let page = 0
  let per_page = 20
  let total_page = 0

  async function load_supplier ({ keyword, per_page, page }) {
    if (!process.browser) return;
    const params = {
      keyword,
      per_page,
      page
    }
    try {
      const result = await get({
        url: '/api/v1/supplier',
        params
      })
      items = result.items
      total_page = result.total_page
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data supplier')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/supplier/${id}`
    del_confirm.show({
      entity: 'supplier',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_supplier({ per_page, keyword, page })
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data supplier')
        }
      }
    })
  }

  $: load_supplier({ keyword, per_page, page })

  // onMount(async () => await load_supplier({ keyword }))
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>total supplier</div>
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
    <button class="appearance-none border border-green-500 px-4 flex items-center font-bold mr-4">
      print
    </button>
    <a href="/app/supplier/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold">
      tambah supplier
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>nama</th>
          <th>alamat</th>
          <th>email</th>
          <th>no. hp</th>
          <th>pembeliam</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{(i + 1) + (page * per_page)}</td>
            <td>{item.first_name}</td>
            <td>{item.address ? item.address : ''}</td>
            <td>{item.email ? item.email : ''}</td>
            <td>{item.mobile ? item.mobile : ''}</td>
            <td>
              <a class="just-link" href={`/app/supplier/${item.id}/purchase`}>pembelian</a>
            </td>
            <td>
              <div class="flex items-center">
                <a 
                  href={`/app/supplier/${item.id}/edit`}
                  class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
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