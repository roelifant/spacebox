import {Sprite} from "pixi.js";
import {Keyboard} from "../Keyboard";
import {Manager} from "../Manager";
import {Bullet} from "./Bullet";
import {Emitter, upgradeConfig} from "@pixi/particle-emitter";
import {Vector} from "../utils/Vector";
import {Target} from "./Target";
import {IPhysics} from "../interfaces/IPhysics";
import emitterSettings from "./../../assets/json/exhaustEmitter.json";
import GameStateService from "../services/GameStateService";
import PlanetUIService from "../services/PlanetUIService";
import { Planet } from "./Planet";
import { IGameObject } from "../interfaces/IGameObject";
import { Asteroid } from "./Asteroid";
import { World } from "../scenes/World";
import { Radar } from "./Radar";
import { IHasEmitter } from "../interfaces/IHasEmitter";
import { Explosion } from "./Explosion";

export class Player extends Sprite implements IPhysics, IGameObject, IHasEmitter {
    public tags: Array<string> = ['ship', 'player'];

    public maxSpeed: number;
    public acceleration: number;
    public drag: number;
    public momentum: Vector;
    public collisionWeight: number = 3;
    public radar: Radar|undefined;

    public canLand: boolean = false;
    public landed: boolean = false;
    public latestPlanet: Planet|null = null;
    public respawnPoint: Vector|null = null;
    public emitter: Emitter;
    public exploded: boolean = false;

    private lastAngle: number;

    constructor(texture: string) {
        super();

        this.maxSpeed = .5;
        this.momentum = new Vector(0, 0);
        this.acceleration = 0.005;
        this.drag = 0.001;
        this.lastAngle = 0;
        this.tint = 0x5894f5;

        this.texture = Manager.getTexture(texture);

        this.anchor.set(0.5, 0.5);

        const particleTexture = Manager.getTexture('particles.exhaust');

        this.scale.set(.5, .5);

        this.emitter = new Emitter(Manager.scene.particles, upgradeConfig(emitterSettings, [particleTexture]));
        this.emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
        this.emitter.updateSpawnPos(0, 0);
        this.emitter.emit = true;

        this.radar = new Radar();
    }

