<script>
    export let segment;
</script>

<ul class="nav">


    <li><a aria-current="{segment === undefined ? 'page' : undefined}" href="/">homepage</a></li>
        <li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="/about">about</a></li>
        <li><a aria-current="{segment === 'contacts' ? 'page' : undefined}" href="/contacts">contacts</a></li>
        <li><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="/blog">blog</a></li>
</ul>


<style>
    .nav{
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        list-style: none;
        width: 100%;
        margin: 0;
        padding: 2em 0;
    }
    .nav li{

    }
    .nav a{
        text-decoration: underline;
        color: #fff;
        padding: 0 1em;
        display: block;
        transition: all 0.3s ease-in-out;
        font-size: 4vw;
    }
    .nav [aria-current]{
        text-decoration: none;
        transform: scale(1.5);
    }
    .nav a:hover{
        text-decoration: none;
    }
</style>