<script context="module">
  export async function preload (page) {
    return page.params
  }
</script>

<script>
  import { put, get } from '../../../../commons/api'
  import { form } from 'svelte-forms'

  export let id
  let name = ''

  const main_form = form(() => ({
    name: {
      value: name,
      validators: ['required']
    }
  }))

  async function load_opex (id) {
    if (!id) return
    if (!process.browser) return
    const url = `/api/v1/optype/${id}`
    try {
      const result = await get({
        url
      })
      name = result.name
    } catch (err) {
      console.log(err)
      alert('gagal mengambil data beban usaha')
    }    
  }
  $: load_opex(id)

  async function save () {
    const url = `/api/v1/optype/${id}`
    try {
      const result = await put({
        url,
        payload: {
          name
        }
      })
      window.history.back()
      console.log(result)
    } catch (err) {
      console.log(err)
      alert('gagal mengubah data beban usaha')
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">

    <div class="font-semibold text-gray-600 text-xl mb-4">input jenis beban usaha</div>

    <div class="flex flex-col mb-4  ">
      <label>Nama</label>
      <div class="flex flex-col">
        <input bind:value={name} class="border border-gray-300 rounded px-2 py-1" />
        {#if $main_form.fields.name.errors.includes('required')}
          <small class="text-red-500 text-xs">nama harus diisi</small>
        {/if}
      </div>
    </div>

    <button 
      disabled={!$main_form.valid}
      on:click={save} 
      class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan
    </button>

  </div>
</div>