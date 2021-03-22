<script>
  import { onMount } from 'svelte'
  import ButtonMenu from '../../../components/ButtonMenu.svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
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
      items = result.items
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
    <a href="/app/product/create" class="appearance-none bg-green-500 text-white px-4 flex items-center font-bold rounded">
      tambah produk
    </a>
  </div>

  <table class="jo-table">
    <thead>
      <tr>
        <th rowspan="2">no.</th>
        <th rowspan="2">nama</th>
        <th rowspan="2">kategori</th>
        <th rowspan="2">keterangan</th>
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
          <td>
            <div class="flex items-center">
              {#each item.categories as cat}
                <div class="bg-gray-100 border border-gray-300 px-1 rounded mr-1 text-xs">
                  {cat.title}
                </div>
              {/each}
            </div>
          </td>
          <td>{item.content ? item.content : '-'}</td>
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
              <button 
                on:click={() => {
                  on_delete(item.id)
                }}
                class="appearance-none rounded-full p-1 hover:bg-gray-300 mr-2">
                <div class="w-3 h-3 text-red-500">
                  <FaTrash />
                </div>
              </button>
              <ButtonMenu
                btn_class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300"
                menu_class="bg-white shadow"
                menus={[
                  {
                    label: 'tambah stok',
                    action: () => {}
                  },
                  {
                    label: 'jual',
                    action: () => {}
                  }
                ]}
              >
                <div slot="btn_content" class="w-3 h-3 text-gray-600"><FaCogs /></div>
              </ButtonMenu>
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
