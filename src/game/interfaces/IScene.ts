import {DisplayObject, ParticleContainer, Container} from "pixi.js";
import { Player } from "../objects/Player";
import {IGameObject} from "./IGameObject";

export interface IScene extends DisplayObject {

    update(): void;
    resize(screenWidth: number, screenHeight: number): void;
    addChild(child: any): void;
    onDestroy(): void;

    objects: Array<IGameObject>;
    particles: ParticleContainer;
    groups: Map<string, Container>
    
    paused?: boolean;
    player?: Player;
}
