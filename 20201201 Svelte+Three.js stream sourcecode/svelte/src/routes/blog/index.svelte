<script context="module">
	export function preload() {
		return this.fetch(`https://reqres.in/api/users`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>
    
<script>
    export let posts;
    import { fade } from 'svelte/transition';
    import {customtransition} from "$components/transition"
</script>

<div class="content" transition:fade>
    <h1>Blog page</h1>

    {#each posts.data as post}
        <li><a rel="prefetch" href="blog/{post.id}">{post.first_name} - {post.email}</a></li>
    {/each}
</div>

<style>
    li a{
        color: #fff;
        font-size: minmax(5vw, 30px);
    }
</style>
