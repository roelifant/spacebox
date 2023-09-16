import {Sprite} from "pixi.js";
import { IPhysics } from "../interfaces/IPhysics";
import { Vector } from "../utils/Vector";
import { Manager } from "../Manager";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import emitterSettings from "./../../assets/json/exhaustEmitter.json";
import { IGameObject } from "../interfaces/IGameObject";
import { World } from "../scenes/World";
import { Planet } from "./Planet";
import { IHasEmitter } from "../interfaces/IHasEmitter";

export class Traveler extends Sprite implements IPhysics, IGameObject, IHasEmitter {
    public tags: Array<string> = ['ship', 'traveler'];
    
    public maxSpeed: number = .5;
    public acceleration: number = 0.003;
    public drag: number = 0.001;
    public momentum: Vector = new Vector(0,0);
    public collisionWeight: number = 3;
    public emitter: Emitter;

    private lastAngle: number = 0;
    private target: Planet|null = null;

    constructor() {
        super();

        this.texture = Manager.getTexture('ship.traveler');

        this.anchor.set(.5,.5);

        const particleTexture = Manager.getTexture('particles.exhaust');

        this.scale.set(.5, .5);

        this.emitter = new Emitter(Manager.scene.particles, upgradeConfig(emitterSettings, [particleTexture]));
        this.emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
        this.emitter.updateSpawnPos(0, 0);
        this.emitter.emit = false;
    }

    public update() {
        const world = <World>Manager.scene;
        const position = new Vector(this.position.x, this.position.y);
        const playerPosition = new Vector(world.player.x, world.player.y);

        if(this.target) {
            const targetPosition = this.target.parallaxPosition;
            const positionVector = new Vector(this.position.x, this.position.y);

            if(targetPosition.distance(positionVector) > 400 ) {
                const direction = positionVector.subtract(targetPosition).normalize();
                const acceleration = direction.scale(this.acceleration);

                if(!!acceleration.length) this.momentum = this.momentum.add(acceleration);
            } else {
                this.target = null;
            }
        } else {
            this.selectNewTarget();
        }

        /**
         *  Particles
         */
        this.emitter.updateSpawnPos(this.x, this.y);
        if(playerPosition.distance(position) < 1250) {
        
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
        } else {
            this.emitter.emit = false;
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

    public pauseEmitter(value: boolean){
        this.emitter.autoUpdate = !value;
    }


    
    private getAngle(velocityX: number, velocityY: number): number {
        if(Math.abs(velocityX) < 0.00001 && Math.abs(velocityY) < 0.00001) return this.lastAngle;
        return (Math.atan2(velocityY, velocityX) * 180 / Math.PI) - 90;
    }

    private selectNewTarget(){
        const world: World = <World>Manager.scene;

        const newTarget = world.planets[Math.floor(world.planets.length*Math.random())];

        this.target = newTarget;
    }
}