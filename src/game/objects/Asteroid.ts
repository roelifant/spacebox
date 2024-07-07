import { Sprite } from "pixi.js";
import { IGameObject } from "../interfaces/IGameObject";
import { Manager } from "../Manager";
import GameStateService from "../services/GameStateService";
import { World } from "../scenes/World";
import { AsteroidField } from "./AsteroidField";

export class Asteroid extends Sprite implements IGameObject {

    public tags: Array<string> = ['asteroid'];

    private assets: Array<string> = [
        'asteroid.1',
        'asteroid.2',
        'asteroid.3',
        'asteroid.4',
        'asteroid.5'
    ];

    private tints: Array<number> = [
        0xffffff,
        0xf5f5f5,
        0xededed,
        0xdedede,
        0xcfcfcf,
        0xbababa,
        0xadadad,
        0xa3a3a3,
        0x8a8a8a,
        0x7a7a7a
    ];

    private spinDirection: boolean;
    private spinSpeed: number;
    
    private field: AsteroidField|null;

    constructor(x: number, y: number, field: AsteroidField|null = null){
        super();

        this.field = field;

        this.texture = Manager.getTexture(this.assets[Math.floor(Math.random()*this.assets.length)]);
        this.tint = this.tints[Math.floor(Math.random()*this.tints.length)];
        
        this.anchor.set(0.5, 0.5);

        let flipX = 1;
        if(Math.random() < .5){
            flipX = -1;
        }
        let flipY = 1;
        if(Math.random() < .5){
            flipY = -1;
        }
        this.scale.set(.3 * flipX,.3 * flipY);

        this.x = x;
        this.y = y;

        this.spinDirection = false;
        if(Math.random() < .5){
            this.spinDirection = true;
        }
        this.spinSpeed = (1+Math.random()) / 100;
        this.angle = Math.floor(360 * Math.random());

        Manager.scene?.groups.get('asteroids')?.addChild(this);

        const world = <World>Manager.scene;
        world.objects.push(this);
    }

    update(){
        if(this.spinDirection){
            this.angle -= (Manager.time * this.spinSpeed);
        } else {
            this.angle += (Manager.time * this.spinSpeed);
        }
    }

    mine(){
        GameStateService.minedMatter.value++;
        if(GameStateService.minedMatter.value >= GameStateService.minedMatterLimit.value){
            GameStateService.minedMatter.value = 0;
            GameStateService.inventory.value.matter++;
        }

        console.log('You mined an asteroid!');

        let minedWater = false;
        let minedMinerals = false;

        if(GameStateService.hasUpgrade('ice_mining')) {
            let chance = .33;
            if(GameStateService.hasUpgrade('ice_mining_2')) {
                chance = .66;
            }

            if(Math.random() <= chance) {
                GameStateService.minedWater.value++;
                if(GameStateService.minedWater.value >= GameStateService.minedWaterLimit.value){
                    GameStateService.minedWater.value = 0;
                    GameStateService.inventory.value.water++;
                }

                minedWater = true;
            }
        }

        if(GameStateService.hasUpgrade('cargo_minerals') && GameStateService.hasUpgrade('mineral_mining')) {
            let chance = .25;
            if(GameStateService.hasUpgrade('mineral_mining_2')) {
                chance = .50;
            }

            if(Math.random() <= chance) {
                GameStateService.minedMinerals.value++;
                if(GameStateService.minedMinerals.value >= GameStateService.minedMineralsLimit.value){
                    GameStateService.minedMinerals.value = 0;
                    GameStateService.inventory.value.minerals++;
                }

                minedMinerals = true;
            }
        }

        let message = 'You mined 1 matter chunk';
        if(minedWater) {
            message = 'You mined 1 matter and 1 ice chunk'
        }
        if(minedMinerals) {
            message = 'You mined 1 matter and 1 minerals chunk'
        }
        if(minedWater && minedMinerals) {
            message = 'You mined 1 matter, 1 ice and 1 minerals chunk'
        }
        GameStateService.minedChunksMessage.value = message;
        setTimeout(() => GameStateService.minedChunksMessage.value = null, 1500);

        if(this.field){
            this.field.removeAsteroid(this);
        }

        Manager.remove(this, 'asteroids');
    }
}