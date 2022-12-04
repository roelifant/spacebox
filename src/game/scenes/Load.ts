import {Container, Loader, ParticleContainer} from "pixi.js";
import {IScene} from "../interfaces/IScene";
import {assets} from "../assets";
import {Manager} from "../Manager";
import {World} from "./World";
import {IGameObject} from "../interfaces/IGameObject";
import LoadUI from '../services/LoadUIService';

export class Load extends Container implements IScene {

    public objects: Array<IGameObject> = [];
    public particles: ParticleContainer = new ParticleContainer();
    public groups: Map<string, Container> = new Map<string, Container>();

    constructor(){
        super();

        Loader.shared.add(assets);
        Loader.shared.load();
        console.log('loading assets');
        Loader.shared.onProgress.add(this.loading, this);
        Loader.shared.onComplete.once(this.loaded, this);
    }

    private loading(loader: Loader) {
        let percent = Math.ceil(loader.progress);
        console.log(percent);
        LoadUI.progress.value = percent;
    }

    private loaded(){
        console.log('loading complete');
        Manager.changeScene(new World());
    }

    public update(){
        // nothing
    }

    public resize(width: number, height: number){
        console.log('resizing '+width+' - '+height);
    }

    public onDestroy() {
        // nothing to destroy
    }
}
