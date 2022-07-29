<script>
    import { fade } from 'svelte/transition';
    import {customtransition} from "$components/transition"
</script>

<div class="content" in:customtransition out:fade>
    <h1>Contacts page</h1>
</div>
