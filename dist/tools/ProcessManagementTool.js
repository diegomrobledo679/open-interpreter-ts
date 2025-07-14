var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec } from "child_process";
import * as os from "os";
// Helper to execute shell commands
const executeShellCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Command failed: ${command}\nError: ${stderr}`);
            }
            else {
                resolve(stdout || stderr || `Command executed successfully: ${command}`);
            }
        });
    });
};
export const terminateProcessTool = {
    type: "function",
    function: {
        name: "terminateProcess",
        description: "Terminates a process by its Process ID (PID). Use with caution.",
        parameters: {
            type: "object",
            properties: {
                pid: {
                    type: "number",
                    description: "The Process ID (PID) of the process to terminate.",
                },
            },
            required: ["pid"],
        },
    },
};
export function executeTerminateProcessTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === 'win32') {
            command = `taskkill /PID ${args.pid} /F`; // /F to force terminate
        }
        else {
            command = `kill ${args.pid}`; // Default kill command
        }
        return executeShellCommand(command);
    });
}
