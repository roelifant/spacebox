export class Vector {

    public components: Array<number>

    public get x(): number{
        return this.components[0];
    }

    public get y(): number{
        return this.components[1];
    }

    public get z(): number{
        return this.components[3];
    }

    public get length(): number {
        let res = 0;
        this.components.forEach( component => {
            res += (component*component);
        });
        return Math.sqrt(res);
    }

    constructor(...components: Array<number>) {
        this.components = components
    }

    add(vector: Vector) {
        let { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    subtract(vector: Vector) {
        let { components } = vector;
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    multiply(factor: number){
        return new Vector(...this.components.map(component => component * factor));
    }

    divide(scalar: number){
        return new Vector(...this.components.map(component => component / scalar));
    }

    normalize(){
        return this.divide(this.length);
    }

    /**
     * Dot product. Turns two vectors into a single number.
     *
     * @param vector
     */
    dot(vector: Vector): number {
        if(this.components.length !== vector.components.length){
            throw Error("Vectors must have the same amount of components!")
        }
        let res = 0;
        this.components.forEach( (component: number, index: number) => {
            res += (component * vector.components[index]);
        });
        return res;
    }

    angle(): number {
        if(this.components.length > 2){
            throw Error('This method only works for two-dimensional vectors!');
        }
        const origin = new Vector(0, -1)
        const radian = Math.acos(this.dot(origin) / (this.length * origin.length))
        if (this.y * origin.x > this.x * origin.y) {
            return radian * (180/Math.PI);
        }
        return ((Math.PI * 2) - radian) * (180/Math.PI);
    }
}
