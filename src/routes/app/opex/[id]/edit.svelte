<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import chrome_fdate from '../../../../commons/chrome_fdate'
  import Currency from '../../../../components/Currency.svelte'
  import { form } from 'svelte-forms'
  import { get, put } from '../../../../commons/api'

  export let id

  let id_opex = null
  let created_at = chrome_fdate(new Date())
  let content = null
  let status = null
  let mode = null
  let nominal = 0
  let opexes = []

  $: load_opex_instance({ id })

  async function load_optype () {
    try {
      const result = await get({
        url: '/api/v1/optype'
      })
      opexes = result.items
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data beban usaha')
    }
  }

  async function load_opex_instance ({ id }) {
    if (!process.browser) return;
    if (!id) {
      console.log(`id is not valid. id=${id}`)
      return
    }
    console.log(`id`)
    console.log(id)
    try {
      const item = await get({
        url: `/api/v1/opex/${id}`
      })

      id_opex = item.opex.id
      created_at = chrome_fdate(new Date(item.created_at))
      content = item.content
      status = item.status
      mode = item.mode
      nominal = parseInt(item.nominal)
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data beban usaha')
    }
  }

  async function save () {
    const payload = {
      created_at: new Date(created_at).toISOString(),
      id_opex,
      content,
      status,
      mode,
      nominal
    }
    try {
      const result = await put({
        url: `/api/v1/opex/${id}`,
        payload
      })
      console.log(result)
      window.history.back()
    } catch (err) {
      console.log(err)
    }
  }

  let main_form = form(() => ({
    id_opex: {
      value: id_opex,
      validators: ['required']
    },
    status: {
      value: status,
      validators: ['required']
    },
    mode: {
      value: mode,
      validators: ['required']
    },
    nominal: {
      value: nominal,
      validators: ['required']
    }
  }))

  onMount(load_optype)
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">

    <div class="font-semibold text-gray-600 text-xl mb-4">input beban usaha</div>

    <div class="flex flex-col mb-3">
      <label>Jenis Beban Usaha</label>

      <div class="flex flex-col">
        <select bind:value={id_opex} class="border border-gray-300 rounded p-2">
          <option disabled value={null}>--  pilih beban usaha --</option>
          {#each opexes as opex}
            <option value={opex.id}>{opex.name}</option>
          {/each}
        </select>
        {#if $main_form.fields.id_opex.errors.includes('required')}
          <small class="text-red-500 text-xs">jenis beban usaha harus diisi</small>
        {/if}
      </div>
    </div>

    <div class="flex flex-col mb-3">
      <label>Waktu Pembelian</label>
      <input bind:value={created_at} type="datetime-local" class="border border-gray-300 rounded px-2 py-1" />
    </div>

    <div class="flex flex-col mb-3">
      <label>Keterangan</label>
      <textarea rows="5" bind:value={content} class="border border-gray-300 rounded px-2 py-1"></textarea>
    </div>

    <div class="flex flex-col mb-3">
      <label>Status</label>
      <div class="flex flex-col">
        <select bind:value={status} class="w-full border border-gray-300 rounded px-2 py-1">
          <option disabled value={null}>-- pilih status transaksi --</option>
          <option value='PENDING'>Sedang Diproses</option>
          <option value='CANCELLED'>Dibatalkan</option>
          <option value='FAILED'>Gagal</option>
          <option value='REJECTED'>Ditolak</option>
          <option value='SUCCESS'>Sukses</option>
        </select>
        {#if $main_form.fields.status.errors.includes('required')}
          <small class="text-red-500 text-xs">status harus diisi</small>
        {/if}
      </div>
    </div>

    <div class="flex flex-col mb-3">
      <label>Mode Pembayaran</label>
      <div class="flex flex-col">
        <select bind:value={mode} class="w-full border border-gray-300 rounded px-2 py-1">
          <option disabled value={null}>-- pilih mode transaksi --</option>
          <option value='OFFLINE'>Offline</option>
          <option value='CASH'>Kes</option>
          <option value='ON_DELIVERY'>On Delivery</option>
          <option value='CHEQUE_DRAFT'>Cheque</option>
          <option value='WIRED'>Wired</option>
          <option value='ONLINE'>Online</option>
        </select>
        {#if $main_form.fields.mode.errors.includes('required')}
          <small class="text-red-500 text-xs">mode pembayaran harus diisi</small>
        {/if}
      </div>
    </div>

    <div class="flex flex-col mb-3">
      <label>Nominal</label>
      <div class="flex flex-col">
        <Currency bind:value={nominal} />
        {#if $main_form.fields.nominal.errors.includes('required')}
          <small class="text-red-500 text-xs">nominal harus diisi</small>
        {/if}
      </div>
    </div>

    <button 
      disabled={!$main_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>

  </div>
</div>