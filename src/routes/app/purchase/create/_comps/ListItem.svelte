<script>
  import '../../../../../styles/jo-table.css'

  export let items;
</script>

<div class="bg-white px-4 mb-4 py-2">
  <div class="flex items-center">
    <div class="font-semibold mb-4">List Item Pembelian</div>
    <div class="flex-grow"></div>
    <a
      href="/app/purchase/create/add_item"
      class="appearance-none border border-green-500 px-4 flex items-center font-bold rounded mr-4"
    >
      tambah item
    </a>
  </div>
  <table class="jo-table">
    <thead>
      <tr>
        <th>no.</th>
        <th>produk</th>
        <th>jumlah</th>
        <th>harga</th>
        <th>diskon</th>
        <th>mrp</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each $items as item, i}
        <tr>
          <td>{i + 1}</td>
          <td>{item.product_title}</td>
          <td>{item.quantity}</td>
          <td>{item.price}</td>
          <td>{item.discount}</td>
          <td>{item.mrp}</td>
          <td></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>