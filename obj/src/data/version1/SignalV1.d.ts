import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class SignalV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    device_id?: string;
    time?: Date;
    type: number;
    sent?: boolean;
    lock_until?: number;
}
