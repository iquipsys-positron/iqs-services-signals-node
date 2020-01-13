import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { SignalsMongoDbPersistence } from '../persistence/SignalsMongoDbPersistence';
import { SignalsFilePersistence } from '../persistence/SignalsFilePersistence';
import { SignalsMemoryPersistence } from '../persistence/SignalsMemoryPersistence';
import { SignalsController } from '../logic/SignalsController';
import { SignalsHttpServiceV1 } from '../services/version1/SignalsHttpServiceV1';

export class SignalsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-signals", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-signals", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-signals", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-signals", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-signals", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-signals", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(SignalsServiceFactory.MemoryPersistenceDescriptor, SignalsMemoryPersistence);
		this.registerAsType(SignalsServiceFactory.FilePersistenceDescriptor, SignalsFilePersistence);
		this.registerAsType(SignalsServiceFactory.MongoDbPersistenceDescriptor, SignalsMongoDbPersistence);
		this.registerAsType(SignalsServiceFactory.ControllerDescriptor, SignalsController);
		this.registerAsType(SignalsServiceFactory.HttpServiceDescriptor, SignalsHttpServiceV1);
	}
	
}
