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
export const createScheduledTaskTool = {
    type: "function",
    function: {
        name: "createScheduledTask",
        description: "Creates a scheduled task or cron job on the system. Platform-dependent.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "A unique name for the scheduled task.",
                },
                command: {
                    type: "string",
                    description: "The command to execute.",
                },
                schedule: {
                    type: "string",
                    description: "The schedule for the task (e.g., 'daily', 'hourly', '@reboot', or cron string for Linux/macOS, or specific time for Windows).",
                },
            },
            required: ["name", "command", "schedule"],
        },
    },
};
export function executeCreateScheduledTaskTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let cmd;
        if (os.platform() === 'linux' || os.platform() === 'darwin') {
            // For Linux/macOS, use cron
            cmd = `(crontab -l 2>/dev/null; echo "${args.schedule} ${args.command}") | crontab -`;
        }
        else if (os.platform() === 'win32') {
            // For Windows, use schtasks
            // This is a simplified example; schtasks is complex.
            cmd = `schtasks /create /tn "${args.name}" /tr "${args.command}" /sc ${args.schedule}`;
        }
        else {
            return "Error: Scheduled tasks are not supported on this operating system.";
        }
        return executeShellCommand(cmd);
    });
}
export const listScheduledTasksTool = {
    type: "function",
    function: {
        name: "listScheduledTasks",
        description: "Lists all scheduled tasks or cron jobs on the system. Platform-dependent.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
};
export function executeListScheduledTasksTool() {
    return __awaiter(this, void 0, void 0, function* () {
        let cmd;
        if (os.platform() === 'linux' || os.platform() === 'darwin') {
            cmd = `crontab -l`;
        }
        else if (os.platform() === 'win32') {
            cmd = `schtasks /query /fo LIST /v`;
        }
        else {
            return "Error: Listing scheduled tasks is not supported on this operating system.";
        }
        return executeShellCommand(cmd);
    });
}
export const deleteScheduledTaskTool = {
    type: "function",
    function: {
        name: "deleteScheduledTask",
        description: "Deletes a scheduled task or cron job by its name. Platform-dependent.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "The name of the scheduled task to delete.",
                },
            },
            required: ["name"],
        },
    },
};
export function executeDeleteScheduledTaskTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let cmd;
        if (os.platform() === 'linux' || os.platform() === 'darwin') {
            // Deleting cron jobs by content is tricky. This is a conceptual approach.
            return "Error: Deleting cron jobs by name is complex and not directly supported by this tool. Manual intervention may be required.";
        }
        else if (os.platform() === 'win32') {
            cmd = `schtasks /delete /tn "${args.name}" /f`; // /f to force delete
        }
        else {
            return "Error: Deleting scheduled tasks is not supported on this operating system.";
        }
        return executeShellCommand(cmd);
    });
}
