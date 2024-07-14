import { Cargo } from "../enums/Cargo";
import Inventory from "./Inventory";
import { IPoint } from "./IPoint";
import { PlanetCargoInventory } from "./PlanetConfig";


export interface PlanetSaveData {
    name: string,
    discovered: boolean,
    cargo: PlanetCargoInventory
}

export interface MinedChunksSaveData {
    [Cargo.Matter]: number,
    [Cargo.Water]: number,
    [Cargo.Minerals]: number,
}

export interface MarketSaveData {
    low: Cargo,
    high: Cargo,
    cycles: number,
}

export interface SaveData {
    upgrades: Array<string>,
    planets: Array<PlanetSaveData>,
    inventory: Inventory,
    minedChunks: MinedChunksSaveData,
    spawnPoint: IPoint,
    progress: number,
    market: MarketSaveData,
    enemies: number
    // asteroids
}