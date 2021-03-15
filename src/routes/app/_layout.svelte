<script>
	import { onMount } from 'svelte'
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import TiChartBar from 'svelte-icons/ti/TiChartBar.svelte'
	import FaBars from 'svelte-icons/fa/FaBars.svelte'
	import FaMoneyCheck from 'svelte-icons/fa/FaMoneyCheck.svelte'
	import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte'
	import FaTachometerAlt from 'svelte-icons/fa/FaTachometerAlt.svelte'
	import FaUsers from 'svelte-icons/fa/FaUsers.svelte'
	import FaTruckMoving from 'svelte-icons/fa/FaTruckMoving.svelte'
	import FaHandHoldingUsd from 'svelte-icons/fa/FaHandHoldingUsd.svelte'
	import FaHandHoldingHeart from 'svelte-icons/fa/FaHandHoldingHeart.svelte'
	import FaBoxes from 'svelte-icons/fa/FaBoxes.svelte'
	import FaLandmark from 'svelte-icons/fa/FaLandmark.svelte'
	import FaListOl from 'svelte-icons/fa/FaListOl.svelte'
	import { fade } from 'svelte/transition';
	import { del_confirm } from './store'

	export let segment;

	const logo_size = 24;
	const menu_slim_size = 12;
	const menu_full_size = 64;

	let is_slim = true;

	const menus = [
		{ path: '/app', label: 'dashboard', icon: FaTachometerAlt },
		{ group: true, label: 'master' },
		{ path: '/app/category', label: 'kategori', desc: 'pengolahan data kategori barang', icon: FaListOl },
		{ path: '/app/customer', label: 'pelanggan', desc: 'pengolahan data pelanggan', icon: FaUsers },
		{ path: '/app/supplier', label: 'supplier', desc: 'pengolahan data supplier', icon: FaTruckMoving },
		{ path: '/app/product', label: 'gudang', desc: 'pengolahan data barang', icon: FaBoxes },
		{ group: true, label: 'transaksi' },
		{ path: '/app/pembelian', label: 'pembelian', desc: 'pengolahan data pembelian', icon: FaHandHoldingUsd },
		{ path: '/app/penjualan', label: 'penjualan', desc: 'pengolahan data kategori penjualan', icon: FaHandHoldingHeart },
		{ path: '/app/bu', label: 'beban usaha', desc: 'pengolahan data beban usaha', icon: FaLandmark },
		{ path: '/app/piutang', label: 'piutang', desc: 'pengolahan data piutang', icon: FaLandmark },
	]

	onMount(() => {
		tippy('[data-tippy-content]')
	})
</script>

<nav 
	class="top-nav fixed top-0 left-0 right-0 h-16 flex items-center px-6 bg-white"
	style={`left: ${is_slim ? '3.5' : '16' }rem;`}
>
	<input
		class="bg-gray-100 p-2 rounded text-sm"
		placeholder="keyword.."
	/>
</nav>

<nav 
	class="sidenav fixed bottom-0 left-0 top-0 bg-gray-900 text-gray-200"
	class:w-64="{!is_slim}"
	class:w-14="{is_slim}"
>
	<!-- <div class="flex items-center justify-center py-5">
		<img class="logo mr-2" alt="Success Kid" height="32" width="32" src="/setting.svg">
		<div class="font-bold my-2 text-lg">cendana</div>
	</div> -->
	<ul class="overflow-hidden">
		<li 
			on:click={() => {
				is_slim = !is_slim
			}}
			class="bg-indigo-900 hover:bg-gray-700 flex items-center justify-center"
		>
			<div 
				class="w-14 py-6 flex items-center justify-center"
			>
				<img class="logo" alt="Success Kid" height="32" width="32" src="/setting.svg">
			</div>
			{#if !is_slim}
				<div class="font-bold my-2 text-lg">cendana</div>
			{/if}
		</li>
		{#each menus as menu}
			{#if menu.group}
				{#if !is_slim}
					<li class="py-3 pl-6 font-semibold">
						{menu.label}
					</li>
				{:else}
					<li class="w-14 h-6"></li>
				{/if}
			{:else}
			<li class="hover:bg-gray-700" data-tippy-content={menu.desc}>
				<a 
					href={menu.path} 
					class="flex items-center"
				>
					<div
						class="w-14 py-3 flex items-center justify-center text-gray-400"
					>
						<div class="w-5 h-5">
							<svelte:component this={menu.icon} />
						</div>
					</div>
					{#if !is_slim}
						<div class="text-gray-300 font-light hover:font-semibold">{menu.label}</div>
					{/if}
				</a>
			</li>
			{/if}
		{/each}
	</ul>
</nav>

<main class="pt-20 mx-6 flex flex-col"
	class:pl-14="{is_slim}"
	class:pl-64="{!is_slim}"
	style="min-height: 100vh;"
>
	<slot></slot>
</main>

{#if $del_confirm.value}
	<div
		class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center"
		style="z-index: 100; background: rgb(250, 250, 250, 0.8);"
		transition:fade
	>
		<div class="p-6 bg-white rounded shadow-xl">
			<div 
				class="font-bold text-gray-600 text-lg"
				style="max-width: 500px;" 
			>Anda yakin akan menghapus data {$del_confirm.entity} #{$del_confirm.id}?</div>
			<div class="flex items-center mt-2">
				<button 
					on:click={$del_confirm.on_yes}
					class="apperance-none bg-red-600 text-white px-6 py-1 font-bold mr-2 rounded">ya</button>
				<button 
					class="apperance-none bg-green-600 text-white px-6 py-1 font-bold mr-2 rounded"
					on:click={() => {
						del_confirm.hide()
					}}
				>tidak</button>
			</div>
		</div>
	</div>
{/if}