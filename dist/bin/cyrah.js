#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import readline from 'readline';
import minimist from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeLaunchUITool, executePlaySpotifyTool } from '../tools/SystemIntegrationTool.js';
import { executeSendEmailTool } from '../tools/EmailTool.js';
import { executeListLanguagesTool } from '../tools/LanguageTool.js';
import { Interpreter } from "../core/Interpreter.js";
import { registerAllTools } from "../tools/register.js";
import { main } from '../main.js';
dotenv.config();
const RELEVANT_ENV_VARS = [
    'LLM_PROVIDER', 'LLM_MODEL', 'LLM_API_KEY', 'LLM_BASE_URL',
    'OPENAI_API_KEY', 'OLLAMA_API_KEY',
    'AUTO_RUN', 'LOOP', 'OFFLINE', 'VERBOSE', 'DEBUG',
    'SAFE_MODE', 'MAX_OUTPUT', 'DISPLAY_MODE', 'UI_NAME',
    'NO_MENU', 'START_WEB', 'START_GUI', 'AUTO_START', 'PORT',
    'SPOTIFY_URI', 'LIST_TOOLS',
    'LIST_LANGUAGES',
    'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE',
    'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM',
    'EMAIL_TO', 'EMAIL_SUBJECT', 'EMAIL_TEXT',
    'ENV_FILE'
];
function manageEnvVariables(ask) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\nCurrent environment variables:');
        for (const key of RELEVANT_ENV_VARS) {
            if (process.env[key]) {
                console.log(`${key}=${process.env[key]}`);
            }
        }
        while (true) {
            const pair = (yield ask('Enter KEY=VALUE to set, KEY to unset (blank to finish): ')).trim();
            if (!pair)
                break;
            if (!pair.includes('=')) {
                delete process.env[pair];
                console.log(`Unset ${pair}`);
            }
            else {
                const [key, ...rest] = pair.split('=');
                if (key && rest.length > 0) {
                    process.env[key] = rest.join('=');
                    console.log(`Set ${key}=${process.env[key]}`);
                }
            }
        }
    });
}
function showMenu(cliPort) {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (query) => new Promise((res) => rl.question(query, res));
        while (true) {
            console.log('Cyrah Menu');
            console.log('1) Start CLI Interpreter');
            console.log('2) Start Web Interface');
            console.log('3) Start CLI and Web Interface');
            console.log('4) Launch UI');
            console.log('5) Start All (CLI, Web, UI)');
            console.log('6) Set Environment Variables');
            console.log('7) Load Environment File');
            console.log('8) Play Spotify Track/Playlist');
            console.log('9) Send Email');
            console.log('10) List Available Tools');
            console.log('11) List Supported Languages');
            console.log('12) Exit');
            const choice = (yield ask('Choose an option: ')).trim();
            if (choice === '1') {
                rl.close();
                yield main();
                return;
            }
            else if (choice === '2') {
                if (cliPort)
                    process.env.PORT = String(cliPort);
                yield import('../server.js');
                console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
            }
            else if (choice === '3') {
                if (cliPort)
                    process.env.PORT = String(cliPort);
                yield import('../server.js');
                console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
                rl.close();
                yield main();
                return;
            }
            else if (choice === '4') {
                const msg = yield executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
                console.log(msg);
            }
            else if (choice === '5') {
                if (cliPort)
                    process.env.PORT = String(cliPort);
                yield import('../server.js');
                console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
                process.env.DISPLAY_MODE = 'gui';
                rl.close();
                yield main();
                return;
            }
            else if (choice === '6') {
                yield manageEnvVariables(ask);
            }
            else if (choice === '7') {
                const file = yield ask('Path to .env file: ');
                try {
                    dotenv.config({ path: path.resolve(file) });
                    console.log(`Loaded environment variables from ${file}`);
                }
                catch (err) {
                    console.error(`Failed to load env file: ${err.message}`);
                }
            }
            else if (choice === '8') {
                try {
                    const uri = yield ask('Enter Spotify URI or URL: ');
                    const msg = yield executePlaySpotifyTool({ uri });
                    console.log(msg);
                }
                catch (err) {
                    console.error(err.message);
                }
            }
            else if (choice === '9') {
                try {
                    const to = yield ask('Recipient: ');
                    const subject = yield ask('Subject: ');
                    const text = yield ask('Message: ');
                    const msg = yield executeSendEmailTool({ to, subject, text });
                    console.log(msg);
                }
                catch (err) {
                    console.error(err.message);
                }
            }
            else if (choice === '10') {
                const interpreter = new Interpreter();
                registerAllTools(interpreter);
                interpreter.tools.forEach(t => console.log(`${t.function.name} - ${t.function.description}`));
            }
            else if (choice === '11') {
                const langs = yield executeListLanguagesTool();
                console.log(langs);
            }
            else if (choice === '12') {
                rl.close();
                return;
            }
        }
    });
}
export function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const argv = minimist(process.argv.slice(2), {
            string: ['env', 'spotify', 'send-email', 'port', 'env-file'],
            boolean: ['menu', 'help', 'web', 'gui', 'auto', 'list-tools', 'list-languages'],
            alias: {
                e: 'env',
                h: 'help',
                w: 'web',
                g: 'gui',
                a: 'auto',
                s: 'spotify',
                E: 'send-email',
                l: 'list-tools',
                L: 'list-languages',
                p: 'port',
                f: 'env-file'
            }
        });
        const envFile = argv['env-file'] || process.env.ENV_FILE;
        if (envFile) {
            try {
                dotenv.config({ path: path.resolve(envFile) });
            }
            catch (err) {
                console.error(`Failed to load env file ${envFile}: ${err.message}`);
            }
        }
        if (argv.help) {
            console.log(`Usage: cyrah [options]

Options:
  --menu, -m          Show interactive menu
  --web,  -w          Start the web interface alongside the CLI
  --gui,  -g          Open the graphical interface on start
  --no-menu           Skip automatic menu when no arguments are passed
  --auto, -a          Start CLI, web, and GUI automatically
  --spotify, -s URI   Play a Spotify URI or URL
  --send-email, -E STR Send an email (format: to;subject;text)
  --port, -p NUM      Port for the web interface
  --env-file, -f PATH Load environment variables from file
  --env,  -e KEY=VAL  Set environment variable (repeatable)
  --help, -h          Show this help message
  --list-tools, -l    List all available tools and exit
  --list-languages, -L List supported programming languages and exit

Any other options are forwarded to the interpreter.`);
            return;
        }
        if (argv.env) {
            const envs = Array.isArray(argv.env) ? argv.env : [argv.env];
            for (const pair of envs) {
                const [key, ...rest] = pair.split('=');
                if (key && rest.length > 0) {
                    process.env[key] = rest.join('=');
                }
            }
        }
        const spotifyEnv = process.env.SPOTIFY_URI;
        const emailToEnv = process.env.EMAIL_TO;
        const emailSubjectEnv = process.env.EMAIL_SUBJECT;
        const emailTextEnv = process.env.EMAIL_TEXT;
        const portEnv = process.env.PORT;
        const autoEnv = process.env.AUTO_START === 'true';
        const webEnv = process.env.START_WEB === 'true';
        const guiEnv = process.env.START_GUI === 'true';
        const listToolsEnv = process.env.LIST_TOOLS === "true";
        const listLanguagesEnv = process.env.LIST_LANGUAGES === "true";
        if (!argv.spotify && spotifyEnv) {
            argv.spotify = spotifyEnv;
        }
        if (!argv['send-email'] && emailToEnv && emailSubjectEnv && emailTextEnv) {
            argv['send-email'] = `${emailToEnv};${emailSubjectEnv};${emailTextEnv}`;
        }
        if (!argv.port && portEnv) {
            argv.port = portEnv;
        }
        if (autoEnv) {
            argv.auto = true;
        }
        if (webEnv) {
            argv.web = true;
        }
        if (guiEnv) {
            argv.gui = true;
        }
        if (argv.gui || argv.auto || guiEnv || autoEnv) {
            process.env.DISPLAY_MODE = 'gui';
        }
        if (!argv["list-tools"] && listToolsEnv) {
            argv["list-tools"] = true;
        }
        if (!argv["list-languages"] && listLanguagesEnv) {
            argv["list-languages"] = true;
        }
        if (argv.auto || autoEnv) {
            argv.web = true;
        }
        const skipMenu = process.env.NO_MENU === 'true';
        const hasNoArgs = process.argv.slice(2).length === 0;
        const showMenuFlag = argv.menu === true || (hasNoArgs && argv.menu !== false && !skipMenu);
        if (showMenuFlag) {
            yield showMenu(argv.port ? String(argv.port) : undefined);
            return;
        }
        if (argv.web) {
            if (argv.port)
                process.env.PORT = String(argv.port);
            yield import('../server.js');
            console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
        }
        if (argv.spotify) {
            const msg = yield executePlaySpotifyTool({ uri: argv.spotify });
            console.log(msg);
        }
        if (argv['send-email']) {
            const [to, subject, text] = argv['send-email'].split(';');
            if (to && subject && text) {
                const msg = yield executeSendEmailTool({ to, subject, text });
                console.log(msg);
            }
            else {
                console.error('Invalid --send-email format. Use "to;subject;text"');
            }
        }
        if (argv["list-tools"]) {
            const interpreter = new Interpreter();
            registerAllTools(interpreter);
            interpreter.tools.forEach(t => console.log(`${t.function.name} - ${t.function.description}`));
            return;
        }
        if (argv["list-languages"]) {
            const langs = yield executeListLanguagesTool();
            console.log(langs);
            return;
        }
        yield main();
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    run().catch(err => {
        console.error(`Error: ${err.message}`);
    });
}
