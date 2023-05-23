import {Sprite} from "pixi.js";
import { IPhysics } from "../interfaces/IPhysics";
import { Vector } from "../utils/Vector";
import { Manager } from "../Manager";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import * as particles from '@pixi/particle-emitter';
import emitterSettings from "./../../assets/json/emitter.json";
import { IGameObject } from "../interfaces/IGameObject";
import { World } from "../scenes/World";

export class Traveler extends Sprite implements IPhysics, IGameObject {
    public tags: Array<string> = ['ship', 'traveler'];
    
    public maxSpeed: number;
    public acceleration: number;
    public drag: number;
    public momentum: Vector;
    public collisionWeight: number = 3;

    private lastAngle: number = 0;

    private emitter: Emitter;

    constructor() {
        super();

        this.maxSpeed = .5;
        this.momentum = new Vector(0,0);
        this.acceleration = 0.005;
        this.drag = 0.001;

        this.texture = Manager.getTexture('ship.traveler');

        this.anchor.set(.5,.5);

        const particleTexture = Manager.getTexture('player');

        this.scale.set(.5, .5);

        this.emitter = new particles.Emitter(Manager.scene.particles, upgradeConfig(emitterSettings, [particleTexture]));
        this.emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
        this.emitter.updateSpawnPos(0, 0);
        this.emitter.emit = false;
    }

    public update() {
        const world: World = <World>Manager.scene;

        const target = new Vector(world.player.position.x, world.player.position.y);
        const direction = (new Vector(this.position.x, this.position.y)).subtract(target).normalize();
        const acceleration = direction.scale(this.acceleration);

        if(!!acceleration.length) {
            this.momentum = this.momentum.add(acceleration);
        }


        /**
         *  Particles
         */
        this.emitter.updateSpawnPos(this.x, this.y);
        if(this.momentum.length < 0.1){
            this.emitter.emit = false;
        } else if(this.momentum.length < 0.3) {
            this.emitter.emit = true;
            this.emitter.frequency = 0.01;
        } else if(this.momentum.length < 0.7) {
            this.emitter.emit = true;
            this.emitter.frequency = 0.005;
        } else {
            this.emitter.emit = true;
            this.emitter.frequency = 0.001;
        }

        /**
         * Throttle momentum
         */
        if(this.momentum.length > this.maxSpeed){
            this.momentum = this.momentum.normalize().scale(this.maxSpeed);
        }

        /**
         *  Translate momentum into movement
         */
        this.y = this.y - (this.momentum.y * Manager.time);
        this.x = this.x - (this.momentum.x * Manager.time);

        // calculate angle
        if(this.momentum.length > 0.03) {
            let angle = this.getAngle(this.momentum.x * Manager.time, this.momentum.y * Manager.time);
            this.lastAngle = angle;
            this.angle = angle;
        }
    }

    private getAngle(velocityX: number, velocityY: number): number {
        if(Math.abs(velocityX) < 0.00001 && Math.abs(velocityY) < 0.00001) return this.lastAngle;
        return (Math.atan2(velocityY, velocityX) * 180 / Math.PI) - 90;
    }
}