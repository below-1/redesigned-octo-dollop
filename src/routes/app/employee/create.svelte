<script>
  import { post } from '../../../commons/api'
  import { form } from 'svelte-forms'

  let first_name = '';
  let username = '';
  let mobile = '';
  let password = '';
  let password_confirm = '';

  const password_valid = value => {
    return {
      name: "password_valid",
      valid: value == password
    }
  }

  let create_employee_form = form(() =>({
    first_name: {
      value: first_name,
      validators: ['required']
    },
    username: {
      value: username,
      validators: ['required']
    },
    password: {
      value: password,
      validators: ['required']
    },
    password_confirm: {
      value: password_confirm,
      validators: [password_valid]
    }
  }));

  async function save () {
    const payload = {
      first_name,
      username,
      password,
      role: 'EMPLOYER'
    };
    try {
      const response = await post({ url: '/auth/register', payload });
      alert('sukses menambah data pegawai');
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data pegawai');
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data pegawai</div>

    <div class="flex flex-col mb-3">
      <label>Nama</label>
      <input bind:value={first_name} class="border border-gray-300 rounded p-2" />
      {#if $create_employee_form.fields.first_name.errors.includes('required')}
        <small class="text-red-500 text-xs">nama harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Username</label>
      <input bind:value={username} class="border border-gray-300 rounded p-2" />
      {#if $create_employee_form.fields.username.errors.includes('required')}
        <small class="text-red-500 text-xs">Username harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Password</label>
      <input type="password" bind:value={password} class="border border-gray-300 rounded p-2" />
      {#if $create_employee_form.fields.password.errors.includes('required')}
        <small class="text-red-500 text-xs">Password harus diisi</small>
      {/if}
    </div>

    <div class="flex flex-col mb-3">
      <label>Ulangi Password</label>
      <input type="password" bind:value={password_confirm} class="border border-gray-300 rounded p-2" />
      {#if $create_employee_form.fields.password_confirm.errors.includes('password_valid')}
        <small class="text-red-500 text-xs">Password Tidak Cocok</small>
      {/if}
    </div>

    <button 
      disabled={!$create_employee_form.valid}
      on:click={save} 
      class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50"
    >simpan</button>

  </div>
</div>