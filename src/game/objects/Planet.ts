import { Sprite } from "pixi.js";
import { Cargo } from "../enums/Cargo";
import { IGameObject } from "../interfaces/IGameObject";
import PlanetConfig, { CargoProduct, PlanetCargoInventory } from "../interfaces/PlanetConfig";
import { Manager } from "../Manager";

export class Planet extends Sprite implements IGameObject {

    public tags: Array<string> = ['planet'];

    public name: string;
    public info: string;

    public needs: Array<Cargo>;
    public products: Array<CargoProduct>;

    public cargoInventory: PlanetCargoInventory = {
        matter: 0,
        water: 0,
        flora: 0,
        mineral: 0,
        fauna: 0,
        fungi: 0,
        energy: 0,
        technology: 0,
        weaponry: 0,
        wisdom: 0,
    };

    constructor(config: PlanetConfig){
        super();
        this.texture = Manager.getTexture(config.asset);
        this.anchor.set(0.5, 0.5);

        this.scale.set(1,1);

        this.x = config.x;
        this.y = config.y;

        this.needs = config.needs;
        this.products = config.products;

        this.products.forEach(product => {
            this.cargoInventory[product.type as keyof PlanetCargoInventory] = product.max;
        });

        this.name = config.name;
        this.info = config.info;
    }

    update() {
        
    }
}