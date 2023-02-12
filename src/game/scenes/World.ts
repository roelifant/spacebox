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
import Scheduler from "../services/Scheduler";
import Market from "../services/Market";
import { AsteroidField } from "../objects/AsteroidField";
import { Upgrade } from "../objects/Upgrade";

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
    public planetGroup: Container;

    private target: Target;

    public paused: boolean = false;
    public scheduler: Scheduler;

    constructor(){
        super();
        Manager.setLoadingScene(this);

        this.scheduler = new Scheduler();

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
                    max: 8
                },
                {
                    type: Cargo.Minerals,
                    max: 3
                }
            ],
            upgrades: [
                new Upgrade({
                    key: 'cargo_minerals',
                    name: 'Minerals cargo module',
                    description: 'Allows you to transport precious minerals across the galaxy. Minerals are slightly more valuable than raw matter.',
                    icon: 'upgrades/mineralsStorage.png',
                    price: 500
                }),
                new Upgrade({
                    key: 'cargo_capacity',
                    name: 'Cargo capacity',
                    description: 'Increase your available cargo space so you can carry 5 more of any cargo types.',
                    price: 250,
                    stackWith: 'cargo_capacity',
                    icon: 'upgrades/cargoExpansion.png',
                    action: () => {
                        GameStateService.inventory.value.maxCargo += 5;
                    }
                }),
                new Upgrade({
                    key: 'fuel_capacity',
                    name: 'Fuel capacity',
                    description: 'Increase your fuel capacity so you can fly longer distances without needing to refuel.',
                    price: 250,
                    stackWith: 'fuel_capacity',
                    icon: 'upgrades/extraFuel.png',
                    action: () => {
                        GameStateService.inventory.value.maxFuel += 250;
                        GameStateService.inventory.value.fuel += 250;
                    }
                })
            ]
        });
        this.groups.get('planets')?.addChild(humble);
        this.objects.push(humble);
        this.player.latestPlanet = humble;

        let mycen = new Planet({
            name: 'Mycen',
            info: 'Lorem ipsum.',
            asset: 'planet.mycen',
            x: 2000,
            y: -5000,
            needs: [Cargo.Matter, Cargo.Minerals],
            products: [
                {
                    type: Cargo.Fungi,
                    max: 8
                },
                {
                    type: Cargo.Fauna,
                    max: 3
                },
                {
                    type: Cargo.Flora,
                    max: 2
                }
            ],
            upgrades: [
                new Upgrade({
                    key: 'cargo_fungi',
                    name: 'Fungi cargo module',
                    description: 'Allows you to keep and maintain fungi habitats on your spaceship, so they can be transported and traded across the galaxy.',
                    icon: 'upgrades/fungiStorage.png',
                    price: 1000
                }),
                new Upgrade({
                    key: 'cargo_capacity',
                    name: 'Cargo capacity',
                    description: 'Increase your available cargo space so you can carry 5 more of any cargo types.',
                    price: 250,
                    stackWith: 'cargo_capacity',
                    icon: 'upgrades/cargoExpansion.png',
                    action: () => {
                        GameStateService.inventory.value.maxCargo += 5;
                    }
                }),
                new Upgrade({
                    key: 'fuel_capacity',
                    name: 'Fuel capacity',
                    description: 'Increase your fuel capacity so you can fly longer distances without needing to refuel.',
                    price: 250,
                    stackWith: 'fuel_capacity',
                    icon: 'upgrades/extraFuel.png',
                    action: () => {
                        GameStateService.inventory.value.maxFuel += 250;
                        GameStateService.inventory.value.fuel += 250;
                    }
                })
            ]
        });
        this.groups.get('planets')?.addChild(mycen);
        this.objects.push(mycen);

        // asteroids
        new AsteroidField(1000,-3000);
        new AsteroidField(-2000,2500);
        new AsteroidField(-3500,-1500);

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

        Market.init();
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
            this.setPlanetParallax();

            // update scheduler
            this.scheduler.update();
        }

        // check game over conditions
        if(GameStateService.inventory.value.fuel <= 0){
            GameStateService.gameOver.value = true;
            GameStateService.gameOverMessage.value = 'You ran out of fuel...';
            Manager.pauseScene();
        }
    }

    public setPlanetParallax(x: number = this.player.position.x, y: number = this.player.position.y){
        this.planetGroup.position.set(x * .4, y * .4);
    }

    private track(target: DisplayObject){
        // get position of center of screen
        const stageXHalf = Manager.width/2;
        const stageYHalf = Manager.height/2;

        // get player position in stage
        let {x, y} = target.getGlobalPosition();

        // move this scene the right amount so the player stays centered
        let xDiff = x - stageXHalf;
        let yDiff = y - stageYHalf;

        // console.log(target.getGlobalPosition());

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

        // console.log(this.x, this.y);
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
