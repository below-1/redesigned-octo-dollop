<script>
  import { post } from '../../../commons/api'
  import { form } from 'svelte-forms'

  let title = ''
  let meta_title = ''
  let content = ''

  let category_form = form(() =>({
    title: {
      value: title,
      validators: ['required']
    }
  }))

  async function save () {
    const payload = {
      title,
      meta_title,
      content
    }
    try {
      await post({ url: '/api/v1/category', payload })
      alert('sukses menambah data kategori')
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data kategori')
    }
  }
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data kategori</div>
    <div class="flex flex-col mb-3">
      <label>Nama</label>
      <input bind:value={title} class="border border-gray-300 rounded p-2" />
      {#if $category_form.fields.title.errors.includes('required')}
        <small class="text-red-500 text-xs">nama harus diisi</small>
      {/if}
    </div>
    <div class="flex flex-col mb-3">
      <label>Subtitle</label>
      <input bind:value={meta_title} class="border border-gray-300 rounded p-2" />
    </div>
    <div class="flex flex-col mb-3">
      <label>Keterangan</label>
      <textarea bind:value={content} rows=5 class="border border-gray-300 rounded p-2"></textarea>
    </div>
    <button 
      disabled={!$category_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>
  </div>
</div>