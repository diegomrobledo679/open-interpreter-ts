#!/usr/bin/env node
import dotenv from 'dotenv';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
dotenv.config();
const argUIName = process.argv[2];
const uiName = argUIName || process.env.UI_NAME || 'cyrah';
executeLaunchUITool({ uiName }).then(msg => {
    console.log(msg);
});