    public update() {

        if(this.exploded) this.alpha = 0;
        else this.alpha = 1;

        const world: World = <World>Manager.scene;

        /**
         *  Keypress inputs
         */
        let accelerating = false;
        let breaking = false;

        if(Keyboard.get('Space') && this.momentum.length > 0){
            // breaking
            breaking = true;
            const slowDownVector = this.momentum.normalize().scale(this.maxSpeed).divide(50);

            this.momentum = this.momentum.subtract(slowDownVector);

            if(this.momentum.length < 0.01){
                this.momentum.x = 0;
                this.momentum.y = 0;
            }

        } else {
            if(Keyboard.get('KeyS') || Keyboard.get('ArrowDown')){
                // down
                if(Math.abs(this.momentum.y) < this.maxSpeed) {
                    this.momentum.y -= this.acceleration;
                }
                accelerating = true;
            } else {
                if(Math.abs(this.momentum.y) > 0 && this.momentum.y < 0){
                    this.momentum.y += this.drag;
                }
            }
    
            if(Keyboard.get('KeyW') || Keyboard.get('ArrowUp')){
                // up
                if(Math.abs(this.momentum.y) < this.maxSpeed) {
                    this.momentum.y += this.acceleration;
                }
                accelerating = true;
            } else {
                if(Math.abs(this.momentum.y) > 0 && this.momentum.y > 0){
                    this.momentum.y -= this.drag;
                }
            }
    
            if(Keyboard.get('KeyD') || Keyboard.get('ArrowRight')){
                // right
                if(Math.abs(this.momentum.x) < this.maxSpeed) {
                    this.momentum.x -= this.acceleration;
                }
                accelerating = true;
            } else {
                if(Math.abs(this.momentum.x) > 0 && this.momentum.x < 0){
                    this.momentum.x += this.drag;
                }
            }
    
            if(Keyboard.get('KeyA') || Keyboard.get('ArrowLeft')){
                // left
                if(Math.abs(this.momentum.x) < this.maxSpeed) {
                    this.momentum.x += this.acceleration;
                }
                accelerating = true;
            } else {
                if(Math.abs(this.momentum.x) > 0 && this.momentum.x > 0){
                    this.momentum.x -= this.drag;
                }
            }
        }

        /**
         * getting hit
         */
        this.tint = 0x5894f5;
        Manager.circleCollideWith(['bullet'], (bullet: IGameObject) => {
            if(bullet.tags.includes('enemyBullet')) {
                this.tint = 0xff0000;
                this.takeDamage();
                Manager.remove(bullet, 'bullets');
            }
        }, this);

        /**
         *  Particles
         */
        this.emitter.updateSpawnPos(this.x, this.y);
        if(this.momentum.length < 0.1 || this.exploded){
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
         *  Collisions
         */

        /**
         *      Targets (TODO: remove this at some point)
         */
        Manager.circleCollideWith(['target'], (target: Target) => {
            Manager.physicsBounce(this, target);
        }, this);

        /**
         *      Asteroids
         */
        let onAsteroid = false;
        Manager.circleCollideWith(['asteroid'], (asteroid: Asteroid) => {
            onAsteroid = true;
            if(GameStateService.totalCargo.value >= GameStateService.inventory.value.maxCargo) return;
            GameStateService.miningProgress.value += Manager.time;
            if(GameStateService.miningProgress.value >= GameStateService.miningProgressLimit.value){
                asteroid.mine();
                GameStateService.miningProgress.value = 0;
            }
        }, this);
        if(!onAsteroid){ GameStateService.miningProgress.value = 0}

        /**
         *      Planets
         */
        this.canLand = false;
        Manager.circleCollideWith(['planet'], (planet: IGameObject) => {


            this.latestPlanet = <Planet>planet;

            this.respawnPoint = new Vector(
                this.latestPlanet.x + world.planetGroup.x,
                this.latestPlanet.y + world.planetGroup.y
            );

            if(!GameStateService.gameOver.value) {
                 this.canLand = true;
                 this.latestPlanet.discovered = true;
            }
        }, this);
        GameStateService.canLand.value = this.canLand;

        if(!this.exploded) {
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

            /**
             *  Fuel drain
             */ 
            if(accelerating) GameStateService.inventory.value.fuel-= .015 * Manager.time;
            if(breaking) GameStateService.inventory.value.fuel-= .015 * Manager.time;
            GameStateService.inventory.value.fuel-= (this.momentum.length * .015) * Manager.time;
        }

        GameStateService.updateHeadings();
    }

    public shoot(x: number, y: number){
        GameStateService.inventory.value.ammo--;
        const relativeX = x - (Manager.width/2);
        const relativeY = y - (Manager.height/2);
        let bullet = new Bullet(relativeX, relativeY, this.momentum.x, this.momentum.y, ['playerBullet']);
        Manager.add(bullet, 'bullets');
        bullet.x = this.x;
        bullet.y = this.y;
    }

    public onDestroy(){
        this.emitter.destroy();
    }

    public pauseEmitter(value: boolean){
        this.emitter.autoUpdate = !value;
    }

    public land(){
        if(!!this.latestPlanet){
            this.landed = true;
            GameStateService.landed.value = true;
            PlanetUIService.show(this.latestPlanet);
            Manager.pauseScene();
        }
    }

    public takeOff(){
        this.landed = false;
        GameStateService.landed.value = false;
        PlanetUIService.hide();
        Manager.continueScene();
    }

    public teleport(x: number, y: number, keepMomentum: boolean = true){
        
        if(!keepMomentum){
            this.momentum.x = 0;
            this.momentum.y = 0;
        }
        
        const oldX = this.x;
        const oldY = this.y;
        this.x = x;
        this.y = y;
            
        if((oldX - x) < 0){
            Manager.scene.x -= (oldX - x);
        } else {
            Manager.scene.x += (oldX - x);
        }

        if((oldY - y) < 0){
            Manager.scene.y -= (oldY - y);
        } else {
            Manager.scene.y += (oldY - y);
        }
    }



    private getAngle(velocityX: number, velocityY: number): number {
        if(Math.abs(velocityX) < 0.00001 && Math.abs(velocityY) < 0.00001) return this.lastAngle;
        return (Math.atan2(velocityY, velocityX) * 180 / Math.PI) - 90;
    }

    private takeDamage(damage: number = 1) {
        GameStateService.inventory.value.hull -= damage;
        if(GameStateService.inventory.value.hull <= 0) {
            this.explode();
            setTimeout(() => {
                GameStateService.shipDestroyed.value = true;
            }, 1250)
        }
    }

    private explode() {
        this.exploded = true;
        new Explosion(this.x, this.y, 200, 4000, {color: {
            start: '#5894f5',
            end: "#ff843d"
        }});
    }
}
