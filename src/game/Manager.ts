import {Application, DisplayObject, Loader, Ticker, Point, utils, Texture} from 'pixi.js';
import {IScene} from "./interfaces/IScene";
import {IPhysics} from "./interfaces/IPhysics";
// import {IPhysics} from "./interfaces/IPhysics";

export class Manager {
    private constructor(){}

    private static app: Application;
    private static currentScene: IScene | null;
    private static loadingScene: IScene | null;
    private static globalTicker: Ticker;

    public static loaded: boolean = false;

    public static get width(): number {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    public static get height(): number {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    public static get scene(): IScene {
        if(Manager.loadingScene){
            return Manager.loadingScene;
        }
        if(Manager.currentScene){
            return Manager.currentScene;
        }
        throw Error('No scene is active or loading!')
    }

    public static setLoadingScene(scene: IScene){
        Manager.loadingScene = scene;
    }

    public static get time(): number {
        return Manager.globalTicker.elapsedMS;
    }

    public static init(background: number): void {

        console.log('initializing pixi')

        console.log(document.getElementById("pixi-canvas"));

        // create app
        Manager.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            resizeTo: window,
            autoDensity: true,
            backgroundColor: background
        });

        this.globalTicker = Manager.app.ticker.add(Manager.update);

        window.addEventListener("resize", Manager.resize);

        console.log('initialised');
    }

    public static end(){
        Manager.app.ticker.stop();
        Loader.shared.reset();
        Manager.app.stop();
        Manager.scene.onDestroy();
        Manager.scene.destroy();
        Manager.currentScene = null;
        Manager.loadingScene = null;
        Manager.app.stage.destroy();
        Manager.app.destroy();
        utils.destroyTextureCache();
    }

    public static changeScene(newScene: IScene): void {
        // remove old scene
        if(Manager.currentScene){
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // add new scene
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);

        Manager.loadingScene = null;
    }

    private static update(): void {
        if(Manager.currentScene){
            Manager.currentScene.update();
        }
    }

    public static resize(): void {
        if(Manager.currentScene) {
            Manager.currentScene.resize(Manager.width, Manager.height);
        }
    }

    public static getTexture(name: string){
        const resource: Texture | undefined = Loader.shared.resources[name].texture;
        if(typeof resource === 'undefined'){
            throw Error('Not a valid texture name!');
        }
        return resource;
    }

    public static collide(obj1: DisplayObject, obj2: DisplayObject): boolean{
        const a = obj1.getBounds();
        const b = obj2.getBounds();

        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;

        if (leftmostRight <= rightmostLeft)
        {
            return false;
        }

        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

        return topmostBottom > bottommostTop;
    }

    /**
     * Simpler form of collision detection. Works with rectangles that have no rotation
     *
     * @param obj1
     * @param obj2
     */
    public static rectCollide(obj1: DisplayObject, obj2: DisplayObject): boolean{
        const a = obj1.getBounds();
        const b = obj2.getBounds();

        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;

        if (leftmostRight <= rightmostLeft)
        {
            return false;
        }

        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

        return topmostBottom > bottommostTop;
    }

    /**
     * Simpler form of collision detection. Works with circles
     *
     * @param obj1
     * @param obj2
     */
    public static circleCollide(obj1: DisplayObject, obj2: DisplayObject): boolean {

        const obj1Bounds = obj1.getBounds();
        const obj2Bounds = obj2.getBounds();

        const obj1Radius = (obj1Bounds.right - obj1Bounds.left)/2;
        const obj2Radius = (obj2Bounds.right - obj2Bounds.left)/2;

        let dx = (obj1Bounds.left + obj1Radius) - (obj2Bounds.left + obj2Radius);
        let dy = (obj1Bounds.top + obj1Radius) - (obj2Bounds.top + obj2Radius);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < obj1Radius + obj2Radius)
        {
            return true;
        }
        return false;
    }


    public static add(child: any, group: string | null = null){
        if(Manager.currentScene){
            if(!!group){
                Manager.currentScene.groups.get(group)?.addChild(child);
            } else {
                Manager.currentScene.addChild(child);
            }
            Manager.currentScene.objects.push(child);
        }
    }

    public static remove(child: any, group: string | null = null){
        if(Manager.currentScene){
            if(!!group){
                Manager.currentScene.groups.get(group)?.removeChild(child);
            } else  {
                Manager.currentScene.removeChild(child);
            }
            const index = Manager.currentScene.objects.indexOf(child);
            Manager.currentScene.objects.splice(index, 1);
        }
    }

    public static getAllTagged(...tags: Array<string>){
        let results: Array<any> = [];
        tags.forEach((tag:string) => {
            let matches = Manager.scene.objects.filter(object => object.tags.includes(tag));
            results = results.concat(matches);
        });
        return results;
    }

    public static collideWith(tags: Array<string>, callback: CallableFunction, context: any){
        Manager.getAllTagged(...tags)
            .forEach((object: any) => {
                if (Manager.collide(context, object)) {
                    callback(object);
                }
            });
    }

    public static rectCollideWith(tags: Array<string>, callback: CallableFunction, context: any){
        Manager.getAllTagged(...tags)
            .forEach((object: any) => {
                if (Manager.rectCollide(context, object)) {
                    callback(object);
                }
            });
    }

    public static circleCollideWith(tags: Array<string>, callback: CallableFunction, context: any){
        Manager.getAllTagged(...tags)
            .forEach((object: any) => {
                if (Manager.circleCollide(context, object)) {
                    callback(object);
                }
            });
    }

    public static physicsBounce(obj1: IPhysics, obj2: IPhysics){

        if (!this || !obj1) {
            return;
        }

        let targetX = obj1.getBounds().left;
        let targetY = obj1.getBounds().top;
        let thisX = obj2.getBounds().left;
        let thisY = obj2.getBounds().top;

        const vCollision = new Point(
            targetX - thisX,
            targetY - thisY,
        );

        const distance = Math.sqrt(
            (targetX - thisX) * (targetX - thisX)
            + (targetY - thisY) * (targetY - thisY),
        );

        const vCollisionNorm = new Point(
            vCollision.x / distance,
            vCollision.y / distance,
        );

        const vRelativeVelocity = new Point(
            obj2.momentum.x - obj1.momentum.x,
            obj2.momentum.y - obj1.momentum.y,
        );

        const speed = vRelativeVelocity.x * vCollisionNorm.x
            + vRelativeVelocity.y * vCollisionNorm.y;

        const targetImpulse = 2 * speed / obj1.collisionWeight;
        const impulse = 2 * speed / obj2.collisionWeight;

        console.log(impulse * vCollisionNorm.x);
        console.log(impulse * vCollisionNorm.y)

        obj2.momentum.x += -impulse * vCollisionNorm.x;
        obj2.momentum.y += -impulse * vCollisionNorm.y;

        obj1.momentum.x += targetImpulse * vCollisionNorm.x;
        obj1.momentum.y += targetImpulse * vCollisionNorm.y;
    }

    public static pauseScene(){
        this.scene.paused = true;
    }

    public static continueScene(){
        this.scene.paused = false;
    }
}
