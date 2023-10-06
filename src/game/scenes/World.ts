import {Container, DisplayObject, ParticleContainer} from "pixi.js";
import {IScene} from "../interfaces/IScene";
import {Manager} from "../Manager";
import {Group} from "tweedle.js";
import {Player} from "../objects/Player";
// import {Background} from "../objects/Background";
import { Planet } from "../objects/Planet";
import {Mouse} from "../Mouse";
import {IGameObject} from "../interfaces/IGameObject";
import { WrappingBackground } from "../objects/WrappingBackground";
import { Keyboard } from "../Keyboard";
import GameStateService from "../services/GameStateService";
import { Cargo } from "../enums/Cargo";
import Scheduler from "../services/Scheduler";
import Market from "../services/Market";
import { AsteroidField } from "../objects/AsteroidField";
import { Upgrade } from "../objects/Upgrade";
import { IHeadingOption } from "../interfaces/IHeadingOption";
import { Traveler } from "../objects/Traveler";
import { Enemy } from "../objects/Enemy";
import { IHasEmitter } from "../interfaces/IHasEmitter";
import { Vector } from "../utils/Vector";

export class World extends Container implements IScene {

    public player: Player;
    public traveler1: Traveler;
    public traveler2: Traveler;
    public shipsGroup: Container;
    public objects: Array<IGameObject> = [];
    public planets: Array<Planet> = [];
    public particles: ParticleContainer;
    public asteroidGroup: Container;
    public groups: Map<string, Container> = new Map<string, Container>();
    public planetGroup: Container;

    public paused: boolean = false;
    public scheduler: Scheduler;
    public headings: Array<IHeadingOption> = [];

    // private background: Background;
    private stars1: WrappingBackground;
    private stars2: WrappingBackground;
    private stars3: WrappingBackground;
    private stars4: WrappingBackground;

    

