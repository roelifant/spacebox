import {Sprite} from "pixi.js";

export interface IPhysics extends Sprite{
    maxSpeed: number;
    acceleration: number;
    drag: number;
    momentumX: number;
    momentumY: number;
    collisionWeight: number;
}
