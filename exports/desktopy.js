import DesktopyServer from './server.js';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { platform, userInfo } from 'os';
import 'url';
import 'fs';
import 'zlib';
import 'stream';
import 'http';

class Desktopy {
    server;
    url;
    defaultOptions = {
        hostPort: 5555,
        hostRoot: 'app',
        autoStart: true,
        hostDefaults: ['chrome', 'edge', 'safari']
    };
    constructor(options) {
        options = { ...this.defaultOptions, ...options };
        if (options.autoStart)
            return this.open(options);
    }
    async open(options) {
        this.package = JSON.parse(((await readFile('./package.json')).toString()));
        this.name = this.package.appName || this.package.name;
        console.log(this.name);
        this.server = new DesktopyServer(options);
        const osPlatform = platform();
        const homedir = userInfo().homedir;
        this.url = `http://localhost:${String(options.hostPort)}`;
        console.log(`opening ${this.url}`);
        let command;
        if (osPlatform === 'darwin') {
            const root = join(homedir, 'Applications/Chrome\ Apps.localized');
            const apps = await readdir(root);
            console.log(apps);
            // if (apps.includes(`${this.name}.app`)) {
            //   hasApp = true
            //   command = `open "${join(root, `${this.name}.app/Contents/MacOS/app_mode_loader`)}"`
            // }
        }
        {
            if (osPlatform === 'win32') {
                command = `start microsoft-edge:${this.url} --kiosk --chrome-frame`;
            }
            else if (osPlatform === 'darwin') {
                command = `open -a "Google Chrome" ${this.url}  -n --args --app ${this.url} --kiosk --chrome-frame`;
            }
            else {
                command = `google-chrome --kiosk --chrome-frame --no-sandbox ${this.url}`;
            }
        }
        console.log(`executing command: ${command}`);
        exec(command);
        return this;
    }
}

export { Desktopy as default };
