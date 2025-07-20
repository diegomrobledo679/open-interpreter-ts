#!/usr/bin/env node
import dotenv from 'dotenv';
import readline from 'readline';
import minimist from 'minimist';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
import { main } from '../main.js';

dotenv.config();

async function showMenu(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (query: string) => new Promise<string>((res) => rl.question(query, res));

  while (true) {
    console.log('Cyrah Menu');
    console.log('1) Start Web Interface');
    console.log('2) Launch UI');
    console.log('3) Start CLI Interpreter');
    console.log('4) Set Environment Variables');
    console.log('5) Exit');

    const choice = (await ask('Choose an option: ')).trim();

    if (choice === '1') {
      await import('../server.js');
      console.log('Web interface started. Open http://localhost:3000 in your browser.');
    } else if (choice === '2') {
      const msg = await executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
      console.log(msg);
    } else if (choice === '3') {
      rl.close();
      await main();
      return;
    } else if (choice === '4') {
      while (true) {
        const pair = (await ask('Enter KEY=VALUE (blank to finish): ')).trim();
        if (!pair) break;
        const [key, ...rest] = pair.split('=');
        if (key && rest.length > 0) {
          process.env[key] = rest.join('=');
        }
      }
    } else if (choice === '5') {
      rl.close();
      return;
    }
  }
}

async function run(): Promise<void> {
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
    await showMenu();
    return;
  }

  await main();
}

run().catch(err => {
  console.error(`Error: ${err.message}`);
});
