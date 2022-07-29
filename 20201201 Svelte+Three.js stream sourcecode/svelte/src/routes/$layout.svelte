<script>
    import Nav from '$components/Nav.svelte';
    import Canvas from '$components/Canvas.svelte';
    export let segment;
</script>


<style>
    :root {
        font-family: "Barlow", sans-serif;
    }
    :global(body){
        position: relative;
        height: 100vh;
        width: 100vw;
        padding: 0;
        margin: 0;
        color: #fff;
        font-size: 2em;
    }
    :global(){
        color: #fff;
    }
    :global(.content){
        position: absolute;
        bottom: 100px;
        left: 100px;
        padding-right: 20px;
        text-shadow: 1px 1px 0 #000
    }

    :global(h1){
        font-size: 8vw;
    }

    
    .canvas{
        position: fixed;
        z-index: -1;
        width: 100vw;
        height: 100vh;
        background: green;
    }
    .canvas:before,.canvas:after{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30vh;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8421743697478992) 100%);
        content: ' ';
    }
    .canvas:after{
        bottom: auto;
        top: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 100%);
    }

</style>

<div class="canvas">
    <Canvas bind:page={segment}/>
</div>
<Nav {segment} />
<slot></slot>