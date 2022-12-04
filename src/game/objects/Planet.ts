import { Sprite } from "pixi.js";
import { IGameObject } from "../interfaces/IGameObject";
import { Manager } from "../Manager";

export class Planet extends Sprite implements IGameObject {

    public tags: Array<string> = ['planet'];

    constructor(asset: string, x: number, y: number){
        super();
        this.texture = Manager.getTexture(asset);
        this.anchor.set(0.5, 0.5);

        this.scale.set(1,1);

        this.x = x;
        this.y = y;
    }

    update() {
        
    }
}