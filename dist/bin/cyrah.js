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
function showMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (query) => new Promise((res) => rl.question(query, res));
        while (true) {
            console.log('Cyrah Menu');
            console.log('1) Launch UI');
            console.log('2) Start CLI Interpreter');
            console.log('3) Set Environment Variables');
            console.log('4) Exit');
            const choice = (yield ask('Choose an option: ')).trim();
            if (choice === '1') {
                const msg = yield executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
                console.log(msg);
            }
            else if (choice === '2') {
                rl.close();
                yield main();
                return;
            }
            else if (choice === '3') {
                while (true) {
                    const pair = (yield ask('Enter KEY=VALUE (blank to finish): ')).trim();
                    if (!pair)
                        break;
                    const [key, ...rest] = pair.split('=');
                    if (key && rest.length > 0) {
                        process.env[key] = rest.join('=');
                    }
                }
            }
            else if (choice === '4') {
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
            boolean: ['menu', 'help'],
            alias: { e: 'env', h: 'help' }
        });
        if (argv.help) {
            console.log(`Usage: cyrah [options]

Options:
  --menu, -m          Show interactive menu
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
        if (argv.menu) {
            yield showMenu();
            return;
        }
        yield main();
    });
}
run().catch(err => {
    console.error(`Error: ${err.message}`);
});
