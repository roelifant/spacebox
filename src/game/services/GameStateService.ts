import { Ref, ref } from "vue";

import Inventory from "../interfaces/Inventory";
import { Manager } from "../Manager";
import { World } from "../scenes/World";

class GameStateService {
    public canLand: Ref<boolean> = ref(false);
    public landed: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 750.00,
        maxFuel: 750,
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
    });

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

        const world = <World>Manager.scene;

        if(world.player && world.player.respawnPoint){

            world.player.teleport(world.player.respawnPoint.x, world.player.respawnPoint.y, false);
            
        }

        this.gameOver.value = false;
        Manager.continueScene();
    }
}

export default new GameStateService();