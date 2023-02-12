import { Cargo } from "../enums/Cargo";
import GameStateService from "./GameStateService";
import Inventory from "../interfaces/Inventory";
import PlanetUIService from "./PlanetUIService";
import { World } from "../scenes/World";
import { Manager } from "../Manager";

class Market {

    public low: Cargo;
    public high: Cargo;

    private cycles: number = 0;

    constructor(){
        this.low = Cargo.Water;
        this.high = Cargo.Energy;
    }

    init(){

        GameStateService.updateMarketState(this.low, this.high);

        const world = <World>Manager.scene;

        world.scheduler.set(() => {
            this.cycle();
        }, 60);
    }

    getBasePrice(cargo: Cargo) {
        switch (cargo) {
            case Cargo.Matter:
                return 80;
            case Cargo.Minerals:
            case Cargo.Fauna:
            case Cargo.Fungi:
            case Cargo.Energy:
                return 110;
            case Cargo.Weaponry:
            case Cargo.Wisdom:
            case Cargo.Technology:
                return 120;
            default:
                return 100;
        }
    }

    getSellingPrice(cargo: Cargo){
        let price: number = this.getBasePrice(cargo);

        if(cargo === this.low){
            price -= 15;
        }

        if(cargo === this.high){
            price += 10;
        }

        // tweak price according to planet demands & needs here
        if(PlanetUIService.planet){

            if(PlanetUIService.planet.needs.includes(cargo)){
                switch (cargo) {
                    case Cargo.Minerals:
                    case Cargo.Fauna:
                    case Cargo.Fungi:
                    case Cargo.Energy:
                        price += 15;
                        break;
                    case Cargo.Weaponry:
                    case Cargo.Wisdom:
                    case Cargo.Technology:
                        price += 20;
                        break;
                    default:
                        price += 10;
                        break;
                }
            }

            if(this.cargoInPlanetProducts(cargo)){
                switch (cargo) {
                    case Cargo.Minerals:
                    case Cargo.Fauna:
                    case Cargo.Fungi:
                    case Cargo.Energy:
                        price -= 15;
                        break;
                    case Cargo.Weaponry:
                    case Cargo.Wisdom:
                    case Cargo.Technology:
                        price -= 10;
                        break;
                    default:
                        price -= 20;
                        break;
                }
            }
        }

        return price;
    }

    getBuyingPrice(cargo: Cargo){
        let price: number = this.getBasePrice(cargo);

        if(cargo === this.low){
            price -= 15;
        }

        if(cargo === this.high){
            price += 10;
        }

        return price;
    }

    private cargoInPlanetProducts(cargo: Cargo) {
        let inProducts = false;
        if(PlanetUIService.planet){
            PlanetUIService.planet.products.forEach(product => {
                if(product.type === cargo){
                    inProducts = true;
                }
            });
        }
        return inProducts;
    }

    canBuy(cargo: Cargo) {

        // check if we have the needed upgrades
        if(Cargo.Minerals == cargo && !GameStateService.hasUpgrade('cargo_minerals')) return false;
        if(Cargo.Fauna == cargo && !GameStateService.hasUpgrade('cargo_fauna')) return false;
        if(Cargo.Fungi == cargo && !GameStateService.hasUpgrade('cargo_fungi')) return false;
        if(Cargo.Energy == cargo && !GameStateService.hasUpgrade('cargo_energy')) return false;
        if(Cargo.Wisdom == cargo && !GameStateService.hasUpgrade('cargo_wisdom')) return false;
        if(Cargo.Weaponry == cargo && !GameStateService.hasUpgrade('cargo_weaponry')) return false;
        if(Cargo.Technology == cargo && !GameStateService.hasUpgrade('cargo_technology')) return false;

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

        if(PlanetUIService.planet && PlanetUIService.cargoInventory.value && this.cargoInPlanetProducts(cargo)) {
            PlanetUIService.cargoInventory.value[cargo]++;
        }
    }

    buy(cargo: Cargo){
        if(!this.canBuy(cargo)) return;

        GameStateService.inventory.value.money -= this.getBuyingPrice(cargo);
        GameStateService.inventory.value[cargo as keyof Inventory]++;
        if(PlanetUIService.planet && PlanetUIService.cargoInventory.value){
            PlanetUIService.cargoInventory.value[cargo]--;
        }
    }

    cycle(){
        const world = <World>Manager.scene;
        const options = Object.values(Cargo);

        let newCargo: Cargo = Cargo.Matter;
        let chosen = false;
        while(chosen === false){
            newCargo = options[Math.floor(Math.random() * options.length)];
            if(newCargo === this.low || newCargo === this.high) continue;
            chosen = true;
        }

        this.cycles++;

        if(this.cycles % 2 === 0){
            this.low = newCargo;
        } else {
            this.high = newCargo;
        }

        console.log('market:');
        console.table({
            low: this.low,
            high: this.high
        });
        const seconds = (Math.floor(Math.random() * 10) + 5) * 15;
        console.log('New cycle in '+seconds+' seconds');

        GameStateService.updateMarketState(this.low, this.high);

        world.scheduler.set(() => {
            this.cycle();
        }, seconds);
    }
}

export default new Market();