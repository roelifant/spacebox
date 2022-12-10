import {Container, DisplayObject, ParticleContainer} from "pixi.js";
import {IScene} from "../interfaces/IScene";
import {Manager} from "../Manager";
import {Group} from "tweedle.js";
import {Player} from "../objects/Player";
// import {Background} from "../objects/Background";
import { Planet } from "../objects/Planet";
import {Mouse} from "../Mouse";
import {IGameObject} from "../interfaces/IGameObject";
import {Target} from "../objects/Target";
import { WrappingBackground } from "../objects/WrappingBackground";
import { Keyboard } from "../Keyboard";
import FlightUIService from "../services/FlightUIService";

export class World extends Container implements IScene {

    // private background: Background;
    private stars1: WrappingBackground;
    private stars2: WrappingBackground;
    private stars3: WrappingBackground;
    private stars4: WrappingBackground;

    public player: Player;
    public objects: Array<IGameObject> = [];
    public particles: ParticleContainer;
    public groups: Map<string, Container> = new Map<string, Container>();
    private planetGroup: Container;

    private target: Target;
    private target2: Target;
    private target3: Target;

    public paused: boolean = false;

    constructor(){
        super();
        Manager.setLoadingScene(this);

        console.log('World constructor');

        // background
        // this.background = new Background('sky');
        // this.addChild(this.background);

        // add stars group
        const starsGroup = new Container();
        this.addChild(starsGroup);
        this.groups.set('stars', starsGroup);

        // add planets group
        this.planetGroup = new Container();
        this.addChild(this.planetGroup);
        this.groups.set('planets', this.planetGroup);

        // particles container
        this.particles = new ParticleContainer();
        this.addChild(this.particles);

        // add bullets group
        const bulletsGroup = new Container();
        this.addChild(bulletsGroup);
        this.groups.set('bullets', bulletsGroup);

        // set player
        this.player = new Player('player');
        this.x = Manager.width/2;
        this.y = Manager.height/2;
        this.addChild(this.player);
        
        // this.background.startTracking(this.player);

        // parallax stars
        this.stars1 = new WrappingBackground(Manager.getTexture('stars1'), this.player, .95, .15);
        this.groups.get('stars')?.addChild(this.stars1);
        this.stars2 = new WrappingBackground(Manager.getTexture('stars1'), this.player, .9, .2);
        this.groups.get('stars')?.addChild(this.stars2);
        this.stars3 = new WrappingBackground(Manager.getTexture('stars2'), this.player, .85, .25);
        this.groups.get('stars')?.addChild(this.stars3);
        this.stars4 = new WrappingBackground(Manager.getTexture('stars2'), this.player, .8, .3);
        this.groups.get('stars')?.addChild(this.stars4);

        // planets
        let humble = new Planet('planet.humble', 0, 0);
        this.groups.get('planets')?.addChild(humble);
        this.objects.push(humble);
        this.player.latestPlanet = humble;

        // set interactions
        this.on('pointertap', () => {
            this.player.shoot(Mouse.x, Mouse.y);
        }, this);
        this.interactive = true;

        this.target = new Target();
        this.target.x = 300;
        this.target.y = 300;
        this.addChild(this.target);
        this.objects.push(this.target);

        this.target2 = new Target();
        this.target2.x = 200;
        this.target2.y = 200;
        this.addChild(this.target2);
        this.objects.push(this.target2);

        this.target3 = new Target();
        this.target3.x = 400;
        this.target3.y = 200;
        this.addChild(this.target3);
        this.objects.push(this.target3);

        /** keyboard events */
        Keyboard.registerEvent('KeyP', () => this.pauseTrigger());
        /** keyboard events */
        Keyboard.registerEvent('Space', () => {
            console.log(this.player.canLand);
            console.log(this.player.landed);
            if(this.player.canLand){
                if(this.player.landed){
                    this.player.takeOff();
                } else {
                    this.player.land();
                }
            }
        });
    }

    public update(){

        this.player.pauseEmitter(this.paused);
        
        if(!this.paused){
            Group.shared.update();

            this.player.update();
            this.objects.forEach(object => object.update());
            // this.background.update();
            this.stars1.update();
            this.stars2.update();
            this.stars3.update();
            this.stars4.update();
            this.track(this.player);

            // give parallax to all planets
            this.planetGroup.position.set(this.player.position.x * .4, this.player.position.y * .4);
        }

        // sync flight UI
        FlightUIService.inventory.value.fuel = this.player.inventory.fuel;
        FlightUIService.inventory.value.maxFuel = this.player.inventory.maxFuel;
    }

    private track(target: DisplayObject){
        // get position of center of screen
        let stageXHalf = Manager.width/2;
        let stageYHalf = Manager.height/2;

        // get player position in stage
        let {x, y} = target.getGlobalPosition();

        // move this scene the right amount so the player stays centered
        let xDiff = x - stageXHalf;
        let yDiff = y - stageYHalf;

        if(x > 0){
            this.x = this.x - xDiff;
        } else {
            this.x = this.x + xDiff;
        }

        if(y > 0){
            this.y = this.y - yDiff;
        } else {
            this.y = this.y + yDiff;
        }
    }

    public resize(width: number, height: number){
        console.log('resizing '+width+' - '+height);
    }

    public onDestroy() {

        // this.background.destroy();
        this.stars1.destroy();
        this.stars2.destroy();
        this.stars3.destroy();
        this.stars4.destroy();

        this.player.onDestroy();
        this.player.destroy();
        this.objects.forEach(object => object.destroy());

        Keyboard.removeEvent('KeyP');
    }

    public pauseTrigger() {
        if(!this.paused) this.paused = true;
        else this.paused = false;
    }
}
