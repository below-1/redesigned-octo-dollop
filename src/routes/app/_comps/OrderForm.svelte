<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { post, get } from '../../../commons/api'
  import datetime_validator from '../../../commons/datetime_validator'
  import DateTimeInput from '../../../components/DateTimeInput.svelte'

  export let type = 'SALE'
  export let order
  export let validation
  const dispatch = createEventDispatcher()
  let users = []

  $: user_type = type == 'SALE' ? 'customer' : 'supplier'

  async function load_users (user_type) {
    const url = `/api/v1/${user_type}`
    try {
      const result = await get({ url })
      users = result.items
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data supplier')
    }
  }

  onMount(async () => {
    await load_users(user_type)
  })
</script>

<div class="bg-white px-4 mb-4 py-2">
  <div class="font-semibold mb-4">Form Order</div>
  <div class="flex">

    <div class="w-1/2 text-sm pr-2">

      <div class="flex items-center mb-4">
        <label class="w-1/5">Pilih <span class="capitalize">{user_type}</span></label>
        <div class="w-3/5">
          <select 
            bind:value={order.user_id} 
            class="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option disabled value={null}>--  pilih {user_type} --</option>
            {#each users as user}
              <option value={user.id}>{user.first_name}</option>
            {/each}
          </select>
          {#if validation.fields.user_id.errors.includes('required')}
            <small class="block text-red-500 text-xs">{user_type} harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/5">Status Orderan</label>
        <div class="w-3/5">
          <select class="w-full border border-gray-300 rounded px-2 py-1" bind:value={order.status}>
            <option disabled value={null}>--  pilih status orderan --</option>
            <option value='CHECKOUT'>Checkout</option>
            <option value='PAID'>Sudah Dibayar</option>
            <option value='DELIVERED'>Barang Diterima</option>
            <option value='RETURNED'>Retur</option>
            <option value='COMPLETE'>Selesai</option>
          </select>
          {#if validation.fields.status.errors.includes('required')}
            <small class="block text-red-500 text-xs">status orderan harus diisi</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/5">Pajak</label>
        <div class="w-3/5">
          <input 
            bind:value={order.tax}
            type="number" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if validation.fields.tax.errors.includes('required')}
            <small class="block text-red-500 text-xs">pajak harus diisi</small>
          {/if}
          {#if validation.fields.tax.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center mb-4">
        <label class="w-1/5">Shipping</label>
        <div class="w-3/5">
          <input 
            bind:value={order.shipping}
            type="number" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if validation.fields.shipping
            .errors.includes('required')}
            <small class="block text-red-500 text-xs">biaya pengiriman harus diisi</small>
          {/if}
          {#if validation.fields.shipping.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>

      <div class="flex items-center">
        <label class="w-1/5">Diskon (%)</label>
        <div class="w-3/5">
          <input 
            bind:value={order.discount}
            type="number" 
            class="w-full border border-gray-300 rounded px-2 py-1" />
          {#if validation.fields.discount
            .errors.includes('required')}
            <small class="block text-red-500 text-xs">diskon harus diisi</small>
          {/if}
          {#if validation.fields.discount.errors.includes('min')}
            <small class="block text-red-500 text-xs">tidak boleh kurang dari 0</small>
          {/if}
        </div>
      </div>

    </div>

    <div class="w-1/2 text-sm pl-2">

      <div class="mb-4">
        <label class="">Waktu Pembelian</label>
        <div class="w-3/5">
          <DateTimeInput
            bind:date={order.created_at} 
          />
        </div>
        {#if validation.fields.created_at.errors.includes('datetime')}
          <small class="block text-red-500 text-xs">waktu pembelian tidak valid</small>
        {/if}
      </div>

      <div class="flex flex-col">
        <label>Keterangan</label>
        <textarea rows="5" bind:value={order.content} class="w-4/5 border border-gray-300 rounded px-2 py-1"></textarea>
      </div>
    </div>
    
  </div>
</div>