import {DisplayObject, Loader, Sprite, Texture} from "pixi.js";

export class Background extends Sprite {

    private target: DisplayObject | null = null;
    private tracking: boolean = false;
    private parallax: number = 0;

    private startPosX: number = 0;
    private startPosY: number = 0;

    constructor(texture: string){
        super();

        const resource: Texture | undefined = Loader.shared.resources[texture].texture;
        if(typeof resource === 'undefined'){
            throw Error('Not a valid texture!');
        }
        this.texture = resource;
        this.anchor.set(0.5, 0.5);
    }

    /**
     * Set this object to follow a display object
     *
     * @param target
     */
    public startTracking(target: DisplayObject){
        this.target = target;
        this.tracking = true;
    }

    /**
     *  Set this object to slightly move along with a display object. If this display object is the player / something the camera tracks
     *
     *  The second argument is for parallax. 1 means there will be no parallax effect.
     *
     *  The 3rd argument is for looping
     *
     * @param target
     * @param parallax
     */
    public startParallax(target: DisplayObject, parallax: number){
        this.parallax = parallax;
        this.target = target;
        this.startPosY = this.y;
        this.startPosX = this.x;
    }

    public update(){
        if(this.tracking && this.target){
            // get player position in stage
            let {x, y} = this.target.position;

            this.x = x;
            this.y = y;
        }
        if(this.parallax > 0 && this.target){
            let {x, y} = this.target.position;
            this.x = this.startPosX + (x * (1 - this.parallax));
            this.y = this.startPosY + (y * (1 - this.parallax));
        }
    }
}
