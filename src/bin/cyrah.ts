#!/usr/bin/env node
import dotenv from 'dotenv';
import readline from 'readline';
import fs from 'fs';
import minimist from 'minimist';
import { parse } from 'dotenv';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
import { main } from '../main.js';

dotenv.config();

const RELEVANT_ENV_VARS = [
  'LLM_PROVIDER', 'LLM_MODEL', 'LLM_API_KEY', 'LLM_BASE_URL',
  'OPENAI_API_KEY', 'OLLAMA_API_KEY',
  'AUTO_RUN', 'LOOP', 'OFFLINE', 'VERBOSE', 'DEBUG',
  'SAFE_MODE', 'MAX_OUTPUT', 'DISPLAY_MODE', 'UI_NAME'
];

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const data = fs.readFileSync(filePath, 'utf-8');
  const parsed = parse(data);
  for (const [k, v] of Object.entries(parsed)) {
    process.env[k] = v;
  }
}

function saveEnvFile(filePath: string): void {
  const lines: string[] = [];
  for (const key of RELEVANT_ENV_VARS) {
    if (process.env[key]) {
      lines.push(`${key}=${process.env[key]}`);
    }
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
}

async function manageEnvVariables(ask: (q: string) => Promise<string>): Promise<void> {
  console.log('\nCurrent environment variables:');
  for (const key of RELEVANT_ENV_VARS) {
    if (process.env[key]) {
      console.log(`${key}=${process.env[key]}`);
    }
  }

  while (true) {
    const input = (await ask('Enter KEY=VALUE, KEY to unset, :load FILE, :save FILE (blank to finish): ')).trim();
    if (!input) break;
    if (input.startsWith(':load ')) {
      loadEnvFile(input.slice(6));
      console.log('Loaded variables from file.');
      continue;
    }
    if (input.startsWith(':save ')) {
      saveEnvFile(input.slice(6));
      console.log('Saved variables to file.');
      continue;
    }
    if (!input.includes('=')) {
      delete process.env[input];
      console.log(`Unset ${input}`);
    } else {
      const [key, ...rest] = input.split('=');
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
    console.log('6) Load Env File');
    console.log('7) Save Env File');
    console.log('8) Exit');

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
      const file = await ask('Path to env file: ');
      loadEnvFile(file.trim());
    } else if (choice === '7') {
      const file = await ask('Path to save env file: ');
      saveEnvFile(file.trim());
    } else if (choice === '8') {
      rl.close();
      return;
    }
  }
}

async function run(): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['env', 'env-file'],
    boolean: ['menu', 'help', 'web', 'no-menu'],
    alias: { e: 'env', F: 'env-file', h: 'help', w: 'web', n: 'no-menu' }
  });

  if (argv.help) {
    console.log(`Usage: cyrah [options]

Options:
  --menu, -m          Show interactive menu
  --no-menu, -n       Skip the menu and run the CLI directly
  --web,  -w          Start the web interface alongside the CLI
  --env,  -e KEY=VAL  Set environment variable (repeatable)
  --env-file, -F FILE Load environment variables from file
  --help, -h          Show this help message

Any other options are forwarded to the interpreter.`);
    return;
  }

  if (argv['env-file']) {
    loadEnvFile(argv['env-file']);
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
