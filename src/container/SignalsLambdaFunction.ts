import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { SignalsServiceFactory } from '../build/SignalsServiceFactory';

export class SignalsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("signals", "Device signals function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-signals', 'controller', 'default', '*', '*'));
        this._factories.add(new SignalsServiceFactory());
    }
}

export const handler = new SignalsLambdaFunction().getHandler();