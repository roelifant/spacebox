import { Cargo } from "../enums/Cargo";

export interface CargoProduct {
    type: Cargo,
    max: number
}

export interface PlanetCargoInventory {
    matter: number,
    water: number,
    flora: number,
    mineral: number,
    fauna: number,
    fungi: number,
    energy: number,
    technology: number,
    weaponry: number,
    wisdom: number,
}

export default interface PlanetConfig {
    asset: string,
    x: number,
    y: number,
    needs: Array<Cargo>,
    products: Array<CargoProduct>,
    name: string,
    info: string
}