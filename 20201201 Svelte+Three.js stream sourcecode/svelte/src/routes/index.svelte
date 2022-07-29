<script>
	import Counter from '$components/Counter.svelte';
	import { fade } from 'svelte/transition';
	import {customtransition} from "$components/transition"
</script>

<div class="content" transition:fade>
	<h1>Homepage</h1>
	<Counter/>
</div>
