#!/usr/bin/env node
import dotenv from 'dotenv';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
dotenv.config();
const argUIName = process.argv[2];
const argUIArgs = process.argv[3];
const uiName = argUIName || process.env.UI_NAME || 'cyrah';
const uiArgs = argUIArgs || process.env.UI_ARGS;
executeLaunchUITool({ uiName, uiArgs }).then(msg => {
    console.log(msg);
});
