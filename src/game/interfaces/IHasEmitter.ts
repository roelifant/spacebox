import { Emitter } from "@pixi/particle-emitter";

export interface IHasEmitter {
    emitter: Emitter
    pauseEmitter(value: boolean): void;
}