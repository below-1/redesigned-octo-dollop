<script>
  import { post } from '../../../commons/api'
  import { form } from 'svelte-forms'

  let first_name = ''
  let last_name = ''
  let alamat = ''
  let mobile = ''
  let email = ''

  let customer_form = form(() =>({
    first_name: {
      value: first_name,
      validators: ['required']
    },
    last_name: {
      value: last_name,
      validators: ['required']
    }
  }))

  async function save () {
    const payload = {
      first_name,
      last_name,
      alamat,
      mobile,
      email,
      role: 'EMPLOYER'
    }
    try {
      await post({ url: '/api/v1/customer', payload })
      alert('sukses menambah data pelanggan')
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data pelanggan')
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data pelanggan</div>
    <div class="flex flex-col mb-3">
      <label>Nama Depan</label>
      <input bind:value={first_name} class="border border-gray-300 rounded p-2" />
      {#if $customer_form.fields.first_name.errors.includes('required')}
        <small class="text-red-500 text-xs">nama depan harus diisi</small>
      {/if}
    </div>
    <div class="flex flex-col mb-3">
      <label>Nama Belakang</label>
      <input bind:value={last_name} class="border border-gray-300 rounded p-2" />
      {#if $customer_form.fields.last_name.errors.includes('required')}
        <small class="text-red-500 text-xs">nama belakang harus diisi</small>
      {/if}
    </div>
    <div class="flex flex-col mb-3">
      <label>Alamat</label>
      <input bind:value={alamat} class="border border-gray-300 rounded p-2" />
    </div>
    <div class="flex flex-col mb-3">
      <label>email</label>
      <input bind:value={email} class="border border-gray-300 rounded p-2" />
    </div>
    <div class="flex flex-col mb-3">
      <label>No. HP</label>
      <input bind:value={mobile} class="border border-gray-300 rounded p-2" />
    </div>
    <button 
      disabled={!$customer_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>
  </div>  
</div>