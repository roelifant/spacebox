import { Manager } from "../Manager";
import { World } from "../scenes/World";
import { Vector } from "../utils/Vector";
import { Asteroid } from "./Asteroid";
import { Player } from "./Player";


export class AsteroidField {

    private x: number;
    private y: number;
    private radius: number;
    private maxSpawn: number;

    private asteroids: Array<Asteroid> = [];

    constructor(x: number, y: number, maxSpawn: number = 18, radius: number = 1000, spawnRateSeconds: number = 40){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxSpawn = maxSpawn;
        this.setup();

        const world = <World>Manager.scene;
        world.scheduler.set(() => {
            if(this.asteroids.length < this.maxSpawn){
                this.spawnAsteroid();
            }
        }, spawnRateSeconds, true);
    }

    /**
     * Spawn initial asteroids
     */
    setup(count: number = this.maxSpawn){

        let tries = 0;

        while(this.asteroids.length < count){
            this.spawnAsteroid();

            // safety net for when asteroids cannot spawn
            tries++;
            if(tries > this.maxSpawn * 3) break;
        }
    }

    canSpawn(x: number, y: number): boolean {

        const world = <World>Manager.scene;

        const fieldPosition = new Vector(x, y);
        const playerPosition = new Vector(world.player.x, world.player.y);

        if(playerPosition.distance(fieldPosition) < 2000) {
            return false;
        }

        this.asteroids.forEach(asteroid => {
            const asteroidPosition = new Vector(asteroid.x, asteroid.y);
            if(asteroidPosition.distance(fieldPosition) < 100) {
                return false;
            }
        })

        return true;
    }

    spawnAsteroid(){
        const distance = Math.floor(Math.random()*this.radius);
        const angle = Math.floor(Math.random() * 360);

        const x = this.x + (distance * Math.cos(angle));
        const y = this.y + (distance * Math.sin(angle));

        if(!this.canSpawn(x, y)){
            return;
        }

        this.asteroids.push(new Asteroid(x, y, this));
    }

    removeAsteroid(asteroid: Asteroid){
        this.asteroids.splice(this.asteroids.indexOf(asteroid, 1));
    }
}