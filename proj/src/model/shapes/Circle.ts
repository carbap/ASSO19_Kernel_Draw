import { Shape } from './Shape';

export class Circle extends Shape {
    private radius: number;
    private radiusOG: number;

    public constructor(ID: string, centerX: number, centerY: number, radius: number) {
        super(ID, centerX, centerY);
        this.radius = radius;
        this.radiusOG = radius;
    }

    public reset() {
        this.radius = this.radiusOG;
        super.reset();
    }

    public scale(factor: number): void {
        this.radius *= factor;
    }

    public getRadius() : number {
        return this.radius;
    }

    public copy(): Circle {
        return new Circle(this.ID, this.center.getX(), this.center.getY(), this.radius);
    }
}