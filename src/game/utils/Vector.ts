import { IPoint } from "../interfaces/IPoint";

export class Vector {

    public components: Array<number>

    public get x(): number {
        return this.components[0];
    }

    public set x(x: number) {
        this.components[0] = x;
    }

    public get y(): number {
        return this.components[1];
    }

    public set y(y: number) {
        this.components[1] = y;
    }

    public get z(): number {
        return this.components[2];
    }

    public set z(z: number) {
        this.components[2] = z;
    }

    public get length(): number {
        let res = 0;
        this.components.forEach(component => {
            res += (component * component);
        });
        return Math.sqrt(res);
    }

    /**
     * 2 = 2D vector, 3 = 3D vector, and so on
     */
    public get dimensions(): number {
        return this.components.length;
    }

    constructor(...components: Array<number>) {
        this.components = components
    }

    add(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    subtract(vector: Vector) {
        const { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    scale(scalar: number) {
        return new Vector(...this.components.map(component => component * scalar));
    }

    divide(scalar: number) {
        return new Vector(...this.components.map(component => component / scalar));
    }

    normalize() {
        return this.divide(this.length);
    }

    /**
     * Dot product. Turns two vectors into a single number.
     *
     * @param vector
     */
    dot(vector: Vector): number {
        if (this.components.length !== vector.components.length) {
            throw Error("Vectors must have the same amount of components!");
        }
        let res = 0;
        this.components.forEach((component: number, index: number) => {
            res += (component * vector.components[index]);
        });
        return res;
    }

    angle(): number {
        if (this.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        const origin = new Vector(0, -1)
        const radian = Math.acos(this.dot(origin) / (this.length * origin.length))
        if (this.y * origin.x > this.x * origin.y) {
            return radian * (180 / Math.PI);
        }
        return ((Math.PI * 2) - radian) * (180 / Math.PI);
    }

    /**
     * Output the vector as a point (x, y, z);
     * 
     * @returns IPoint
     */
    public toPoint(): IPoint {
        if (this.components.length < 2) throw new Error('Not enough components for point');
        if (this.components.length > 2) return { x: this.x, y: this.y, z: this.z };
        return { x: this.x, y: this.y };
    }

    distance(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors!');
        }
        return Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2));
    }

    angleTo(vector: Vector): number {
        if(this.components.length > 2 || vector.components.length > 2) {
            throw Error('This method only works for two-dimensional vectors');
        }

        const diff = this.subtract(vector);
        const theta = Math.atan2(diff.x, diff.y);
        return theta * (180 / Math.PI);
    }

    flipComponent(component: number): Vector {
        if(component < 1 || component > this.components.length) throw Error('Vector does not have a '+component+'th component');
        
        const vector = new Vector(...this.components);
        vector.components[component - 1] = -vector.components[component - 1];
        
        return vector;
    }

    flipX(): Vector{
        return this.flipComponent(1);
    }

    flipY(): Vector{
        return this.flipComponent(2);
    }

    flipZ(): Vector{
        return this.flipComponent(3);
    }

    /**
     * Log all components + length
     */
    public log() {
        const components: any = {};
        if (this.components.length <= 3) {
            components['x'] = this.x;
            if (this.components.length > 1) components['y'] = this.y;
            if (this.components.length > 2) components['z'] = this.z;
        } else {
            this.components.forEach((comp, index) => {
                components[index] = comp;
            });
        }

        const object = {
            length: this.length,
            dimensions: this.dimensions,
            ...components,
        };
        console.table(object);
    }

    /**
     * Modify the vector so its length equals the given number
     * 
     * @param length
     * @returns vector
     */
    public setLength(length: number): Vector {
        if(this.length === 0){
            throw new Error('Cannot set length on a vector that has no direction.');
        }

        return this.normalize().scale(length);
    }

    /**
     * Alias for setLength()
     * 
     * @param magnitude 
     * @returns vector
     */
    public setMagnitude(magnitude: number): Vector {
        return this.setLength(magnitude);
    }

    /**
     * Modify the vector so its length is equal to the original length + the given addition number
     * 
     * @param addition 
     * @returns vector
     */
    public addLength(addition: number): Vector {
        if(addition < 0) {
            return this.subtractLength(-addition);
        }

        if(this.length === 0){
            throw new Error('Cannot add length to a vector with a starting length of zero.');
        }

        const newLength = this.length + addition;

        return this.setLength(newLength);
    }

    /**
     * Alias for addLength()
     * 
     * @param addition 
     * @returns vector
     */
    public addMagnitude(addition: number): Vector {
        return this.addLength(addition);
    }

    /**
     * Modify the vector so its length is equal to the original length - the given subtraction number
     * 
     * @param subtraction 
     * @returns 
     */
    public subtractLength(subtraction: number): Vector {
        if(subtraction < 0) {
            return this.addLength(-subtraction);
        }

        if(this.length === 0){
            throw new Error('Cannot subtract length from a vector with a starting length of zero.');
        }

        const originalLength = this.length;
        const newLength = originalLength - subtraction;

        if(newLength < 0) {
            return new Vector(0, 0);
        }

        return this.setLength(newLength);
    }

    /**
     * Alias for subtractLength()
     * 
     * @param subtraction 
     * @returns vector
     */
    public subtractMagnitude(subtraction: number): Vector {
        return this.subtractLength(subtraction);
    }
}
