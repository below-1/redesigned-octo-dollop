	<script>
	import successkid from 'images/successkid.jpg';
</script>

<style lang="css">
 	.logo {
 		animation: logo_spin 3s infinite;
 		animation-timing-function: cubic-bezier(0.68, -0.55, 0.256, 1.55);
 	}

	@keyframes logo_spin {
		 0% {
		 	transform: rotate(0deg);
		 }
		 100% {
		 	transform: rotate(260deg);
		 }
	}
</style>

<svelte:head>
	<title>Cendana</title>
</svelte:head>

<nav class="fixed top-0 left-0 right-0 border-b border-gray-300 h-12 flex items-center justify-center">
	<div>Applikasi Keuangan Berbasis Web</div>
</nav>

<div class="h-screen">
	<main class="flex flex-col items-center justify-center h-full">
		<h1 class="text-4xl font-bold tracking-widest">CENDANA</h1>

		<figure>
			<img class="logo" alt="Success Kid" height="256" width="256" src="/setting.svg">
			<figcaption class="text-center">Olah data anda!</figcaption>
		</figure>

		<p><strong>Masuk kedalam sistem</strong></p>
		<a 
			href="/login"
			class="appearance-none bg-blue-600 text-white px-12 py-2 rounded font-bold my-4 text-lg">login</a>

	</main>
</div>
