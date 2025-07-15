#!/usr/bin/env node
import dotenv from 'dotenv';
import readline from 'readline';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
import { main } from '../main.js';

dotenv.config();

async function showMenu(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('Cyrah Menu');
  console.log('1) Launch UI');
  console.log('2) Start CLI Interpreter');
  console.log('3) Exit');

  return new Promise((resolve) => {
    rl.question('Choose an option: ', async (answer) => {
      rl.close();
      const choice = answer.trim();
      if (choice === '1') {
        const msg = await executeLaunchUITool({ uiName: process.env.UI_NAME || 'cyrah' });
        console.log(msg);
      } else if (choice === '2') {
        await main();
      }
      resolve();
    });
  });
}

showMenu().catch(err => {
  console.error(`Error: ${err.message}`);
});
