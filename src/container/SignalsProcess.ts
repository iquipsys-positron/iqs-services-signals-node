import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { SignalsServiceFactory } from '../build/SignalsServiceFactory';

export class SignalsProcess extends ProcessContainer {

    public constructor() {
        super("signals", "Device signals microservice");
        this._factories.add(new SignalsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
