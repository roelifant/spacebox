import { Ref, ref } from "vue";

import Inventory from "../interfaces/Inventory";

class GameStateService {
    public canLand: Ref<boolean> = ref(false);
    public landed: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 400.00,
        maxFuel: 400,
        money: 300
    });

    public gameOver: Ref<boolean> = ref(false);
    public gameOverMessage: Ref<string> = ref('');

    gainFuel(amount: number){
        this.inventory.value.fuel += amount;
        if(this.inventory.value.fuel > this.inventory.value.maxFuel) this.inventory.value.fuel = this.inventory.value.maxFuel;
    }
}

export default new GameStateService();