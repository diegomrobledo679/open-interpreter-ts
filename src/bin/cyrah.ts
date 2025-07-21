#!/usr/bin/env node
import dotenv from 'dotenv';
import readline from 'readline';
import minimist from 'minimist';
import { executeLaunchUITool, executePlaySpotifyTool } from '../tools/SystemIntegrationTool.js';
import { executeSendEmailTool } from '../tools/EmailTool.js';
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
  'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE',
  'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM',
  'EMAIL_TO', 'EMAIL_SUBJECT', 'EMAIL_TEXT'
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

async function showMenu(cliPort?: string): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (query: string) => new Promise<string>((res) => rl.question(query, res));

  while (true) {
    console.log('Cyrah Menu');
    console.log('1) Start CLI Interpreter');
    console.log('2) Start Web Interface');
    console.log('3) Start CLI and Web Interface');
    console.log('4) Launch UI');
    console.log('5) Start All (CLI, Web, UI)');
    console.log('6) Set Environment Variables');
    console.log('7) Play Spotify Track/Playlist');
    console.log('8) Send Email');
    console.log('9) List Available Tools');
    console.log('10) Exit');

    const choice = (await ask('Choose an option: ')).trim();

    if (choice === '1') {
      rl.close();
      await main();
      return;
    } else if (choice === '2') {
      if (cliPort) process.env.PORT = String(cliPort);
      await import('../server.js');
      console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
    } else if (choice === '3') {
      if (cliPort) process.env.PORT = String(cliPort);
      await import('../server.js');
      console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
      rl.close();
      await main();
      return;
    } else if (choice === '4') {
      const msg = await executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
      console.log(msg);
    } else if (choice === '5') {
      if (cliPort) process.env.PORT = String(cliPort);
      await import('../server.js');
      console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
      process.env.DISPLAY_MODE = 'gui';
      rl.close();
      await main();
      return;
    } else if (choice === '6') {
      await manageEnvVariables(ask);
    } else if (choice === '7') {
      const uri = await ask('Enter Spotify URI or URL: ');
      const msg = await executePlaySpotifyTool({ uri });
      console.log(msg);
    } else if (choice === '8') {
      const to = await ask('Recipient: ');
      const subject = await ask('Subject: ');
      const text = await ask('Message: ');
      const msg = await executeSendEmailTool({ to, subject, text });
      console.log(msg);
    } else if (choice === '9') {
      const interpreter = new Interpreter();
      registerAllTools(interpreter);
      interpreter.tools.forEach(t =>
        console.log(`${t.function.name} - ${t.function.description}`)
      );
    } else if (choice === '10') {
      rl.close();
      return;
    }
  }
}

async function run(): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['env', 'spotify', 'send-email', 'port'],
    boolean: ['menu', 'help', 'web', 'gui', 'auto', 'list-tools'],
    alias: {
      e: 'env',
      h: 'help',
      w: 'web',
      g: 'gui',
      a: 'auto',
      s: 'spotify',
      E: 'send-email',
      l: 'list-tools',
      p: 'port'
    }
  });

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
  --env,  -e KEY=VAL  Set environment variable (repeatable)
  --help, -h          Show this help message
  --list-tools, -l    List all available tools and exit

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

  if (argv.auto || autoEnv) {
    argv.web = true;
  }

  const skipMenu = process.env.NO_MENU === 'true';
  const hasNoArgs = process.argv.slice(2).length === 0;
  const showMenuFlag = argv.menu === true || (hasNoArgs && argv.menu !== false && !skipMenu);

  if (showMenuFlag) {
    await showMenu(argv.port ? String(argv.port) : undefined);
    return;
  }

  if (argv.web) {
    if (argv.port) process.env.PORT = String(argv.port);
    await import('../server.js');
    console.log(`Web interface started. Open http://localhost:${process.env.PORT || 3000} in your browser.`);
  }

  if (argv.spotify) {
    const msg = await executePlaySpotifyTool({ uri: argv.spotify });
    console.log(msg);
  }

  if (argv['send-email']) {
    const [to, subject, text] = (argv['send-email'] as string).split(';');
    if (to && subject && text) {
      const msg = await executeSendEmailTool({ to, subject, text });
      console.log(msg);
    } else {
      console.error('Invalid --send-email format. Use "to;subject;text"');
    }
  }
  if (argv["list-tools"]) {
    const interpreter = new Interpreter();
    registerAllTools(interpreter);
    interpreter.tools.forEach(t => console.log(`${t.function.name} - ${t.function.description}`));
    return;
  }

  await main();
}

run().catch(err => {
  console.error(`Error: ${err.message}`);
});
