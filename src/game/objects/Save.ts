import { Cargo } from "../enums/Cargo";
import { SaveData } from "../interfaces/SaveData";
import { Manager } from "../Manager";
import { World } from "../scenes/World";
import GameStateService from "../services/GameStateService";

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

        const planets = world.planets.map(p => ({name: p.name}));

        const minedChunks = {
            [Cargo.Matter]: GameStateService.minedMatter.value,
            [Cargo.Water]: GameStateService.minedWater.value,
            [Cargo.Minerals]: GameStateService.minedMinerals.value,
        }

        const lastPlanet = world.player.latestPlanet?.name ?? this.data?.lastVisitedPlanetName ?? 'Humble';

        const enemyCount = world.objects.filter(o => o.tags.includes('enemy')).length;

        const save: SaveData = {
            upgrades,
            planets,
            inventory: GameStateService.inventory.value,
            minedChunks,
            lastVisitedPlanetName: lastPlanet,
            progress: GameStateService.upgradePercent.value,
            market: {},
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

        // inventory
        GameStateService.inventory.value = this.data.inventory;

        // mined chunks
        GameStateService.minedMatter.value = this.data.minedChunks[Cargo.Matter];
        GameStateService.minedWater.value = this.data.minedChunks[Cargo.Water];
        GameStateService.minedMinerals.value = this.data.minedChunks[Cargo.Minerals];

        // last visited planet (position)
        const planet = world.planets.find(p => p.name === this.data!.lastVisitedPlanetName);
        // TO DO: fix position
        world.player.teleport(planet!.parallaxPosition.x, planet!.parallaxPosition.y, false);

        // market

        // enemies

        console.log('loaded save from '+this.name);
    }
}