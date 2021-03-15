<script>
  import { form } from 'svelte-forms'
  import { post } from '../commons/api'

  let username = '';
  let password = '';
  let password_confirmation = '';
  let first_name = '';
  let last_name = '';

  const password_valid = value => {
    return {
      name: "password_match",
      valid: value == password
    }
  }

  const validation_options = {
    validateOnChange: true
  }

  const registrasi_form = form(() =>({
    username: {
      value: username,
      validators: ['required', 'min:6']
    },
    password: {
      value: password,
      validators: ['required', 'min:6']
    },
    password_confirmation: {
      value: password_confirmation,
      validators: ['required', password_valid]
    }
  }), validation_options)

  async function save () {
    const payload = {
      username,
      password,
      first_name,
      last_name
    }
    try {
      const response = await post({ url: '/auth/register', payload })
      console.log(response)
      alert('sukses')
    } catch (err) {
      console.log(err)
      alert('terjadi kesalahan')
    }
  }

  // $: password_valid = 
</script>

<div class="bg-gray-200 flex items-center justify-center h-screen w-screen">
  <div class="w-1/3 rounded-lg bg-white">
    <div class="bg-gray-100 pt-2 pb-1 text-center rounded-t-lg">
      <div class="text-xl font-bold tracking-widest">cendana</div>
      <div class="font-semibold text-gray-600">registrasi</div>
    </div>
    <div class="p-4 text-sm">
      <div class="flex flex-col mb-3">
        <label>Username</label>
        <input bind:value={username} class="px-2 py-1 rounded border border-gray-400" />
        {#if $registrasi_form.fields.username.errors.includes('required')}
          <small class="text-red-500 text-xs">username harus diisi</small>
        {/if}
        {#if $registrasi_form.fields.username.errors.includes('min')}
          <small class="text-red-500 text-xs">minimal 6 karakter</small>
        {/if}
      </div>
      <div class="flex flex-col mb-3">
        <label>Password</label>
        <input bind:value={password} type="password" class="px-2 py-1 rounded border border-gray-400" />
        {#if $registrasi_form.fields.password.errors.includes('required')}
          <small class="text-red-500 text-xs">password harus diisi</small>
        {/if}
        {#if $registrasi_form.fields.password.errors.includes('min')}
          <small class="text-red-500 text-xs">minimal 6 karakter</small>
        {/if}
      </div>
      <div class="flex flex-col mb-3">
        <label>Konfirmasi Password</label>
        <input 
          bind:value={password_confirmation} 
          type="password" 
          class="px-2 py-1 rounded border border-gray-400" />
        {#if $registrasi_form.fields.password_confirmation.errors.includes('required')}
          <small class="text-red-500 text-xs">konfirmasi password</small>
        {/if}
        {#if $registrasi_form.fields.password_confirmation.errors.includes('password_match')}
          <small class="text-red-500 text-xs">password harus cocok</small>
        {/if}
      </div>
      <div class="flex flex-col mb-3">
        <label>Nama Depan</label>
        <input bind:value={first_name} class="px-2 py-1 rounded border border-gray-400" />
      </div>
      <div class="flex flex-col mb-3">
        <label>Nama Belakang</label>
        <input bind:value={last_name} class="px-2 py-1 rounded border border-gray-400" />
      </div>
      <button 
        on:click={save}
        class="appearance-none bg-blue-600 text-white px-6 py-1 text-lg font-bold rounded">
        simpan
      </button>
    </div>
  </div>
</div>