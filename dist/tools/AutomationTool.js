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
import * as fs from "fs";
import * as os from "os";
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
export const createScriptFileTool = {
    type: "function",
    function: {
        name: "createScriptFile",
        description: "Creates a new script file with the specified content and makes it executable.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path where the script file will be created.",
                },
                content: { type: "string", description: "The content of the script." },
                language: {
                    type: "string",
                    description: "Optional: The language of the script (e.g., 'bash', 'python'). Used for shebang. Defaults to 'bash'.",
                    default: "bash",
                    nullable: true,
                },
            },
            required: ["filePath", "content"],
        },
    },
};
export function executeCreateScriptFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let shebang = "";
            if (args.language === "python") {
                shebang = "#!/usr/bin/env python\n";
            }
            else if (args.language === "bash") {
                shebang = "#!/bin/bash\n";
            }
            fs.writeFileSync(args.filePath, shebang + args.content, "utf-8");
            fs.chmodSync(args.filePath, "755");
            return `Script file ${args.filePath} created and made executable.`;
        }
        catch (error) {
            return `Error creating script file: ${error.message}`;
        }
    });
}
export const executeScriptFileTool = {
    type: "function",
    function: {
        name: "executeScriptFile",
        description: "Executes a script file with a specified interpreter or directly if executable.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the script file to execute.",
                },
                interpreter: {
                    type: "string",
                    description: "Optional: The interpreter to use (e.g., 'python', 'node', 'bash'). If omitted, attempts to execute directly.",
                    nullable: true,
                },
                args: {
                    type: "array",
                    items: { type: "string" },
                    description: "Optional: An array of string arguments for the script.",
                    nullable: true,
                },
            },
            required: ["filePath"],
        },
    },
};
export function executeExecuteScriptFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (args.interpreter) {
            command = `${args.interpreter} ${args.filePath}`;
        }
        else {
            command = args.filePath;
        }
        if (args.args && args.args.length > 0) {
            command += ` ${args.args.join(" ")}`;
        }
        try {
            const output = yield executeShellCommand(command);
            return `Script executed successfully:\n${output}`;
        }
        catch (error) {
            return `Error executing script: ${error.message}`;
        }
    });
}
export const scheduleScriptTool = {
    type: "function",
    function: {
        name: "scheduleScript",
        description: "Schedules a script to run at a specific time or interval using the system's scheduler (e.g., cron on Linux/macOS, Task Scheduler on Windows).",
        parameters: {
            type: "object",
            properties: {
                scriptPath: {
                    type: "string",
                    description: "The path to the script file to schedule.",
                },
                schedule: {
                    type: "string",
                    description: "The schedule string (e.g., cron string '0 0 * * *' for daily, or Windows Task Scheduler compatible string).",
                },
                name: {
                    type: "string",
                    description: "A unique name for the scheduled task.",
                },
            },
            required: ["scriptPath", "schedule", "name"],
        },
    },
};
export function executeScheduleScriptTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === "win32") {
            command = `schtasks /create /tn "${args.name}" /tr "${args.scriptPath}" /sc ONCE /st ${args.schedule}`;
        }
        else if (os.platform() === "linux" || os.platform() === "darwin") {
            command = `(crontab -l 2>/dev/null; echo "${args.schedule} ${args.scriptPath}") | crontab -`;
        }
        else {
            return "Error: Scheduling scripts is not supported on this operating system.";
        }
        try {
            const output = yield executeShellCommand(command);
            return `Script '${args.scriptPath}' scheduled successfully as '${args.name}':\n${output}`;
        }
        catch (error) {
            return `Error scheduling script: ${error.message}`;
        }
    });
}
