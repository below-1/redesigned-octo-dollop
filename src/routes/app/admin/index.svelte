<script>
  import { onMount, getContext } from 'svelte'
  import '../../../styles/jo-table.css'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'  
  import { del_confirm } from '../store'

  let items = []
  let keyword = ''
  const { getUser } = getContext('user');
  let currentUser = {}

  async function load_admin () {
    if (!process.browser) return; 
    try {
      const result = await get({
        url: '/api/v1/admin'
      })
      items = result.items
      console.log(items)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data admin')
    }
  }

  function on_delete (id) {
    const url = `/api/v1/admin/${id}`
    del_confirm.show({
      entity: 'admin',
      id,
      on_yes: async () => {
        try {
          await del({ url })
          await load_data()
        } catch (err) {
          console.log(err)
          alert('gagal menghapus data admin')
        }
      }
    })
  }

  onMount(async () => {
    await load_admin();
    currentUser = getUser();
  });
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>data admin</div>
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
    <div class="flex-grow"></div>
    <a href="/app/admin/create" class="primary">
      tambah admin
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>username</th>
          <th>nama</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>{item.username}</td>
            <td>{item.first_name}</td>
            <td>
              <div class="flex items-center">
                <a href={`/app/admin/${item.id}/edit`} class="appearance-none rounded-full p-1 mr-2 hover:bg-gray-300">
                  <div class="w-3 h-3 text-blue-500">
                    <FaPencilAlt />
                  </div>
                </a>
                {#if item.id != currentUser.id}
                <button 
                  on:click={() => {
                    on_delete(item.id)
                  }}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300">
                  <div class="w-3 h-3 text-red-500">
                    <FaTrash />
                  </div>
                </button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

</div>