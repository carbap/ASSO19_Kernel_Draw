import { Command } from '../commands/Command';
import { Expression } from './Expression';

export class ScaleExpression extends Expression {
    constructor(private rootExpression: Expression){ super(); }

    public interpret(context: string): boolean {
        //algures rootExpression.addError()
        //rootExpression.setCommand()
        return false;
    }
}