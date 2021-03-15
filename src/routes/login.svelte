<script>
  import { goto } from '@sapper/app';
  import { form } from 'svelte-forms'
  import { post } from '../commons/api'

  let username = '';
  let password = '';

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
    }
  }), validation_options)

  async function login () {
    const payload = {
      username,
      password
    }
    try {
      const response = await post({ url: '/auth/login', payload })
      const token = response.token
      localStorage.setItem('waka.token', token)
      console.log(response)
      goto('/app')
      
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
      <div class="font-black text-gray-500">login</div>
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
      <button 
        on:click={login}
        class="appearance-none bg-blue-600 text-white px-6 py-1 text-lg font-bold rounded">
        login
      </button>
    </div>
  </div>
</div>