import { Ref, ref } from "vue";
import { Manager } from "../Manager";
import { Planet } from "../objects/Planet";

class PlanetUIService {
    public planet: Planet|null = null;
    public shown: Ref<boolean> = ref(false);

    show(planet: Planet){
        console.log(this.planet);
        console.log(this.shown.value);
        this.planet = planet;
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