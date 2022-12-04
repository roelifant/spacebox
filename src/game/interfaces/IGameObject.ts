import {DisplayObject} from "pixi.js";

export interface IGameObject extends DisplayObject{
    update(): void;
    tags: Array<string>;
}
