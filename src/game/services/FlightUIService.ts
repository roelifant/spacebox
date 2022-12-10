import { Ref, ref } from "vue";

import Inventory from "../interfaces/Inventory";

class FlightUIService {
    public canLand: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 300.00,
        maxFuel: 300,
        money: 1000
    })
}

export default new FlightUIService();