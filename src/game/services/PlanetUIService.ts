import { Ref, ref } from "vue";
import { PlanetCargoInventory } from "../interfaces/PlanetConfig";
import { Manager } from "../Manager";
import { Planet } from "../objects/Planet";

class PlanetUIService {
    public planet: Planet|null = null;
    public shown: Ref<boolean> = ref(false);

    public cargoInventory: Ref<PlanetCargoInventory> = ref({
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
        this.planet = planet;
        this.cargoInventory.value = planet.cargoInventory;
        this.shown.value = true;
    }

    hide(){
        this.shown.value = false;
    }

    takeOff(){
        Manager.scene.player?.takeOff();
    }
}

export default new PlanetUIService();