    constructor(){
        super();
        Manager.setLoadingScene(this);

        this.scheduler = new Scheduler();
        this.x = Manager.width/2;
        this.y = Manager.height/2;

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

        // add ships group
        this.shipsGroup = new Container();
        this.addChild(this.shipsGroup);
        this.groups.set('ships', this.shipsGroup);

        // set player
        this.player = new Player('player');
        this.objects.push(this.player);
        this.addChild(this.player);

        // add traveler
        this.traveler1 = new Traveler();
        this.traveler1.x = 5000;
        this.traveler1.y = -2500;
        this.objects.push(this.traveler1);
        this.shipsGroup.addChild(this.traveler1);

        this.traveler2 = new Traveler();
        this.traveler2.x = -5000;
        this.traveler2.y = -10000;
        this.objects.push(this.traveler2);
        this.shipsGroup.addChild(this.traveler2);

        const enemyCount = 3;
        for (let i = 0; i < enemyCount; i++) {
            const enemy = new Enemy('ship.pirate');
            enemy.x = 5000;
            enemy.y = -3000;
            this.objects.push(enemy);
            this.shipsGroup.addChild(enemy);
        }

        this.scheduler.set(() => {
            this.spawnEnemies();
        }, 30, true);
        
        // this.background.startTracking(this.player);

        // parallax stars
        this.stars1 = new WrappingBackground(Manager.getTexture('stars.1'), this.player, .95, .15);
        this.groups.get('stars')?.addChild(this.stars1);
        this.stars2 = new WrappingBackground(Manager.getTexture('stars.1'), this.player, .9, .2);
        this.groups.get('stars')?.addChild(this.stars2);
        this.stars3 = new WrappingBackground(Manager.getTexture('stars.2'), this.player, .85, .25);
        this.groups.get('stars')?.addChild(this.stars3);
        this.stars4 = new WrappingBackground(Manager.getTexture('stars.2'), this.player, .8, .3);
        this.groups.get('stars')?.addChild(this.stars4);

        // planets
        let humble = new Planet({
            name: 'Humble',
            info: 'Located within an asteroid cloud, planet humble is a simple freezing ocean world with glaciers and seas. It\'s inhabbited by only some scientists and terraformers. While the planet has abundant mass and water, settlers are still looking for efficient ways to beat the cold. All that is subject to change though. Ever since the surrounding skies were discovered by asteroid miners, these humble beginnings have started to look more promising.',
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
        humble.discovered = true;
        this.groups.get('planets')?.addChild(humble);
        this.objects.push(humble);
        this.player.latestPlanet = humble;
        this.planets.push(humble);

        const mycen = new Planet({
            name: 'Mycen',
            info: 'Despite being an unstable planet, Mycen harbors a very interesting eco system. Giant roots from fungus networks grow between the cracks that seperate the continents, creating strange hanging mushroom jungles where equally strange alien creatures float around in the damp atmosphere. There may not be much ground to stand on, but this low gravity world is a sight to behold.',
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
                    description: 'Allows you to keep and maintain fungi habitats on your spaceship, so fungi can be transported and traded across the galaxy.',
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
        this.planets.push(mycen);

        const oer = new Planet({
            name: 'Oer',
            info: 'The jungles on Oer get so dense that explorers have compared the darkness on the forest floors to that of black holes. The climate is seemingly inpenetrable, thanks to the large, dangerous wildlife that inhabbits it. Traders are cautioned not to wander too far from the space ports, as the slow deforestation process tends to draw monstrous beasts out that won\'t go down without a fight.',
            asset: 'planet.oer',
            x: 5000,
            y: 1000,
            needs: [Cargo.Technology, Cargo.Weaponry],
            products: [
                {
                    type: Cargo.Flora,
                    max: 12
                },
                {
                    type: Cargo.Fauna,
                    max: 4
                },
                {
                    type: Cargo.Minerals,
                    max: 2
                }
            ],
            upgrades: [
                new Upgrade({
                    key: 'cargo_fauna',
                    name: 'Fauna cargo module',
                    description: 'Allows you to keep and maintain habitats for fauna on your spaceship, so fauna can be transported and traded across the galaxy.',
                    icon: 'upgrades/faunaStorage.png',
                    price: 2000
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
        this.groups.get('planets')?.addChild(oer);
        this.objects.push(oer);
        this.planets.push(oer);

        const swept = new Planet({
            name: 'Swept',
            info: 'There is no hotter or dryer landscape than the deserts of Swept. Heat is emmited from the very core of the planet itself, which the settlers use to power their habitats. Energy is even exported to other planets. Despite this lucrative trade, the deserts remain a difficult place for settlers to endure without spiritual guidance.',
            asset: 'planet.swept',
            x: 10000,
            y: -6000,
            needs: [Cargo.Water, Cargo.Wisdom],
            products: [
                {
                    type: Cargo.Energy,
                    max: 5
                },
                {
                    type: Cargo.Matter,
                    max: 4
                },
                {
                    type: Cargo.Fauna,
                    max: 3
                }
            ],
            upgrades: [
                new Upgrade({
                    key: 'cargo_energy',
                    name: 'energy cargo module',
                    description: 'Allows you to store raw energy on your spaceship, so it can be transported and traded across the galaxy.',
                    icon: 'upgrades/energyStorage.png',
                    price: 3000
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
        this.groups.get('planets')?.addChild(swept);
        this.objects.push(swept);
        this.planets.push(swept);

        const noctar = new Planet({
            name: 'Noctar',
            info: 'Far away from any sun, all the light on this world comes from its cities which are vast and span across the entire planet. This night world has the largest population of any planet in the galaxy, and is responsable for almost all technological innovations in recent galactic memory.',
            asset: 'planet.noctar',
            x: 12000,
            y: 8000,
            needs: [Cargo.Fungi, Cargo.Wisdom],
            products: [
                {
                    type: Cargo.Technology,
                    max: 5
                },
                {
                    type: Cargo.Energy,
                    max: 3
                },
                {
                    type: Cargo.Weaponry,
                    max: 1
                }
            ],
            upgrades: [
                new Upgrade({
                    key: 'cargo_technology',
                    name: 'energy cargo module',
                    description: 'Allows you to distribute robotics, medicine, formula\'s, tools and patents.',
                    icon: 'upgrades/technologyStorage.png',
                    price: 6000
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
        this.groups.get('planets')?.addChild(noctar);
        this.objects.push(noctar);
        this.planets.push(noctar);

        // asteroids
        new AsteroidField(1000,-3000);
        new AsteroidField(-2000,2500);
        new AsteroidField(-3500,-1500);
        new AsteroidField(5000,-2500);
        new AsteroidField(13000,-7000);
        new AsteroidField(6000,3000);

        // set interactions
        this.on('pointertap', () => {
            if(GameStateService.inventory.value.ammo > 0) this.player.shoot(Mouse.x, Mouse.y);
        }, this);
        this.interactive = true;

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
        
        if(!this.paused){
            Group.shared.update();

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
            this.handleGameOver();
        }
        if(GameStateService.shipDestroyed.value){
            GameStateService.gameOver.value = true;
            GameStateService.gameOverMessage.value = 'Pirates destroyed your ship...';
            this.handleGameOver();
        }
    }

    public setPlanetParallax(x: number = this.player.position.x, y: number = this.player.position.y){
        this.planetGroup.position.set(x * .4, y * .4);
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
        if(!this.paused) {
            this.freezeEmitters(true);
            this.paused = true;
        } else {
            this.freezeEmitters(false);
            this.paused = false;
        }
    }

    public freezeEmitters(value: boolean) {
        // pause emitters
        this.objects.forEach(object => {
            if(object.tags.includes('ship')) {
                (<IHasEmitter><any>object).pauseEmitter(value)
            }
        });
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

    private handleGameOver() {
        this.freezeEmitters(true);
        Manager.pauseScene();
    }

    private spawnEnemies() {
        const maxEnemyCount = 3 + (Math.floor(GameStateService.upgradePercent.value)/10);
        const currentEnemyCount = this.objects.filter(obj => obj.tags.includes('ship') && obj.tags.includes('enemy')).length;
        
        if(currentEnemyCount < maxEnemyCount) {
            const playerPosition = new Vector(this.player.position.x, this.player.position.y);

            const spawnPositions = [
                {x: playerPosition.x - 5000, y: playerPosition.y - 5000},
                {x: playerPosition.x, y: playerPosition.y - 5000},
                {x: playerPosition.x + 5000, y: playerPosition.y - 5000},
                {x: playerPosition.x + 5000, y: playerPosition.y},
                {x: playerPosition.x + 5000, y: playerPosition.y + 5000},
                {x: playerPosition.x, y: playerPosition.y + 5000},
                {x: playerPosition.x - 5000, y: playerPosition.y + 5000},
                {x: playerPosition.x - 5000, y: playerPosition.y},
            ]

            const spawnPosition = spawnPositions[Math.floor(spawnPositions.length*Math.random())];

            const enemy = new Enemy('ship.pirate');
            enemy.x = spawnPosition.x;
            enemy.y = spawnPosition.y;
            this.objects.push(enemy);
            this.shipsGroup.addChild(enemy);

            console.log('spawned enemy');
        }
    }
}
