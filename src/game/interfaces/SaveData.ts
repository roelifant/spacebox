import { Cargo } from "../enums/Cargo";
import Inventory from "./Inventory";
import { IPoint } from "./IPoint";


export interface PlanetSaveData {
    name: string,
    discovered: boolean,
}

export interface MinedChunksSaveData {
    [Cargo.Matter]: number,
    [Cargo.Water]: number,
    [Cargo.Minerals]: number,
}

export interface MarketSaveData {

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