import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { SignalsMemoryPersistence } from './SignalsMemoryPersistence';
import { SignalV1 } from '../data/version1/SignalV1';
export declare class SignalsFilePersistence extends SignalsMemoryPersistence {
    protected _persister: JsonFilePersister<SignalV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
