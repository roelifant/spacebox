import {Sprite} from "pixi.js";
import {Keyboard} from "../Keyboard";
import {Manager} from "../Manager";
import {Bullet} from "./Bullet";
import * as particles from '@pixi/particle-emitter';
import {Emitter, upgradeConfig} from "@pixi/particle-emitter";
import {Vector} from "../utils/Vector";
import {Target} from "./Target";
import {IPhysics} from "../interfaces/IPhysics";
import emitterSettings from "./../../assets/json/emitter.json";
import GameStateService from "../services/GameStateService";
import PlanetUIService from "../services/PlanetUIService";
import { Planet } from "./Planet";
import { IGameObject } from "../interfaces/IGameObject";
import { Asteroid } from "./Asteroid";
import { World } from "../scenes/World";

export class Player extends Sprite implements IPhysics{

    public maxSpeed: number;
    public acceleration: number;
    public drag: number;
    public momentum: Vector;
    public collisionWeight: number = 3;
    private lastAngle: number;
    private emitter: Emitter;

    public canLand: boolean = false;
    public landed: boolean = false;
    public latestPlanet: Planet|null = null;
    public respawnPoint: Vector|null = null;

    constructor(texture: string){
        super();

        this.maxSpeed = .5;
        this.momentum = new Vector(0, 0);
        this.acceleration = 0.005;
        this.drag = 0.001;
        this.lastAngle = 0;
        this.tint = 0x5894f5;

        this.texture = Manager.getTexture(texture);

        this.anchor.set(0.5, 0.5);

        const particleTexture = Manager.getTexture(texture);

        this.scale.set(.5, .5);

        this.emitter = new particles.Emitter(Manager.scene.particles, upgradeConfig(emitterSettings, [particleTexture]));
        this.emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
        this.emitter.updateSpawnPos(0, 0);
        this.emitter.emit = true;
    }

    public update(){

        const world: World = <World>Manager.scene;

        /**
         *  Keypress inputs
         */
        let accelerating = false;

        if(Keyboard.get('Space') && this.momentum.length > 0){
            // breaking

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
         *  Particles
         */
        this.emitter.updateSpawnPos(this.x, this.y);
        if(new Vector(this.momentum.x, this.momentum.y).length < 0.1){
            this.emitter.emit = false;
        } else if(new Vector(this.momentum.x, this.momentum.y).length < 0.3) {
            this.emitter.emit = true;
            this.emitter.frequency = 0.01;
        } else if(new Vector(this.momentum.x, this.momentum.y).length < 0.7) {
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
            console.log('coliding with asteroid');
            onAsteroid = true;
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

            if(!GameStateService.gameOver.value) this.canLand = true;

        }, this);
        GameStateService.canLand.value = this.canLand;

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

        console.log(this.x, this.y);

        // calculate angle
        if(this.momentum.length > 0.03) {
            let angle = this.getAngle(this.momentum.x * Manager.time, this.momentum.y * Manager.time);
            this.lastAngle = angle;
            this.angle = angle;
        }

        /**
         *  Fuel drain
         */ 
        if(accelerating){
            GameStateService.inventory.value.fuel-= .01 * Manager.time;
        }
        if(this.momentum.length > 0.01){
            GameStateService.inventory.value.fuel-= .01 * Manager.time;
        }
        if(this.momentum.length > 0.03){
            GameStateService.inventory.value.fuel-= .01 * Manager.time;
        }
    }

    private getAngle(velocityX: number, velocityY: number): number{
        if(Math.abs(velocityX) < 0.00001 && Math.abs(velocityY) < 0.00001) return this.lastAngle;
        return (Math.atan2(velocityY, velocityX) * 180 / Math.PI) - 90;
    }

    public shoot(x: number, y: number){
        let bullet = new Bullet(x, y, this.momentum.x, this.momentum.y);
        Manager.add(bullet, 'bullets');
        bullet.x = this.x;
        bullet.y = this.y;
    }

    public onDestroy(){
        this.emitter.destroy();
    }

    public pauseEmitter(boolean: boolean){
        this.emitter.autoUpdate = !boolean;
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

        console.log(x, y);
    }
}
