import { Sprite } from "pixi.js";
import { IGameObject } from "../interfaces/IGameObject";
import { Manager } from "../Manager";
import GameStateService from "../services/GameStateService";

export class Asteroid extends Sprite implements IGameObject {

    public tags: Array<string> = ['asteroid'];

    private assets: Array<string> = [
        'asteroid.1',
        'asteroid.2',
        'asteroid.3',
        'asteroid.4',
        'asteroid.5'
    ];

    private spinDirection: boolean;
    private spinSpeed: number;

    constructor(x: number, y: number){
        super();

        this.texture = Manager.getTexture(this.assets[Math.floor(Math.random()*this.assets.length)]);
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
        Manager.remove(this, 'asteroids');

        
    }
}