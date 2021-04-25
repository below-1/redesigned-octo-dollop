<script>
  import { onMount } from 'svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'  
  import { del_confirm } from '../store'

  let items = []

  async function load_category () {
    try {
      items = await get({ url: '/api/v1/category' })
    } catch (err) {
      console.log(err)
      alert('gagal memuat data kategori')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/category/${id}`
    del_confirm.show({
      entity: 'kategori',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_category()
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data kategori')
        }
      }
    })
  }

  onMount(load_category)
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="flex mr-4">
      <div class="bg-gray-200 font-bold px-2 py-1 flex items-center">kategori produk</div>
      <div class="bg-blue-600 text-white font-bold flex items-center px-2">{items.length}</div>
    </div>
    <div class="flex-grow"></div>
    <button class="outline-primary mr-2">
      print
    </button>
    <a href="/app/category/create" class="primary">
      data baru
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>nama</th>
          <th>rangkuman</th>
          <th>keterangan</th>
          <th>produk</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>{item.title}</td>
            <td>{item.meta_title ? item.meta_title : ''}</td>
            <td>{item.content ? item.content : '' }</td>
            <td>{item.total_product}</td>
            <td>
              <div class="flex items-center">
                <a href={`/app/category/${item.id}/edit`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
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
</div>
