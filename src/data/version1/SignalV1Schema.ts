import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class SignalV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withOptionalProperty('device_id', TypeCode.String);
        this.withOptionalProperty('time', TypeCode.DateTime);

        this.withRequiredProperty('type', TypeCode.Integer);
        this.withOptionalProperty('sent', TypeCode.Boolean);
        this.withOptionalProperty('lock_until', TypeCode.Long);
    }
}
