<script>
  import { onMount } from 'svelte'
  import { post, get } from '../../../commons/api'
  import MultiSelect from '../../../components/MultiSelect.svelte'
  import { form } from 'svelte-forms'

  let title = ''
  let summary = ''
  let content = ''
  let unit = ''
  let categories = []
  let selected_category = []

  let product_form = form(() => ({
    title: {
      value: title,
      validators: ['required']
    }
  }))

  async function load_category () {
    try {
      categories = await get({ url: '/api/v1/category' })
    } catch (err) {
      console.log(err)
      alert('gagal memuat data kategori')
    }
  }

  async function save () {
    const payload = {
      title,
      summary,
      content,
      unit,
      categories_id: selected_category
    }
    const url = '/api/v1/product'
    try {
      const response = await post({ url, payload })
      console.log(response)
      alert('sukses menambah data produk')
      window.history.back()
    } catch (err) {
      console.log(err)
      alert('gagal menambah data produk')
    }
  }

  onMount(async () => {
    await load_category()
  })
</script>

<div class="flex items-center justify-center flex-grow">
  <div class="w-1/3 p-4 rounded bg-white text-sm">
    <div class="font-bold text-xl mb-3">input data produk</div>
    <div class="flex flex-col mb-3">
      <label>Nama</label>
      <input bind:value={title} class="border border-gray-300 rounded p-2" />
      {#if $product_form.fields.title.errors.includes('required')}
        <small class="text-red-500 text-xs">nama harus diisi</small>
      {/if}
    </div>
    <div class="flex flex-col mb-3">
      <label>Satuan</label>
      <input bind:value={unit} class="border border-gray-300 rounded p-2" />
    </div>
    <div class="flex flex-col mb-3">
      <label>Kategori</label>
      <MultiSelect
        options={categories.map(it => ({ label: it.title, value: it.id }))}
        selected={selected_category}
        label="pilih kategori"
        on:select={event => {
          selected_category.push(event.detail)
          selected_category = [ ...selected_category ]
        }}
        on:remove={event => {
          selected_category = selected_category.filter(x => x != event.detail)
        }}
      />
    </div>
    <div class="flex flex-col mb-3">
      <label>Penjelasan</label>
      <textarea bind:value={summary} class="border border-gray-300 rounded p-2"></textarea>
    </div>
    <div class="flex flex-col mb-3">
      <label>Info Tambahan</label>
      <textarea bind:value={content} class="border border-gray-300 rounded p-2"></textarea>
    </div>
    <button 
      disabled={!$product_form.valid}
      on:click={save} class="px-6 py-1 bg-blue-600 text-white font-bold rounded shadow disabled:opacity-50">simpan</button>
  </div>
</div>
