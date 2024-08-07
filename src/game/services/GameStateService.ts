import { computed, ComputedRef, Ref, ref } from "vue";
import { Cargo } from "../enums/Cargo";

import Inventory from "../interfaces/Inventory";
import { Manager } from "../Manager";
import { Upgrade } from "../objects/Upgrade";
import { World } from "../scenes/World";
import { Vector } from "../utils/Vector";
import { IHeadingOption } from "../interfaces/IHeadingOption";

class GameStateService {
    public canLand: Ref<boolean> = ref(false);
    public landed: Ref<boolean> = ref(false);
    public shipDestroyed: Ref<boolean> = ref(false);
    public inventory: Ref<Inventory> = ref({
        fuel: 500.00,
        maxFuel: 500,
        money: 500,
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
        hull: 4,
        maxHull: 4,
        ammo: 30,
        maxAmmo: 30
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
    public showPauseMenu: Ref<boolean> = ref(false);

    public marketHigh: Ref<Cargo> = ref(Cargo.Matter);
    public marketLow: Ref<Cargo> = ref(Cargo.Energy);

    public miningProgress: Ref<number> = ref(0);
    public miningProgressLimit: Ref<number> = ref(1000);

    public minedMatter: Ref<number> = ref(0);
    public minedMatterLimit: Ref<number> = ref(3);
    public minedWater: Ref<number> = ref(0);
    public minedWaterLimit: Ref<number> = ref(3);
    public minedMinerals: Ref<number> = ref(0);
    public minedMineralsLimit: Ref<number> = ref(3);

    public gainedMatterChunk: Ref<boolean> = ref(false);
    public gainedWaterChunk: Ref<boolean> = ref(false);
    public gainedMineralsChunk: Ref<boolean> = ref(false);

    public upgrades: Ref<Array<Upgrade>> = ref([]);

    public headings: Array<IHeadingOption> = [];
    public chosenHeading: Ref<number> = ref(0);
    public headingText: Ref<string> = ref('');
    public headingPosition: Ref<Vector> = ref(new Vector(0,0))
    public multipleHeadingOptions: Ref<boolean> = ref(false);

    public moneyPopAnimation: Ref<boolean> = ref(false);
    public minedChunksMessage: Ref<null|string> = ref(null);
    public gainedMatter: Ref<boolean> = ref(false);
    public gainedWater: Ref<boolean> = ref(false);
    public gainedMinerals: Ref<boolean> = ref(false);

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

    gainAmmo(amount: number){
        this.inventory.value.ammo += amount;
        if(this.inventory.value.ammo > this.inventory.value.maxAmmo) this.inventory.value.ammo = this.inventory.value.maxAmmo;
    }

    updateMarketState(low: Cargo, high: Cargo) {
        this.marketLow.value = low;
        this.marketHigh.value = high;
    }

    respawn(){
        this.shipDestroyed.value = false;

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
        this.inventory.value.hull = this.inventory.value.maxHull;

        this.inventory.value.ammo = Math.ceil(this.inventory.value.ammo / 10) * 10;
        if(this.inventory.value.ammo === 0) this.inventory.value.ammo = 10;

        this.minedMatter.value = 0;
        this.minedWater.value = 0;
        this.minedMinerals.value = 0;

        const world = <World>Manager.scene;

        world.player.exploded = false;

        if(world.player && world.player.respawnPoint){
            world.player.teleport(world.player.respawnPoint.x, world.player.respawnPoint.y, false);
        }

        this.gameOver.value = false;

        // continue NPC emitters
        world.freezeEmitters(false);

        Manager.continueScene();
    }

    updateHeadings(): void {
        const world = <World>Manager.scene;
        const player = world.player;
        const radar = player.radar;

        if(!radar) return;

        const positionVector = new Vector(player.position.x, player.position.y);

        this.headings = world.planets
        .filter(planet => planet.discovered)
        .map(planet => {
            const planetVector = planet.parallaxPosition;
            let distance = positionVector.distance(planetVector) - 500;
            if(distance < 0) distance = 0;

            return {
                distance: Math.floor(distance),
                name: planet.name,
                object: planet
            }
        });

        if(this.headings.length > 1) this.multipleHeadingOptions.value = true;

        let index = this.chosenHeading.value;
        if(index > this.headings.length - 1) {
            this.chosenHeading.value = 0;
            index = 0;
        }
        if(index < 0) {
            index = this.headings.length - 1;
        }

        const heading = this.headings[index];
        let distanceString = ' ('+(Math.floor(heading.distance)/1000).toFixed(2)+' pc)';
        if(heading.distance === 0) {
            distanceString = '';
            radar.show = false;
        } else {
            radar.show = true;
        }
        this.headingPosition.value = heading.object.parallaxPosition;
        this.headingText.value = heading.name+distanceString;

        radar.position.set(player.position.x, player.position.y);
    }
}

export default new GameStateService();