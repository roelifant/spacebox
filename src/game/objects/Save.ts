import { Cargo } from "../enums/Cargo";
import { SaveData } from "../interfaces/SaveData";
import { Manager } from "../Manager";
import { World } from "../scenes/World";
import GameStateService from "../services/GameStateService";
import Market from "../services/Market";

export class Save {
    public name: string;
    public data: SaveData|null = null;

    constructor(name: string) {
        this.name = name;
        const data = window.localStorage.getItem(name);
        if(!!data) {
            this.data = <SaveData>JSON.parse(data);
        }
    }

    public save() {
        const world = <World>Manager.scene;
        const upgrades = GameStateService.upgrades.value
            .filter(x => x.active)
            .map(x => x.key);

        const planets = world.planets.map(p => ({
            name: p.name,
            discovered: p.discovered,
            cargo: p.cargoInventory
        }));

        const minedChunks = {
            [Cargo.Matter]: GameStateService.minedMatter.value,
            [Cargo.Water]: GameStateService.minedWater.value,
            [Cargo.Minerals]: GameStateService.minedMinerals.value,
        }

        const enemyCount = world.objects.filter(o => o.tags.includes('enemy')).length;

        const spawnPoint = world.player.respawnPoint?.toPoint() ?? {x: 0, y: 0};

        const marketData = {
            low: Market.low,
            high: Market.high,
            cycles: Market.cycles
        }

        const save: SaveData = {
            upgrades,
            planets,
            inventory: GameStateService.inventory.value,
            minedChunks,
            spawnPoint,
            progress: GameStateService.upgradePercent.value,
            market: marketData,
            enemies: enemyCount
        }

        window.localStorage.setItem(this.name, JSON.stringify(save));

        console.log('progress saved on '+this.name);
    }

    public load() {
        const world = <World>Manager.scene;

        if(!this.data) {
            throw new Error('No save data to load...');
        }

        // upgrades
        GameStateService.upgrades.value.forEach(upgrade => {
            if(this.data!.upgrades.includes(upgrade.key)) {
                upgrade.active = true;
            }
        });

        // planets
        this.data.planets.forEach(planetSave => {
            const planet = world.planets.find(p => p.name === planetSave.name);
            if(!planet) return;
            planet.discovered = planetSave.discovered;
            planet.cargoInventory = planetSave.cargo;
        });

        // inventory
        GameStateService.inventory.value = this.data.inventory;

        // mined chunks
        GameStateService.minedMatter.value = this.data.minedChunks[Cargo.Matter];
        GameStateService.minedWater.value = this.data.minedChunks[Cargo.Water];
        GameStateService.minedMinerals.value = this.data.minedChunks[Cargo.Minerals];

        // last visited planet (position)
        world.player.teleport(this.data.spawnPoint.x, this.data.spawnPoint.y, false);

        console.log(this.data.market);

        // market
        Market.low = this.data.market.low;
        Market.high = this.data.market.high;
        Market.cycles = this.data.market.cycles;
        GameStateService.updateMarketState(Market.low, Market.high);

        // enemies

        // asteroids

        console.log('loaded save from '+this.name);
    }
}