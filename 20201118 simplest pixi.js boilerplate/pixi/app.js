import * as PIXI from 'pixi.js'

class Sketch{
    constructor(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.app = new PIXI.Application({
            backgroundColor: 0x1099bb, 
            resolution: window.devicePixelRatio || 1,
            resizeTo: window
        });

        document.body.appendChild(this.app.view);
        this.app.view.style.width = this.width + 'px'
        this.app.view.style.height = this.height + 'px'
        
        this.container = new PIXI.Container();
        
        this.app.stage.addChild(this.container);

        this.add()
        this.render()
    }

    add(){
        let block = new PIXI.Sprite(PIXI.Texture.WHITE);
        block.tint = 0xff0000;
        block.width = 100;
        block.height = 100;

        this.container.addChild(block)
    }

    render(){
        this.app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            // container.rotation -= 0.01 * delta;
            console.log(delta);
        });
        
    }
}


new Sketch();