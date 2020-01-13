import { IStringIdentifiable } from 'pip-services3-commons-node';

export class SignalV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public device_id?: string;
    public time?: Date;

    public type: number;
    public sent?: boolean;
    public lock_until?: number;
}