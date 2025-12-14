import { Connection } from './connection.js';
export declare class LiveReloadConnection extends Connection {
    webSocket?: WebSocket;
    constructor(url: string);
    onReload(_strategy: string): void;
    handleMessage(msg: any): void;
    handleError(msg: any): void;
}
