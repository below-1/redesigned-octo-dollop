<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
  import { form } from 'svelte-forms'
  import rupiah from '../../../../commons/rupiah'
  import fdate from '../../../../commons/fdate'
  import { get, put } from '../../../../commons/api'
  import '../../../../styles/jo-table.css'

  export let id
  let supplier = {}
  let purchases = []
  let keyword = ''
  let per_page = 10
  let page = 0
  let total_page = 0

  async function load_supplier (id) {
    if (!process.browser) return
    if (!id) return
    const url = `/api/v1/supplier/${id}`
    try {
      supplier = await get({ url })
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data supplier')
    }
  }

  async function load_purchase ({ id, keyword, per_page, page }) {
    console.log('here')
    if (!process.browser) return;
    const params = {
      keyword,
      per_page,
      page
    }
    try {
      const result = await get({
        url: `/api/v1/supplier/${id}/purchase`,
        params
      })
      purchases = result.items
      total_page = result.total_page
      console.log(result)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data pembelian')
    }
  }

  $: load_supplier(id)
  $: load_purchase({ id, keyword, per_page, page })
</script>

<div class="cont">
  <section class="bg-white flex items-center px-4 py-2">
    <div class="font-bold text-lg">supplier / {supplier.first_name} / daftar pembelian </div>
    <div class="flex-grow"></div>
    <a 
      href={`/app/supplier/${id}/edit`}
      class="bg-indigo-600 text-white rounded flex items-center px-4 py-2">
      <span class="mr-2 text-sm font-bold">edit supplier</span>
      <div class="w-3 h-3">
        <FaPencilAlt />
      </div>
    </a>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th></th>
          <th>waktu</th>
          <th>harga total</th>
          <th>nominal bayar</th>
          <th>keterangan</th>
          <th>status pembayaran</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each purchases as item}
          <tr>
            <td>{item.id}</td>
            <td>{fdate(new Date(item.created_at))}</td>
            <td>{rupiah(parseInt(item.grand_total))}</td>
            <td>{rupiah(parseInt(item.transaction.nominal))}</td>
            <td>{item.content ? item.content : ''}</td>
            <td>{item.transaction.status}</td>
            <td>
              <div class="flex items-center justify-end">
                <a href={`/app/sale/${item.id}/detail`} class="rd-action mr-2">
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