import Server from './server.js';
declare interface DesktopyInterface {
    constructor(options: launchOptions): Promise<Desktopy>;
}
export default class Desktopy implements DesktopyInterface {
    server: Server;
    defaultOptions: launchOptions;
    ['constructor'](options: launchOptions): Promise<Desktopy>;
    open(options: launchOptions): Promise<Desktopy>;
}
export {};
