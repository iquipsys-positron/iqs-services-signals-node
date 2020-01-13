import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class SignalsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/signals');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-signals', 'controller', 'default', '*', '1.0'));
    }
}