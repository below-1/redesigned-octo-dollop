<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import rupiah from '../../../../commons/rupiah'
  import { put, get } from '../../../../commons/api'
  import '../../../../styles/jo-table.css'
  import Dialog from '../../../../components/Dialog.svelte'

  export let id

  let product = {};
  let items = [];

  let show_defect_dialog = false
  let defect_dialog_item = {}
  let defect_dialog_defect = 0

  async function getProduct (id) {
    try {
      product = await get({
        url: '/api/v1/product/' + id
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function getItems (id) {
    try {
      items = await get({
        url: '/api/v1/items/product/' + id
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function changeDefects () {
    const payload = {
      defective: defect_dialog_defect
    }
    const url = `/api/v1/items/${defect_dialog_item.id}/defect`
    try {
      const response = await put({
        url,
        payload
      });
    } catch (err) {
      console.log(err);
      alert('gagal mengubah jumlah barang rusak');
    } finally {
      show_defect_dialog = false;
      await getItems(id);
    }
  }

  onMount(() => {
    getProduct(id);
    getItems(id);
  })
</script>

<div class="cont">
  <section class="bg-white flex items-center px-4 py-2">
    <div class="font-bold text-lg">history pembelian / produk #{id} -- {product.title}</div>
    <div class="flex-grow"></div>
  </section>

  <section>
    <table class="jo-table">
      <thead>
        <tr>
          <th rowspan="2">no.</th>
          <th rowspan="2">harga beli</th>
          <th rowspan="2">harga jual</th>
          <th colspan="4">stok</th>
          <th></th>
        </tr>
        <tr>
          <th>awal</th>
          <th>tersedia</th>
          <th>terjual</th>
          <th>rusak</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each items as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>{rupiah(parseInt(item.price))}</td>
            <td>{rupiah(parseInt(item.sale_price))}</td>
            <td>{item.quantity ? item.quantity : '-'}</td>
            <td>{item.available ? item.available : '-'}</td>
            <td>{item.sold ? item.sold : '-'}</td>
            <td>{item.defective ? item.defective : '-'}</td>
            <td class="text-right">
              <button 
                on:click={() => {
                  defect_dialog_item = { ...item }
                  defect_dialog_defect = isNaN(item.defective) ? 0 : item.defective
                  show_defect_dialog = true
                }}
                class="bg-indigo-600 text-white font-bold px-3 py-1">
                ubah jumlah rusak
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <Dialog bind:show={show_defect_dialog}>
    <div>
      <h2 class="font-bold text-lg p-4 border-bottom-1 border-gray-300">Ubah Jumlah Barang Rusak</h2>
      <div class="p-4">
        <div class="flex flex-col justify-center mb-4">
          <label class="text-sm">Jumlah Barang Rusak</label>
          <input 
            type="number"
            bind:value={defect_dialog_defect} 
            class="w-full border border-gray-300 rounded px-2 py-1" />
        </div>
        <button 
          on:click={changeDefects}
          :disabled={defect_dialog_defect == 0}
          class="bg-blue-600 text-white font-bold px-3 py-1 disabled:opacity-50"
        >
          simpan
        </button>
      </div>
    </div>
  </Dialog>
</div>