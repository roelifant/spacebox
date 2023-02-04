import {Loader, Sprite, Texture} from "pixi.js";
import {IGameObject} from "../interfaces/IGameObject";
import {Manager} from "../Manager";
import {IPhysics} from "../interfaces/IPhysics";
import { Vector } from "../utils/Vector";

export class Target extends Sprite implements IGameObject, IPhysics {

    public maxSpeed: number = 1;
    public acceleration: number = 0.005;
    public drag: number = 0.002;
    public momentum: Vector = new Vector(0,0);
    public collisionWeight: number = 1;
    public tags: Array<string> = ['target'];

    constructor(){
        super();

        const resource: Texture | undefined = Loader.shared.resources['asteroid.1'].texture;
        if(typeof resource === 'undefined'){
            throw Error('Not a valid texture!');
        }
        this.texture = resource;

        // this.anchor.set(0.5, 0.5);

        this.pivot.set(this.width/2, this.height/2);

        this.scale.set(0.5, 0.5);
    }

    update(){
        this.tint = 0xffffff;

        Manager.circleCollideWith(['bullet'], (bullet: IGameObject) => {
            this.tint = 0xff3838;
            console.log(bullet);
        }, this);

        if(Math.abs(this.momentum.y) > 0 && this.momentum.y < 0){
            this.momentum.y += this.drag;
        }
        if(Math.abs(this.momentum.y) > 0 && this.momentum.y > 0){
            this.momentum.y -= this.drag;
        }
        if(Math.abs(this.momentum.x) > 0 && this.momentum.x < 0){
            this.momentum.x += this.drag;
        }
        if(Math.abs(this.momentum.x) > 0 && this.momentum.x > 0){
            this.momentum.x -= this.drag;
        }

        if(Math.abs(this.momentum.x) > this.maxSpeed){
            console.log('over max');
            if(this.momentum.x < 0){
                this.momentum.x = -this.maxSpeed;
            } else {
                this.momentum.x = this.maxSpeed;
            }
        }
        if(Math.abs(this.momentum.y) > this.maxSpeed){
            console.log('over max');
            if(this.momentum.y < 0){
                this.momentum.y = -this.maxSpeed;
            } else {
                this.momentum.y = this.maxSpeed;
            }
        }
        this.y = this.y - this.momentum.y * Manager.time;
        this.x = this.x - this.momentum.x * Manager.time;

        // Manager.circleCollideWith(['target'], (target: Target) => {d
    }
}
