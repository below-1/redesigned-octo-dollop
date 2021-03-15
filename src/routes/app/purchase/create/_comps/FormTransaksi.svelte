<script>
  import { onMount } from 'svelte'
  import { post, get } from '../../../../../commons/api'
  import chrome_fdate from '../../../../../commons/chrome_fdate'
  import { form } from 'svelte-forms'

  export let initial
  export let items
  export let shipping = 0
  export let tax = 0
  export let discount = 0

  let status = null
  let mode = null

  function calculate_grand_total ({ items, tax, discount, shipping }) {
    const items_total = items.map(it => it.price - (it.price * it.discount)).reduce((a, b) => a + b, 0)
    const discounted = items_total - (items_total * discount)
    const taxed = discounted + (discounted * tax)
    return taxed
  }

  $: nominal = calculate_grand_total({ items, tax, discount, shipping });

  const form_transaction = form(() => ({
    status: {
      value: status,
      validators: ['required']
    },
    trans_mode: {
      value: mode,
      validators: ['required']
    }
  }))

  export function get_data () {
    return {
      trans_status,
      trans_mode,
      nominal
    }
  }

  onMount(() => {
    if (!initial) return;
    status = initial.status;
    mode = initial.mode;
  })
</script>

<div class="bg-white px-4 mb-4 py-2">
  <div class="font-semibold mb-4">Form Transaksi</div>
  <div class="flex">
    <div class="w-1/2 text-sm pr-2">

      <div class="flex items-center mb-2">
        <label class="w-1/5">Status Transaksi</label>
        <select bind:value={status} class="w-3/5 border border-gray-300 rounded px-2 py-1">
          <option disabled value={null}>-- pilih status transaksi --</option>
          <option value='PENDING'>Sedang Diproses</option>
          <option value='CANCELLED'>Dibatalkan</option>
          <option value='FAILED'>Gagal</option>
          <option value='REJECTED'>Ditolak</option>
          <option value='SUCCESS'>Sukses</option>
        </select>
        {#if $form_transaction.fields.status.errors.includes('required')}
          <small class="block text-red-500 text-xs">status harus diisi</small>
        {/if}
      </div>

      <div class="flex items-center mb-2">
        <label class="w-1/5">Mode Pembayaran</label>
        <select bind:value={mode} class="w-3/5 border border-gray-300 rounded px-2 py-1">
          <option disabled value={null}>-- pilih mode transaksi --</option>
          <option value='OFFLINE'>Offline</option>
          <option value='CASH'>Kes</option>
          <option value='ON_DELIVERY'>On Delivery</option>
          <option value='CHEQUE_DRAFT'>Cheque</option>
          <option value='WIRED'>Wired</option>
          <option value='ONLINE'>Online</option>
        </select>
        {#if $form_transaction.fields.mode.errors.includes('required')}
          <small class="block text-red-500 text-xs">mode harus diisi</small>
        {/if}
      </div>

      <div class="flex items-center mb-2">
        <label class="w-1/5">Nominal</label>
        <input readonly value={nominal} type="number" class="w-3/5 border border-gray-300 rounded px-2 py-1" />
      </div>      

    </div>
  </div>
</div>