import { Shape } from './Shape';

export class Square extends Shape {
    private size: number;
    private sizeOG: number;

    public constructor(ID: string, centerX: number, centerY: number, size: number, rotation: number = 0) {
        super(ID, centerX, centerY, rotation);
        this.size = size;
        this.sizeOG = size;
    }

    public getSize(): number {
        return this.size;
    }

    public reset() {
        this.size = this.sizeOG;
        super.reset();
    }

    public scale(factor: number): void {
        this.size *= factor;
    }

    public copy(): Square {
        return new Square(this.ID, this.center.getX(), this.center.getY(), this.size, this.angle);
    }
}