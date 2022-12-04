import { TilingSprite, Texture, DisplayObject } from "pixi.js";

export class WrappingBackground extends TilingSprite {

    private target: DisplayObject;
    private parallax: number = 0;

    private startPosX: number = 0;
    private startPosY: number = 0;

    constructor(texture: Texture, target: DisplayObject, parallax: number, scale: number) {
        super(texture, texture.baseTexture.width, texture.baseTexture.height);
        this.anchor.set(0.5, 0.5);

        this.target = target;

        this.tilePosition.x = 0;
        this.tilePosition.y = 0;
        this.startPosX = 0;
        this.startPosY = 0;

        this.scale.set(scale, scale);

        this.parallax = parallax;
    }

    update() {
        if(!!this.target){
            // get target position in stage
            let { x, y } = this.target.position;

            this.x = x;
            this.y = y;

            if (this.parallax > 0 && this.target) {
                let { x, y } = this.target.position;
                this.tilePosition.x = this.startPosX - (x * (1 - this.parallax));
                this.tilePosition.y = this.startPosY - (y * (1 - this.parallax));
            }
        }
    }
}