import { Sprite } from "pixi.js";
import { Manager } from "../Manager";
import { World } from "../scenes/World";
import { IGameObject } from "../interfaces/IGameObject";
import GameStateService from "../services/GameStateService";
import { Vector } from "../utils/Vector";

export class Radar extends Sprite  implements IGameObject {
    public tags: Array<string> = ['radar'];
    public show: boolean = true;

    private fullOpacity: number = .2;
    private visibility: number = 0;

    constructor(){
        super();

        this.texture = Manager.getTexture('player.radar');

        this.anchor.set(.5, .5);
        this.scale.set(.5,.5);
        this.alpha = 0;

        const world = <World>Manager.scene;

        world.addChild(this);
        world.objects.push(this);
    }

    update() {
        // direction
        const angle = (new Vector(this.position.x, this.position.y))
            .subtract(GameStateService.headingPosition.value)
            .angle();

        this.angle = angle-180;

        // opacity
        if(this.show && this.visibility < 1){
            this.visibility += .015;
        } else if(!this.show && this.visibility > 0) {
            this.visibility -= .02;
        }

        if(this.visibility < 0) this.visibility = 0;
        if(this.visibility > 1) this.visibility = 1;
        this.visibility = Math.floor(this.visibility*1000)/1000;
        this.alpha = Math.floor((this.fullOpacity * this.visibility)*1000)/1000;
    }
}