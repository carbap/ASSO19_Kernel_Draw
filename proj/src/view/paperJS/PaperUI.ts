import { UI } from '../UI';
import { PaperScope } from 'paper';
import { PaperFactory } from './PaperFactory';
import { Shape } from '../../model/shapes/Shape';
import { Problem } from '../../model/Problem';
import { Path, Point } from 'paper';

export class PaperUI extends UI {
        
    private drawScope: PaperScope;
    private problemScope: PaperScope;
    private currentProblem: HTMLLabelElement;

    private paperShapeFactory: PaperFactory = new PaperFactory();

    constructor(drawingCanvas: HTMLCanvasElement, problemCanvas: HTMLCanvasElement, currentProblem: HTMLLabelElement,
        compileButton: HTMLElement, nextButton: HTMLElement, runButton: HTMLElement, nextProblemButton: HTMLElement,
        infoDiv: HTMLElement, coresText: Array<HTMLElement>) {
        super(drawingCanvas, problemCanvas, compileButton, nextButton, runButton, nextProblemButton, infoDiv, coresText);

        this.drawScope = new PaperScope();
        this.problemScope = new PaperScope();
        this.drawScope.setup(this.drawingCanvas);
        this.problemScope.setup(this.problemCanvas);
        this.currentProblem = currentProblem;
    }
 
    public async compare(): Promise<boolean> {
        await this.buildSuspense();
        var drawBytes = this.drawingCanvas.getContext('2d').getImageData(0, 0, this.drawingCanvas.width, this.drawingCanvas.height).data;
        var problemBytes = this.problemCanvas.getContext('2d').getImageData(0, 0, this.problemCanvas.width, this.problemCanvas.height).data;

        if(this.drawingCanvas.width != this.problemCanvas.width || this.drawingCanvas.height != this.problemCanvas.height || drawBytes.length != problemBytes.length){
            return false;
        }

        for(var i = 0; i < drawBytes.length; i++){
            if(!this.similarColor(drawBytes[i], problemBytes[i]))
                return false;
        }

        return true;
    }

    public draw(shapeList : Shape[], isDrawCanvas: boolean): void {
        //clear canvas
        if(isDrawCanvas)
        {
            this.drawScope.project.clear();
            this.drawGrids(this.drawingCanvas);
        }  
        else
        {
            this.problemScope.project.clear();
            this.drawGrids(this.problemCanvas);
        }
        
        for(var i = 0; i < shapeList.length; i++) {
            this.paperShapeFactory.createPaperShape(shapeList[i]);
        }
    }

    public drawGrids(canvas: HTMLCanvasElement){
        var unit = 50; // size of each square of the grid is fixed
        paper.setup(canvas);

        var num_squares_x = Math.floor(canvas.width/unit);
        var num_squares_y = Math.floor(canvas.height/unit);
        var padding_x = (canvas.width - unit*num_squares_x)/2;
        var padding_y = (canvas.height - unit*num_squares_y)/2
        
        var path;
        var start;
    
        for(var i = 0; i < num_squares_x + 1; i++){
            path = new Path();
            path.strokeColor = 'grey';
            path.strokeWidth = 1;
            start = new Point(padding_x + unit*i, padding_y);
            path.moveTo(start);
            path.lineTo(start.add(new Point(0, num_squares_y*unit)));
        }
    
        for(var i = 0; i < num_squares_y + 1; i++){
            path = new Path();
            path.strokeColor = 'grey';
            path.strokeWidth = 1;
            start = new Point(padding_x, padding_y + unit*i);
            path.moveTo(start);
            path.lineTo(start.add(new Point(num_squares_x*unit, 0)));
        }
    }

    public updateProblem(problemIterator: number, problems: Array<Problem>){
        this.currentProblem.innerText = "Problem " + (problemIterator+1) + "/" + problems.length;
        this.drawProblem(problems[problemIterator]);
    }

    public similarColor(color1: number, color2: number){
        var diff = Math.abs(color1-color2)
        return diff <= 2;
    }
}