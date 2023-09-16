import { Emitter, EmitterConfigV1, upgradeConfig } from "@pixi/particle-emitter";
import { IHasEmitter } from "../interfaces/IHasEmitter";
import { IGameObject } from "../interfaces/IGameObject";
import { Container } from "pixi.js";
import { Manager } from "../Manager";
import emitterSettings from "./../../assets/json/explosionEmitter.json";
import { World } from "../scenes/World";

export class Explosion extends Container implements IGameObject, IHasEmitter {
    public tags: Array<string> = ['explosion'];
    public emitter: Emitter;

    private config: EmitterConfigV1;
    private startTime: number = Date.now();
    private spawnTime: number;
    private duration: number;
    private spawning: boolean = true;
    private active: boolean = true;

    constructor(x: number, y: number, spawnTime: number = 250, duration: number = emitterSettings.lifetime.max, emitter: {}|EmitterConfigV1 = {}) {
        super();

        this.spawnTime = spawnTime;
        this.duration = duration;

        const particleTexture = Manager.getTexture('particles.exhaust');

        this.config = {
            ...emitterSettings,
            ...emitter
        }

        this.emitter = new Emitter(Manager.scene.particles, upgradeConfig(this.config, [particleTexture]));
        this.emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
        this.emitter.updateSpawnPos(x, y);
        this.emitter.emit = true;
        
        (<World>Manager.scene).objects.push(this);
    }

    public update() {
        if(Date.now() - this.startTime > this.spawnTime) {
            this.spawning = false;
        }

        if(Date.now() - this.startTime > this.duration) {
            if(this.active) this.remove();
            this.active = false;
        }

        if(!this.spawning) {
            this.emitter.emit = false;
        }
    }

    public pauseEmitter(value: boolean){
        this.emitter.autoUpdate = !value;
    }

    private remove() {
        setTimeout(() => {
            const index = Manager.scene.objects.indexOf(this);
            Manager.scene.objects.splice(index, 1);

            this.emitter.destroy();
        }, this.config.lifetime.max * 1000);
    }
}