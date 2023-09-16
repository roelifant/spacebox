import { Sprite } from "pixi.js";
import { IPhysics } from "../interfaces/IPhysics";
import { IGameObject } from "../interfaces/IGameObject";
import { Vector } from "../utils/Vector";
import { Manager } from "../Manager";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import emitterSettings from "./../../assets/json/emitter.json";
import { World } from "../scenes/World";
import { Planet } from "./Planet";
import { Player } from "./Player";
import { IHasEmitter } from "../interfaces/IHasEmitter";

export class Enemy extends Sprite implements IPhysics, IGameObject, IHasEmitter {
    public tags: Array<string> = ['ship', 'enemy'];
    
    public maxSpeed: number = .5;
    public acceleration: number = 0.0035;
    public drag: number = 0.0015;
    public momentum: Vector = new Vector(0,0);
    public collisionWeight: number = 3;
    public emitter: Emitter;

    private lastAngle: number = 0;
    private target: Planet|Player|null = null;
    private chasing: boolean = false;
    private health: number = 3;
    private alive: boolean = true;
    
    constructor(texture: string) {
        super();

        this.texture = Manager.getTexture(texture);
        this.tint = 0xed5d5d;

        const particleTexture = Manager.getTexture('particles.exhaust');

        this.anchor.set(.5,.5);
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

        // detect player
        const playerDistance = position.distance(playerPosition);
    

        if(playerDistance <= 750) {
            this.chasing = true;
            this.target = world.player;
        }

        if(playerDistance >= 1750) {
            this.chasing = false;
            this.selectNewTarget();
        }

        if(this.target) {
            let targetPosition;
            if(!this.chasing && this.target instanceof Planet) {
                targetPosition = this.target.parallaxPosition;
                if(targetPosition.distance(position) > 400 ) {
                    const direction = position.subtract(targetPosition).normalize();
                    const acceleration = direction.scale(this.acceleration);
    
                    if(!!acceleration.length) this.momentum = this.momentum.add(acceleration);
                } else {
                    this.chasing = false;
                    this.target = null;
                }
            } else {
                targetPosition = playerPosition;

                let direction = position.subtract(targetPosition).normalize();
                if(playerDistance < 125) {
                    direction = direction.flipX().flipY();
                }
                const acceleration = direction.scale(this.acceleration);
                if(!!acceleration.length) this.momentum = this.momentum.add(acceleration);
            }
        } else {
            this.selectNewTarget();
        }

        /**
         * getting hit
         */
        this.tint = 0xed5d5d;
        Manager.circleCollideWith(['bullet'], (bullet: IGameObject) => {
            console.log('hit!');
            this.tint = 0xffffff;
            this.takeDamage();
            Manager.remove(bullet, 'bullets');
        }, this);


        /**
         *  Particles
         */
        this.emitter.updateSpawnPos(this.x, this.y);
        
        if(playerDistance < 1250 && this.alive) {
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

    private takeDamage(damage: number = 1) {
        this.health -= damage;
        if(this.health <= 0) {
            this.die();
        }
    }

    private die() {
        this.alive = false;
        this.emitter.emit = false;
        Manager.remove(this, 'ships');
        setTimeout(() => this.emitter.destroy(), 2500);
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