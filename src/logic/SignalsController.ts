let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';

import { IMqttGatewayClientV1 } from 'iqs-clients-mqttgateway-node';

import { SignalV1 } from '../data/version1/SignalV1';
import { ISignalsPersistence } from '../persistence/ISignalsPersistence';
import { ISignalsController } from './ISignalsController';
import { SignalsCommandSet } from './SignalsCommandSet';

export class SignalsController implements  IConfigurable, IReferenceable, ICommandable, ISignalsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-signals:persistence:*:*:1.0',
        'dependencies.mqttgateway', 'iqs-services-mqttgateway:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(SignalsController._defaultConfig);
    private _persistence: ISignalsPersistence;
    private _mqttGatewayClient: IMqttGatewayClientV1;
    private _commandSet: SignalsCommandSet;
    private _lockDuration: number = 5000;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._lockDuration = config.getAsIntegerWithDefault('options.lock_duration', this._lockDuration);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ISignalsPersistence>('persistence');
        this._mqttGatewayClient = this._dependencyResolver.getOneOptional<IMqttGatewayClientV1>('mqttgateway');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new SignalsCommandSet(this);
        return this._commandSet;
    }
    
    public getSignals(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<SignalV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public sendSignal(correlationId: string, signal: SignalV1, 
        callback: (err: any, signal: SignalV1) => void): void {
            
        signal.time = new Date();
        signal.sent = false;
        signal.lock_until = 0;

        async.series([
            // Send to MQTT gateway
            (callback) => {
                if (this._mqttGatewayClient == null) {
                    callback();
                } else if (signal.device_id) {
                    this._mqttGatewayClient.sendSignal(
                        correlationId, signal.org_id, signal.device_id,
                        signal.type, signal.time.getTime() / 1000,
                        (err, result) => {
                            signal.sent = !!result;
                            callback(err);
                        }
                    );
                } else {
                    this._mqttGatewayClient.broadcastSignal(
                        correlationId, signal.org_id,
                        signal.type, signal.time.getTime() / 1000,
                        (err, result) => {
                            signal.sent = !!result;
                            callback(err);
                        }
                    );
                }
            },
            (callback) => {
                // Save the signal
                this._persistence.create(correlationId, signal, (err, data) => {
                    signal = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? signal : null);
        });
    }

    public lockSignal(correlationId: string, signal_id: string, 
        callback: (err: any, result: boolean) => void): void {
        this._persistence.lock(correlationId, signal_id, this._lockDuration, callback);
    }

    public markSignalSent(correlationId: string, signal_id: string, 
        callback: (err: any, result: boolean) => void): void {
        let data = AnyValueMap.fromTuples(
            'sent', true,
            'lock_until', 0
        );

        this._persistence.updatePartially(
            correlationId, signal_id, data,
            (err, signal) => {
                let result = signal && signal.sent;
                callback(err, result);
            }
        );
    }
    
    public deleteSignalById(correlationId: string, id: string,
        callback: (err: any, signal: SignalV1) => void): void {  
        this._persistence.deleteById(correlationId, id, callback);
    }

}
