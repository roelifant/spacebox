import { computed, ComputedRef, Ref, ref } from "vue";
import { Cargo } from "../enums/Cargo";

import Inventory from "../interfaces/Inventory";
import { Manager } from "../Manager";
import { Upgrade } from "../objects/Upgrade";
import { World } from "../scenes/World";
import { Vector } from "../utils/Vector";

class GameStateService {
    public canLand: Ref<boolean> = ref(false);
    public landed: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 500.00,
        maxFuel: 500,
        money: 300,
        matter: 3,
        water: 2,
        flora: 1,
        minerals: 0,
        fauna: 0,
        fungi: 0,
        energy: 0,
        wisdom: 0,
        weaponry: 0,
        technology: 0,
        maxCargo: 10,
    });

    public totalCargo: ComputedRef<number> = computed(() => {
        let result = 0;
        result += this.inventory.value.matter;
        result += this.inventory.value.water;
        result += this.inventory.value.flora;
        result += this.inventory.value.minerals;
        result += this.inventory.value.fauna;
        result += this.inventory.value.fungi;
        result += this.inventory.value.energy;
        result += this.inventory.value.wisdom;
        result += this.inventory.value.weaponry;
        result += this.inventory.value.technology;
        return result;
    });

    public gameOver: Ref<boolean> = ref(false);
    public gameOverMessage: Ref<string> = ref('');

    public marketHigh: Ref<Cargo> = ref(Cargo.Matter);
    public marketLow: Ref<Cargo> = ref(Cargo.Energy);

    public miningProgress: Ref<number> = ref(0);
    public miningProgressLimit: Ref<number> = ref(1000);

    public minedMatter: Ref<number> = ref(0);
    public minedMatterLimit: Ref<number> = ref(3);

    public upgrades: Ref<Array<Upgrade>> = ref([]);

    public chosenHeading: Ref<number> = ref(0);
    public headingText: Ref<string> = ref('');
    public headingPosition: Ref<Vector> = ref(new Vector(0,0))
    public multipleHeadingOptions: Ref<boolean> = ref(false);

    public upgradePercent: ComputedRef<number> = computed(() => {
        const total = this.upgrades.value.length;
        const active = this.upgrades.value.filter(x => x.active).length;

        return Math.floor((active / total) * 100);
    })

    getActiveUpgrades(key: string){
        return [...this.upgrades.value].filter(upgrade => upgrade.active && upgrade.key === key);
    }

    hasUpgrade(key: string){
        return !!this.upgrades.value.find(upgrade => upgrade.active && upgrade.key === key);
    }

    gainFuel(amount: number){
        this.inventory.value.fuel += amount;
        if(this.inventory.value.fuel > this.inventory.value.maxFuel) this.inventory.value.fuel = this.inventory.value.maxFuel;
    }

    updateMarketState(low: Cargo, high: Cargo) {
        this.marketLow.value = low;
        this.marketHigh.value = high;
    }

    respawn(){
        this.inventory.value.matter = 0;
        this.inventory.value.water = 0;
        this.inventory.value.flora = 0;
        this.inventory.value.minerals = 0;
        this.inventory.value.fungi = 0;
        this.inventory.value.fauna = 0;
        this.inventory.value.energy = 0;
        this.inventory.value.wisdom = 0;
        this.inventory.value.weaponry = 0;
        this.inventory.value.technology = 0;

        this.inventory.value.fuel = this.inventory.value.maxFuel;

        this.minedMatter.value = 0;

        const world = <World>Manager.scene;

        if(world.player && world.player.respawnPoint){
            world.player.teleport(world.player.respawnPoint.x, world.player.respawnPoint.y, false);
        }

        this.gameOver.value = false;
        Manager.continueScene();
    }
}

export default new GameStateService();