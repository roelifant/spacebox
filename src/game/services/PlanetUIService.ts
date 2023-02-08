import { Ref, ref } from "vue";
import { PlanetCargoInventory } from "../interfaces/PlanetConfig";
import { Manager } from "../Manager";
import { Planet } from "../objects/Planet";

class PlanetUIService {
    public planet: Planet|null = null;
    public shown: Ref<boolean> = ref(false);

    public cargoInventory: Ref<PlanetCargoInventory|null> = ref({
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
    })

    show(planet: Planet){
        this.cargoInventory.value = null;

        this.planet = planet;
        this.updateCargo();
        this.shown.value = true;
    }

    updateCargo(){
        if(this.planet){
            this.cargoInventory.value = this.planet.cargoInventory;
        }
    }

    hide(){
        this.shown.value = false;
    }

    takeOff(){
        Manager.scene.player?.takeOff();
    }
}

export default new PlanetUIService();