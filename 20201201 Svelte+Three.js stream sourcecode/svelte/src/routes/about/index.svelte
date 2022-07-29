<script>
    import { fade } from 'svelte/transition';
    import {customtransition} from "$components/transition"
</script>

<div class="content" in:customtransition out:fade>
    <h1>About page</h1>
    <p>Some about page content goes here</p>
</div>

