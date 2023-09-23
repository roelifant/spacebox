import {Sprite} from "pixi.js";
import {Manager} from "../Manager";
import {Vector} from "../utils/Vector";
import {IGameObject} from "../interfaces/IGameObject";

export class Bullet extends Sprite implements IGameObject {
    public tags: Array<string> = ['bullet'];

    private speed: number = .5;
    private expiration: number;
    private direction: Vector;
    private startingVelocityX: number = 0;
    private startingVelocityY: number = 0;

    constructor(
        x: number,
        y: number,
        startingVelocityX: number,
        startingVelocityY: number,
        tags: Array<string> = []
    ){
        super();

        this.tags = this.tags.concat(tags);

        this.texture = Manager.getTexture('bullet');

        if(this.tags.includes('playedBullet')) {
            this.tint = 0xe8e8e8;
        }

        if(this.tags.includes('enemyBullet')) {
            this.tint = 0xdba7ac;
        }

        // this.anchor.set(0.5, 0.5);

        this.pivot.set(this.width/2, this.height/2);

        this.scale.set(0.1, 0.1);

        this.expiration = Date.now() + 8000;
        this.direction = new Vector(x, y);
        this.angle = this.direction.angle();

        this.startingVelocityX = startingVelocityX;
        this.startingVelocityY = startingVelocityY;
    }

    public update(){
        this.x = this.x + (this.direction.normalize().x * (this.speed * Manager.time));
        this.y = this.y + (this.direction.normalize().y * (this.speed * Manager.time));
        this.x -= this.startingVelocityX * Manager.time;
        this.y -= this.startingVelocityY * Manager.time;


        if(Date.now() > this.expiration){
            Manager.remove(this, 'bullets');
            this.destroy();
        }
    }
}
