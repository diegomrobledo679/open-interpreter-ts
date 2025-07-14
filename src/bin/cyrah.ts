#!/usr/bin/env node
import dotenv from 'dotenv';
import { executeLaunchUITool } from '../tools/SystemIntegrationTool.js';

dotenv.config();

executeLaunchUITool({ uiName: 'cyrah' }).then(msg => {
  console.log(msg);
});
