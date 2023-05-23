import { Sprite } from "pixi.js";
import { Cargo } from "../enums/Cargo";
import { IGameObject } from "../interfaces/IGameObject";
import PlanetConfig, { CargoProduct, PlanetCargoInventory } from "../interfaces/PlanetConfig";
import { Manager } from "../Manager";
import { World } from "../scenes/World";
import { Upgrade } from "./Upgrade";
import { Vector } from "../utils/Vector";

export class Planet extends Sprite implements IGameObject {

    public tags: Array<string> = ['planet'];

    public name: string;
    public info: string;
    public discovered: boolean = false;

    public needs: Array<Cargo>;
    public products: Array<CargoProduct>;
    public upgrades: Array<Upgrade> = [];

    public cargoInventory: PlanetCargoInventory = {
        matter: 0,
        water: 0,
        flora: 0,
        minerals: 0,
        fauna: 0,
        fungi: 0,
        energy: 0,
        technology: 0,
        weaponry: 0,
        wisdom: 0,
    };

    public get parallaxPosition() {
        const world = <World>Manager.scene;

        return new Vector (
            world.planetGroup.position.x + this.position.x,
            world.planetGroup.position.y + this.position.y,
        );
    }

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

        if(config.upgrades){
            this.upgrades = config.upgrades;
        }

        const world: World = <World>Manager.scene;
        world.scheduler.set(() => {
            this.restock();
        }, 15, true);
    }

    restock() {
        // select random cargo product and update if needed
        const updatedProduct = this.products[Math.floor(Math.random() * this.products.length)];
        const typeKey = updatedProduct.type as keyof PlanetCargoInventory;

        if(this.cargoInventory[typeKey] < updatedProduct.max){
            this.cargoInventory[typeKey]++;
        }

        if(this.cargoInventory[typeKey] > updatedProduct.max){
            this.cargoInventory[typeKey]--;
        }
    }

    update() {
        
    }
}