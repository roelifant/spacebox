import { Cargo } from "../enums/Cargo";
import Inventory from "./Inventory";


export interface PlanetSaveData {
    name: string,
    // cargo
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
    lastVisitedPlanetName: string,
    progress: number,
    market: MarketSaveData,
    enemies: number
    // asteroids
}