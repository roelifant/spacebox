import { Ref, ref } from "vue";

import Inventory from "../interfaces/Inventory";
import { Planet } from "../objects/Planet";

class GameStateService {
    public canLand: Ref<boolean> = ref(false);
    public landed: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 750.00,
        maxFuel: 750,
        money: 300,
        matter: 0
    });

    public planet: Ref<Planet|null> = ref(null);

    public gameOver: Ref<boolean> = ref(false);
    public gameOverMessage: Ref<string> = ref('');

    public miningProgress: Ref<number> = ref(0);
    public miningProgressLimit: Ref<number> = ref(1000);

    public minedMatter: Ref<number> = ref(0);
    public minedMatterLimit: Ref<number> = ref(3);

    gainFuel(amount: number){
        this.inventory.value.fuel += amount;
        if(this.inventory.value.fuel > this.inventory.value.maxFuel) this.inventory.value.fuel = this.inventory.value.maxFuel;
    }
}

export default new GameStateService();