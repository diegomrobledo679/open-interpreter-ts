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
export const getDiskUsageTool = {
    type: "function",
    function: {
        name: "getDiskUsage",
        description: "Retrieves disk usage information for the system or a specific path.",
        parameters: {
            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Optional: The path to check disk usage for. Defaults to the root filesystem.",
                    nullable: true,
                },
            },
            required: [],
        },
    },
};
export function executeGetDiskUsageTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === 'win32') {
            command = `wmic logicaldisk get Caption,FreeSpace,Size /value`;
        }
        else {
            command = `df -h ${args.path || ''}`;
        }
        return executeShellCommand(command);
    });
}
export const getMemoryUsageTool = {
    type: "function",
    function: {
        name: "getMemoryUsage",
        description: "Retrieves detailed memory usage information for the system.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
};
export function executeGetMemoryUsageTool() {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === 'win32') {
            command = `wmic ComputerSystem get TotalPhysicalMemory /value && wmic OS get FreePhysicalMemory /value`;
        }
        else {
            command = `free -h`;
        }
        return executeShellCommand(command);
    });
}
