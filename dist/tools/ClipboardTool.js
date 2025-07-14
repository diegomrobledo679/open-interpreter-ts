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
const readClipboardToolDefinition = {
    type: "function",
    function: {
        name: "readClipboard",
        description: "Reads the current content of the system clipboard.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
};
function executeReadClipboardToolFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === 'darwin') {
            command = 'pbpaste';
        }
        else if (os.platform() === 'win32') {
            command = 'powershell.exe -command "Get-Clipboard" ';
        }
        else if (os.platform() === 'linux') {
            command = 'xclip -o -selection clipboard'; // Requires xclip to be installed
        }
        else {
            return "Error: Reading clipboard is not supported on this operating system.";
        }
        return executeShellCommand(command);
    });
}
const writeClipboardToolDefinition = {
    type: "function",
    function: {
        name: "writeClipboard",
        description: "Writes content to the system clipboard.",
        parameters: {
            type: "object",
            properties: {
                content: {
                    type: "string",
                    description: "The text content to write to the clipboard.",
                },
            },
            required: ["content"],
        },
    },
};
function executeWriteClipboardToolFunction(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let command;
        if (os.platform() === 'darwin') {
            command = `echo "${args.content}" | pbcopy`;
        }
        else if (os.platform() === 'win32') {
            command = `powershell.exe -command "Set-Clipboard -Value \"${args.content}\""`;
        }
        else if (os.platform() === 'linux') {
            command = `echo "${args.content}" | xclip -i -selection clipboard`; // Requires xclip to be installed
        }
        else {
            return "Error: Writing to clipboard is not supported on this operating system.";
        }
        return executeShellCommand(command);
    });
}
export { readClipboardToolDefinition as readClipboardTool, executeReadClipboardToolFunction as executeReadClipboardTool, writeClipboardToolDefinition as writeClipboardTool, executeWriteClipboardToolFunction as executeWriteClipboardTool };
