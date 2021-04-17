<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import { format } from 'date-fns'
  import { post } from '../../../../commons/api'
  import DateTimeInput from '../../../../components/DateTimeInput.svelte'
  import Currency from '../../../../components/Currency.svelte'
  import datetime_validator from '../../../../commons/datetime_validator'

  export let id 

  let nominal = 0
  let created_at = new Date()
  let mode = null

  const validation = form(() => ({
    nominal: {
      value: nominal,
      validators: ['required', 'min:1']
    },
    mode: {
      value: mode,
      validators: ['required']
    },
    created_at: {
      value: created_at,
      validators: [datetime_validator]
    },
  }))

  async function save () {
    const payload = {
      nominal,
      created_at,
      mode
    }
    const url = `/api/v1/ap/${id}/payments`
    try {
      const result = await post({
        url,
        payload
      })
      alert('sukses menambah data pembayaran')
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data pembayaran')
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data pembayaran</div>

    <div class="mb-4">
      <label>Mode Pembayaran</label>
      <div>
        <select bind:value={mode} class="w-full border border-gray-300 rounded px-2 py-1">
          <option disabled value={null}>-- pilih mode transaksi --</option>
          <option value='OFFLINE'>Offline</option>
          <option value='CASH'>Kes</option>
          <option value='ON_DELIVERY'>On Delivery</option>
          <option value='CHEQUE_DRAFT'>Cheque</option>
          <option value='WIRED'>Wired</option>
          <option value='ONLINE'>Online</option>
        </select>
        {#if $validation.fields.mode.errors.includes('required')}
          <small class="block text-red-500 text-xs">mode transaksi harus diisi</small>
        {/if}
      </div>
    </div>

    <div class="mb-4">
      <label>Nominal</label>
      <div>
        <Currency bind:value={nominal} />
        {#if $validation.fields.nominal.errors.includes('required')}
          <small class="block text-red-500 text-xs">nominal pembayaran harus diisi</small>
        {/if}
        {#if $validation.fields.nominal.errors.includes('min')}
          <small class="block text-red-500 text-xs">nominal pembayaran harus lebih besar dari 0</small>
        {/if}
      </div>
    </div>

    <div class="mb-4">
      <label>Waktu Pembayaran</label>
      <div>
        <DateTimeInput bind:date={created_at} />
        {#if $validation.fields.created_at.errors.includes('datetime')}
          <small class="block text-red-500 text-xs">waktu pembelian tidak valid</small>
        {/if}
      </div>
    </div>

    <button 
      disabled={!$validation.valid}
      on:click={save}
      class="primary mb-4">simpan</button>

  </div>
</div>