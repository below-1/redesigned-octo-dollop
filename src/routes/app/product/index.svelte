<script>
  import { onMount } from 'svelte'
  import ButtonMenu from '../../../components/ButtonMenu.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import rupiah from '../../../commons/rupiah'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaArchive from 'svelte-icons/fa/FaArchive.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import FaCogs from 'svelte-icons/fa/FaCogs.svelte'
  import { del_confirm } from '../store'

  let items = []
  let page = 0
  let keyword = ''
  let per_page = 20
  let total_page = 0

  async function load_product ({ keyword, per_page, page }) {
    if (!process.browser) return;
    const params = {
      page,
      keyword,
      per_page,
      stock: true
    }
    try {
      const result = await get({
        url: '/api/v1/product',
        params
      })
      items = result.items.map(it => {
        return {
          ...it,
          sold: parseInt(it.sold),
          defective: parseInt(it.defective),
          available: parseInt(it.available),
          quantity: parseInt(it.quantity)
        }
      })
      total_page = result.total_page
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data produk')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/product/${id}`
    del_confirm.show({
      entity: 'kategori',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_product({ keyword, per_page, page })
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data kategori')
        }
      }
    })
  }

  $: load_product({ keyword, per_page, page })
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
    <button class="appearance-none border border-green-500 px-4 flex items-center font-bold mr-4">
      print
    </button>
    <a href="/app/product/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold">
      tambah produk
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th rowspan="2">no.</th>
          <th rowspan="2">nama</th>
          <th rowspan="2">harga jual</th>
          <th rowspan="2">diskon</th>
          <th colspan="3">stok</th>
          <th rowspan="2"></th>
        </tr>
        <tr>
          <th>tersedia</th>
          <th>terjual</th>
          <th>rusak</th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{(i + 1) + (page * per_page)}</td>
            <td>{item.title}</td>
            <td>{item.sale_price ? rupiah(parseInt(item.sale_price)) : '-'}</td>
            <td>{(item.discount * 100).toFixed(2)} %</td>
            <td>{item.available ? item.available : '-'}</td>
            <td>{item.sold ? item.sold : '-'}</td>
            <td>{item.defective ? item.defective : '-'}</td>
            <td>
              <div class="flex items-center justify-end">
                <a href={`/app/product/${item.id}/edit`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
                <a href={`/app/product/${item.id}/items`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-indigo-500">
                    <FaArchive />
                  </div>
                </a>
                <button 
                  on:click={() => {
                    on_delete(item.id)
                  }}
                  disabled={item.sold}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300 mr-2 disabled:opacity-50">
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
