<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { form } from 'svelte-forms'
  import { put, get } from '../../../../commons/api'

  export let id

  let username = ''
  let first_name = ''
  let last_name = ''
  let mobile = ''
  let email = ''

  async function load_admin (id) {
    if (!process.browser) return
    if (!id) return
    try {
      const result = await get({ url: `/api/v1/admin/${id}` })
      username = result.username
      first_name = result.first_name
      last_name = result.last_name
      mobile = result.mobile
      email = result.email
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data pegawai')
    }
  }

  $: load_admin(id)

  const admin_form = form(() => ({
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
      mobile,
      email
    }
    try {
      await put({
        url: `/api/v1/admin/${id}`,
        payload
      })
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal mengubah data pegawai')
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data pegawai</div>

    <div class="flex flex-col mb-3">
      <label>Nama Depan</label>
      <input bind:value={first_name} class="border border-gray-300 rounded p-2" />
      {#if $admin_form.fields.first_name.errors.includes('required')}
        <small class="text-red-500 text-xs">nama depan harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Nama Belakang</label>
      <input bind:value={last_name} class="border border-gray-300 rounded p-2" />
      {#if $admin_form.fields.last_name.errors.includes('required')}
        <small class="text-red-500 text-xs">nama belakang harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Email</label>
      <input bind:value={email} type="email" class="border border-gray-300 rounded p-2" />
    </div>

    <div class="flex flex-col mb-3">
      <label>No. HP</label>
      <input bind:value={mobile} class="border border-gray-300 rounded p-2" />
    </div>

    <button 
      disabled={!$admin_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>

  </div>
</div>