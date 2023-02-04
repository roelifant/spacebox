import {Sprite} from "pixi.js";
import { Vector } from "../utils/Vector";

export interface IPhysics extends Sprite{
    maxSpeed: number;
    acceleration: number;
    drag: number;
    momentum: Vector;
    collisionWeight: number;
}
