<script>
  import { onMount } from 'svelte'
  import { post } from '../../../commons/api'
  import { form } from 'svelte-forms'

  let nama = ''
  let address = ''
  let email = null
  let mobile = null

  let supplier_form = form(() => ({
    nama: {
      value: nama,
      validators: ['required']
    },
    address: {
      value: address,
      validators: ['required']
    }
  }))

  async function save () {
    const payload = {
      first_name: nama,
      address,
      mobile,
      email
    }
    const url = '/api/v1/supplier'
    try {
      const response = await post({ url, payload })
      console.log(response)
      alert('sukses menambah data supplier')
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data supplier')
    }
  }

  onMount(() => {
    console.log('here')
  })
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data supplier</div>
    <div class="flex flex-col mb-3">
      <label>Nama</label>
      <input bind:value={nama} class="border border-gray-300 rounded p-2" />
      {#if $supplier_form.fields.nama.errors.includes('required')}
        <small class="text-red-500 text-xs">nama harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Alamat</label>
      <input bind:value={address} class="border border-gray-300 rounded p-2" />
      {#if $supplier_form.fields.address.errors.includes('required')}
        <small class="text-red-500 text-xs">alamat harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Email</label>
      <input bind:value={email} type="email" class="border border-gray-300 rounded p-2" />
    </div>

    <div class="flex flex-col mb-3">
      <label>No. Hp</label>
      <input bind:value={mobile} class="border border-gray-300 rounded p-2" />
    </div>

    <button 
      disabled={!$supplier_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>
  </div>
</div>
