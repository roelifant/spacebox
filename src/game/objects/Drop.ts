import { Sprite } from "pixi.js";
import { IGameObject } from "../interfaces/IGameObject";
import { Manager } from "../Manager";
import { World } from "../scenes/World";
import GameStateService from "../services/GameStateService";

enum DropType {
    Ammo,
    Fuel,
    Money
}

export class Drop extends Sprite implements IGameObject {
    public tags: Array<string> = ['drop'];

    private spinDirection: boolean;
    private spinSpeed: number;
    private type: DropType;

    constructor(x: number, y: number) {
        super();

        let texture = 'drop.money';
        const random = Math.random();
        if(random < .33) {
            this.type = DropType.Ammo;
            texture = 'drop.ammo';
        } else if(random < .66) {
            this.type = DropType.Fuel;
            texture = 'drop.fuel';
        } else {
            this.type = DropType.Money;
        }

        this.texture = Manager.getTexture(texture);
        this.anchor.set(0.5, 0.5);

        this.spinDirection = false;
        if(Math.random() < .5){
            this.spinDirection = true;
        }
        this.spinSpeed = (1+Math.random()) / 100;
        this.angle = Math.floor(360 * Math.random());

        Manager.scene?.groups.get('drops')?.addChild(this);

        const world = <World>Manager.scene;
        world.objects.push(this);

        this.scale.set(.3, .3);

        this.x = x;
        this.y = y;
    }

    update() {
        if(this.spinDirection){
            this.angle -= (Manager.time * this.spinSpeed);
        } else {
            this.angle += (Manager.time * this.spinSpeed);
        }
    }

    collect() {
        if(this.type === DropType.Ammo) {
            const num = Math.ceil(Math.random() * 4);
            GameStateService.gainAmmo(num*5);
        }

        if(this.type === DropType.Fuel) {
            const num = Math.ceil(Math.random() * 3) + 1;
            GameStateService.gainFuel(num*50);
        }

        if(this.type === DropType.Money) {
            const num = Math.ceil(Math.random() * 5) + 3;
            GameStateService.inventory.value.money += (num*5);
        }

        Manager.remove(this, 'drops');
    }
}