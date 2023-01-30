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
import GameStateService from "../services/GameStateService";
import { Asteroid } from "../objects/Asteroid";
import { Cargo } from "../enums/Cargo";

export class World extends Container implements IScene {

    // private background: Background;
    private stars1: WrappingBackground;
    private stars2: WrappingBackground;
    private stars3: WrappingBackground;
    private stars4: WrappingBackground;

    public player: Player;
    public objects: Array<IGameObject> = [];
    public particles: ParticleContainer;
    public asteroidGroup: Container;
    public groups: Map<string, Container> = new Map<string, Container>();
    private planetGroup: Container;

    private target: Target;

    public paused: boolean = false;

    constructor(){
        super();
        Manager.setLoadingScene(this);

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

        // add asteroids Group
        this.asteroidGroup = new Container();
        this.addChild(this.asteroidGroup);
        this.groups.set('asteroids', this.asteroidGroup);

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
        let humble = new Planet({
            name: 'Humble',
            info: 'Located within an asteroid cloud, planet humble is a simple freezing ocean world with glaciers and seas. It\'s inhabbited by only some scientists and terraformers. Because while the planet has abundant mass and water, its settlers are still looking for efficient ways to beat the cold. All that is subject to change though. Ever since the surrounding skies were discovered by asteroid miners, these humble beginnings have started to look more promising.',
            asset: 'planet.humble',
            x: 0,
            y: 0,
            needs: [Cargo.Energy, Cargo.Technology],
            products: [
                {
                    type: Cargo.Matter,
                    max: 5
                },
                {
                    type: Cargo.Water,
                    max: 5
                },
                {
                    type: Cargo.Minerals,
                    max: 3
                }
            ]
        });
        this.groups.get('planets')?.addChild(humble);
        this.objects.push(humble);
        this.player.latestPlanet = humble;

        // asteroids (temp)
        for (let i = 0; i < 20; i++) {
            let x = 500 - Math.floor(Math.random() * 1000);
            let y = 500 - Math.floor(Math.random() * 1000);
            let asteroid = new Asteroid(0 + x, -1500 + y);
            this.objects.push(asteroid);
        }

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

        /** keyboard events */
        Keyboard.registerEvent('KeyP', () => this.pauseTrigger());
        Keyboard.registerEvent('Space', () => {
            if(this.player.canLand && !GameStateService.gameOver.value){
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

        // check game over conditions
        if(GameStateService.inventory.value.fuel <= 0){
            GameStateService.gameOver.value = true;
            GameStateService.gameOverMessage.value = 'You ran out of fuel...';
            Manager.pauseScene();
        }
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
