<script>
  import { onMount } from 'svelte'
  import { get, del } from '../../../commons/api'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
  import rupiah from '../../../commons/rupiah'
  import '../../../styles/jo-table.css'

  let per_page = 10
  let page = 0
  let items = []
  let total_page = 0
  let total_data = 0
  let keyword = ''

  async function load_optypes ({ keyword, per_page, page }) {
    if (!process.browser) return;
    const result = await get({
      url: '/api/v1/optype',
      params: {
        per_page,
        page,
        keyword
      }
    })
    items = result.items
    total_page = result.total_page
  }

  $: load_optypes({ per_page, page, keyword })
</script>

<div class="cont">

  <section class="header flex text-sm">
    <div class="title-count">
      <div>kategori beban usaha</div>
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
    <a href="/app/optype/create" class="primary">
      data baru
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>nama</th>
          <th>jumlah trans</th>
          <th>nominal trans</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{(i + 1) + (per_page * page)}</td>
            <td>{item.name}</td>
            <td>{item.total_trans}</td>
            <td>{rupiah( parseInt(item.nominal_trans) )}</td>
            <td>
              <div class="flex items-center">
                <button 
                  on:click={() => {
                    // remove_op_instance(item.id)
                  }}
                  class="appearance-none rounded-full p-1 hover:bg-gray-300 mr-2">
                  <div class="w-3 h-3 text-red-500">
                    <FaTrash />
                  </div>
                </button>
                <a 
                  href={`/app/optype/${item.id}/edit`}
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