#!/usr/bin/env node
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

async function manageEnvVariables(ask: (q: string) => Promise<string>): Promise<void> {
  console.log('\nCurrent environment variables:');
  for (const key of RELEVANT_ENV_VARS) {
    if (process.env[key]) {
      console.log(`${key}=${process.env[key]}`);
    }
  }

  while (true) {
    const pair = (await ask('Enter KEY=VALUE to set, KEY to unset (blank to finish): ')).trim();
    if (!pair) break;
    if (!pair.includes('=')) {
      delete process.env[pair];
      console.log(`Unset ${pair}`);
    } else {
      const [key, ...rest] = pair.split('=');
      if (key && rest.length > 0) {
        process.env[key] = rest.join('=');
        console.log(`Set ${key}=${process.env[key]}`);
      }
    }
  }
}

async function showMenu(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (query: string) => new Promise<string>((res) => rl.question(query, res));

  while (true) {
    console.log('Cyrah Menu');
    console.log('1) Start CLI Interpreter');
    console.log('2) Start Web Interface');
    console.log('3) Start CLI and Web Interface');
    console.log('4) Launch UI');
    console.log('5) Set Environment Variables');
    console.log('6) Exit');

    const choice = (await ask('Choose an option: ')).trim();

    if (choice === '1') {
      rl.close();
      await main();
      return;
    } else if (choice === '2') {
      await import('../server.js');
      console.log('Web interface started. Open http://localhost:3000 in your browser.');
    } else if (choice === '3') {
      await import('../server.js');
      console.log('Web interface started. Open http://localhost:3000 in your browser.');
      rl.close();
      await main();
      return;
    } else if (choice === '4') {
      const msg = await executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
      console.log(msg);
    } else if (choice === '5') {
      await manageEnvVariables(ask);
    } else if (choice === '6') {
      rl.close();
      return;
    }
  }
}

async function run(): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['env'],
    boolean: ['menu', 'help', 'web', 'noMenu', 'gui', 'auto'],
    alias: { e: 'env', h: 'help', w: 'web', g: 'gui', a: 'auto' }
  });

  if (argv.help) {
    console.log(`Usage: cyrah [options]

Options:
  --menu, -m          Show interactive menu
  --web,  -w          Start the web interface alongside the CLI
  --gui,  -g          Open the graphical interface on start
  --no-menu           Skip automatic menu when no arguments are passed
  --auto, -a          Start CLI, web, and GUI automatically
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

  const autoEnv = process.env.AUTO_START === 'true';
  const webEnv = process.env.START_WEB === 'true';
  const guiEnv = process.env.START_GUI === 'true';

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

  if (argv.auto || autoEnv) {
    argv.web = true;
  }

  const skipMenu = process.env.NO_MENU === 'true';
  const hasNoArgs = process.argv.slice(2).length === 0;

  if (argv.menu || (hasNoArgs && !argv.noMenu && !skipMenu)) {
    await showMenu();
    return;
  }

  if (argv.web) {
    await import('../server.js');
    console.log('Web interface started. Open http://localhost:3000 in your browser.');
  }

  await main();
}

run().catch(err => {
  console.error(`Error: ${err.message}`);
});
