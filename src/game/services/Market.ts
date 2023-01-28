import { Cargo } from "../enums/Cargo";
import { Planet } from "../objects/Planet";
import GameStateService from "./GameStateService";
import Inventory from "../interfaces/Inventory";

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
}

export default new Market();