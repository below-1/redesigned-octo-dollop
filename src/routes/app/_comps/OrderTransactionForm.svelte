<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Currency from '../../../components/Currency.svelte'

  export let transaction
  export let validation
  export let delay
  export let formatted_due_date
  export let formatted_total_ap
</script>

<div class="flex">
  <div class="bg-white px-4 mb-4 py-2 w-1/2 mr-2">
    <div class="font-semibold mb-4">Form Transaksi</div>
    <div class="text-sm">

      <div class="flex items-center mb-3">
        <label class="w-1/5 text-xs">Status Transaksi</label>
        <div class="w-3/5">
          <select bind:value={transaction.status} class="w-full border border-gray-300 rounded px-2 py-1">
            <option disabled value={null}>-- pilih status transaksi --</option>
            <option value='PENDING'>Sedang Diproses</option>
            <option value='CANCELLED'>Dibatalkan</option>
            <option value='FAILED'>Gagal</option>
            <option value='REJECTED'>Ditolak</option>
            <option value='SUCCESS'>Sukses</option>
          </select>
          {#if validation.fields.trans_status.errors.includes('required')}
            <small class="block text-red-500 text-xs">status harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-3">
        <label class="w-1/5 text-xs">Mode Pembayaran</label>
        <div class="w-3/5">
          <select bind:value={transaction.mode} class="w-full border border-gray-300 rounded px-2 py-1">
            <option disabled value={null}>-- pilih mode transaksi --</option>
            <option value='OFFLINE'>Offline</option>
            <option value='CASH'>Kes</option>
            <option value='ON_DELIVERY'>On Delivery</option>
            <option value='CHEQUE_DRAFT'>Cheque</option>
            <option value='WIRED'>Wired</option>
            <option value='ONLINE'>Online</option>
          </select>
          {#if validation.fields.trans_mode.errors.includes('required')}
            <small class="block text-red-500 text-xs">mode transaksi harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-3">
        <label class="w-1/5 text-xs">Nominal</label>
        <div class="w-3/5">
          <Currency bind:value={transaction.nominal} />
          {#if validation.fields.trans_nominal.errors.includes('required')}
            <small class="block text-red-500 text-xs">nominal pembayaran harus diisi</small>
          {/if}
          {#if validation.fields.trans_nominal.errors.includes('min')}
            <small class="block text-red-500 text-xs">nominal pembayaran harus lebih besar dari 0</small>
          {/if}
          {#if validation.fields.trans_nominal.errors.includes('max')}
            <small class="block text-red-500 text-xs">nominal pembayaran tidak boleh besar dari grand total</small>
          {/if}
        </div>
      </div>

    </div>
  </div>
  {#if delay}
    <div class="bg-white px-4 mb-4 py-2 w-1/2 ml-2">
      <div class="font-semibold mb-4">Form Hutang</div>
      <div class="text-sm mb-4 border-gray-200 rounded border bg-gray-100 p-4">
        <p class="text-red-700 font-bold text-sm">Nominal pembayaran kurang dari grand total</p>
        <p class="text-red-700 font-bold text-sm">Sistem akan menyimpan data hutang sesuai dengan kekurangan pembayaran</p>
      </div>
      <div class="mb-4 text-sm">Total Hutang: <em class="font-mono font-bold text-xs">{formatted_total_ap}</em></div>
      <label class="text-sm">Batas Waktu (Hari)</label>
      <input 
        bind:value={transaction.delay_due_date}
        type="number" 
        class="w-full border border-gray-300 rounded px-2 py-1" />
      {#if delay && validation.fields.delay.errors.includes('required')}
        <small class="block text-red-500 text-xs">batas waktu pembayaran hutang harus diisi</small>
      {/if}
      {#if delay && validation.fields.delay.errors.includes('min')}
        <small class="block text-red-500 text-xs">batas waktu pembayaran hutang harus lebih besar dari</small>
      {/if}
      <div class="mb-4 text-sm">Tanggal Bayar: <em class="font-mono font-bold text-xs">{formatted_due_date}</em></div>
    </div>
  {/if}
</div>