import {Loader, Sprite, Texture} from "pixi.js";
import {IGameObject} from "../interfaces/IGameObject";
import {Manager} from "../Manager";
import {IPhysics} from "../interfaces/IPhysics";

export class Target extends Sprite implements IGameObject, IPhysics {

    public maxSpeed: number = 1;
    public acceleration: number = 0.005;
    public drag: number = 0.002;
    public momentumX: number = 0;
    public momentumY: number = 0;
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

        if(Math.abs(this.momentumY) > 0 && this.momentumY < 0){
            this.momentumY += this.drag;
        }
        if(Math.abs(this.momentumY) > 0 && this.momentumY > 0){
            this.momentumY -= this.drag;
        }
        if(Math.abs(this.momentumX) > 0 && this.momentumX < 0){
            this.momentumX += this.drag;
        }
        if(Math.abs(this.momentumX) > 0 && this.momentumX > 0){
            this.momentumX -= this.drag;
        }

        if(Math.abs(this.momentumX) > this.maxSpeed){
            console.log('over max');
            if(this.momentumX < 0){
                this.momentumX = -this.maxSpeed;
            } else {
                this.momentumX = this.maxSpeed;
            }
        }
        if(Math.abs(this.momentumY) > this.maxSpeed){
            console.log('over max');
            if(this.momentumY < 0){
                this.momentumY = -this.maxSpeed;
            } else {
                this.momentumY = this.maxSpeed;
            }
        }
        this.y = this.y - this.momentumY * Manager.time;
        this.x = this.x - this.momentumX * Manager.time;

        // Manager.circleCollideWith(['target'], (target: Target) => {d
    }
}
