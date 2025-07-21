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
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
import { main } from '../main.js';
dotenv.config();
const RELEVANT_ENV_VARS = [
    'LLM_PROVIDER', 'LLM_MODEL', 'LLM_API_KEY', 'LLM_BASE_URL',
    'OPENAI_API_KEY', 'OLLAMA_API_KEY',
    'AUTO_RUN', 'LOOP', 'OFFLINE', 'VERBOSE', 'DEBUG',
    'SAFE_MODE', 'MAX_OUTPUT', 'DISPLAY_MODE', 'UI_NAME'
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
function showMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (query) => new Promise((res) => rl.question(query, res));
        while (true) {
            console.log('Cyrah Menu');
            console.log('1) Start CLI Interpreter');
            console.log('2) Start Web Interface');
            console.log('3) Start CLI and Web Interface');
            console.log('4) Launch UI');
            console.log('5) Set Environment Variables');
            console.log('6) Exit');
            const choice = (yield ask('Choose an option: ')).trim();
            if (choice === '1') {
                rl.close();
                yield main();
                return;
            }
            else if (choice === '2') {
                yield import('../server.js');
                console.log('Web interface started. Open http://localhost:3000 in your browser.');
            }
            else if (choice === '3') {
                yield import('../server.js');
                console.log('Web interface started. Open http://localhost:3000 in your browser.');
                rl.close();
                yield main();
                return;
            }
            else if (choice === '4') {
                const msg = yield executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
                console.log(msg);
            }
            else if (choice === '5') {
                yield manageEnvVariables(ask);
            }
            else if (choice === '6') {
                rl.close();
                return;
            }
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const argv = minimist(process.argv.slice(2), {
            string: ['env'],
            boolean: ['menu', 'help', 'web', 'no-menu'],
            alias: { e: 'env', h: 'help', w: 'web', n: 'no-menu' }
        });
        if (argv.help) {
            console.log(`Usage: cyrah [options]

Options:
  --menu, -m          Show interactive menu
  --no-menu, -n       Skip the menu and run the CLI directly
  --web,  -w          Start the web interface alongside the CLI
  --env,  -e KEY=VAL  Set environment variable (repeatable)
  --help, -h          Show this help message

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
        const noArgs = process.argv.slice(2).length === 0;
        if (argv.menu || (noArgs && !argv['no-menu'])) {
            yield showMenu();
            return;
        }
        if (argv.web) {
            yield import('../server.js');
            console.log('Web interface started. Open http://localhost:3000 in your browser.');
        }
        yield main();
    });
}
run().catch(err => {
    console.error(`Error: ${err.message}`);
});
