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
import Inventory from "../interfaces/Inventory";

export class Player extends Sprite implements IPhysics{

    public maxSpeed: number;
    public acceleration: number;
    public drag: number;
    public momentumX: number;
    public momentumY: number;
    public collisionWeight: number = 3;
    private lastAngle: number;
    private emitter: Emitter;

    public canLand: boolean = false;
    public landed: boolean = false;
    public latestPlanet: Planet|null = null;

    public inventory: Inventory = {
        fuel: 500.00,
        maxFuel: 500,
        money: 1000
    };

    constructor(texture: string){
        super();

        this.maxSpeed = .5;
        this.momentumX = 0;
        this.momentumY = 0;
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
        let accelerating = false;

        if(Keyboard.get('KeyS') || Keyboard.get('ArrowDown')){
            // down
            if(Math.abs(this.momentumY) < this.maxSpeed) {
                this.momentumY -= this.acceleration;
            }
            accelerating = true;
        } else {
            if(Math.abs(this.momentumY) > 0 && this.momentumY < 0){
                this.momentumY += this.drag;
            }
        }

        if(Keyboard.get('KeyW') || Keyboard.get('ArrowUp')){
            // up
            if(Math.abs(this.momentumY) < this.maxSpeed) {
                this.momentumY += this.acceleration;
            }
            accelerating = true;
        } else {
            if(Math.abs(this.momentumY) > 0 && this.momentumY > 0){
                this.momentumY -= this.drag;
            }
        }

        if(Keyboard.get('KeyD') || Keyboard.get('ArrowRight')){
            // right
            if(Math.abs(this.momentumX) < this.maxSpeed) {
                this.momentumX -= this.acceleration;
            }
            accelerating = true;
        } else {
            if(Math.abs(this.momentumX) > 0 && this.momentumX < 0){
                this.momentumX += this.drag;
            }
        }

        if(Keyboard.get('KeyA') || Keyboard.get('ArrowLeft')){
            // left
            if(Math.abs(this.momentumX) < this.maxSpeed) {
                this.momentumX += this.acceleration;
            }
            accelerating = true;
        } else {
            if(Math.abs(this.momentumX) > 0 && this.momentumX > 0){
                this.momentumX -= this.drag;
            }
        }

        this.emitter.updateSpawnPos(this.x, this.y);
        if(new Vector(this.momentumX, this.momentumY).length < 0.1){
            this.emitter.emit = false;
        } else if(new Vector(this.momentumX, this.momentumY).length < 0.3) {
            this.emitter.emit = true;
            this.emitter.frequency = 0.01;
        } else if(new Vector(this.momentumX, this.momentumY).length < 0.7) {
            this.emitter.emit = true;
            this.emitter.frequency = 0.005;
        } else {
            this.emitter.emit = true;
            this.emitter.frequency = 0.001;
        }

        Manager.circleCollideWith(['target'], (target: Target) => {
            Manager.physicsBounce(this, target);
        }, this);

        this.canLand = false;
        Manager.circleCollideWith(['planet'], (planet: IGameObject) => {
            this.latestPlanet = <Planet>planet;
            this.canLand = true;
        }, this);
        GameStateService.canLand.value = this.canLand;

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

        // calculate fuel drain
        if(accelerating){
            this.inventory.fuel-= .01 * Manager.time;
        }
        if(this.momentumX > 0.01 || this.momentumY > 0.01){
            this.inventory.fuel-= .01 * Manager.time;
        }
        if(this.momentumX > 0.03 || this.momentumY > 0.03){
            this.inventory.fuel-= .01 * Manager.time;
        }

        if(this.inventory.fuel <= 0){
            GameStateService.gameOver.value = true;
            GameStateService.gameOverMessage.value = 'You ran out of fuel...';
            Manager.pauseScene();
        }

        let angle = this.getAngle(this.momentumX * Manager.time, this.momentumY * Manager.time);
        this.lastAngle = angle;
        // console.log(angle);
        this.angle = angle;
    }

    private getAngle(velocityX: number, velocityY: number): number{
        if(Math.abs(velocityX) < 0.00001 && Math.abs(velocityY) < 0.00001) return this.lastAngle;
        return (Math.atan2(velocityY, velocityX) * 180 / Math.PI) - 90;
    }

    public shoot(x: number, y: number){
        let bullet = new Bullet(x, y, this.momentumX, this.momentumY);
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
            PlanetUIService.show(this.latestPlanet);
            Manager.pauseScene();
        }
    }

    public takeOff(){
        this.landed = false;
        PlanetUIService.hide();
        Manager.continueScene();
    }
}
