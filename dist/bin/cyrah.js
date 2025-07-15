#!/usr/bin/env node
import dotenv from 'dotenv';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';
dotenv.config();
const uiName = process.env.UI_NAME || 'cyrah';
executeLaunchUITool({ uiName }).then(msg => {
    console.log(msg);
});
