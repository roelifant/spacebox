import { Cargo } from "../enums/Cargo";
import GameStateService from "./GameStateService";
import Inventory from "../interfaces/Inventory";
import { Player } from "../objects/Player";
import { Manager } from "../Manager";
import PlanetUIService from "./PlanetUIService";
import { PlanetCargoInventory } from "../interfaces/PlanetConfig";

class Market {
    public low: Cargo;
    public high: Cargo;

    constructor(){
        this.low = Cargo.Matter;
        this.high = Cargo.Energy;
    }

    getSellingPrice(cargo: Cargo){
        let price: number;
        // base price
        switch (cargo) {
            case Cargo.Matter:
                price = 80;
                break;
            default:
                price = 100;
                break;
        }

        if(cargo === this.low){
            price -= 15;
        }

        if(cargo === this.high){
            price += 10;
        }

        // TODO: tweak price according to planet demands & needs here

        return price;
    }

    getBuyingPrice(cargo: Cargo){
        let price: number = 100;

        if(cargo === this.low){
            price -= 15;
        }

        if(cargo === this.high){
            price += 10;
        }

        // TODO: tweak price according to planet demands & needs here

        return price;
    }

    canBuy(cargo: Cargo) {
        return this.getBuyingPrice(cargo) <= GameStateService.inventory.value.money;
    }

    sell(cargo: Cargo){
        const price: number = this.getSellingPrice(cargo);

        const inventoryKey = cargo as keyof Inventory;
        
        if(GameStateService.inventory.value[inventoryKey] <= 0){
            console.log('not enough '+inventoryKey);
            return;
        }

        GameStateService.inventory.value[inventoryKey]--;
        GameStateService.inventory.value.money += price;
    }

    buy(cargo: Cargo){
        if(!this.canBuy(cargo)) return;

        GameStateService.inventory.value.money -= this.getBuyingPrice(cargo);
        GameStateService.inventory.value[cargo as keyof Inventory]++;
        if(PlanetUIService.planet){
            PlanetUIService.planet.cargoInventory[cargo as keyof PlanetCargoInventory]--;
            PlanetUIService.cargoInventory.value[cargo]--;
        }
    }
}

export default new Market();