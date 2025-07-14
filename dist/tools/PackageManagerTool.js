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
import * as path from "path"; // Added import
import * as fs from "fs"; // Added import
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
export const npmInstallTool = {
    type: "function",
    function: {
        name: "npmInstall",
        description: "Installs an npm package globally or locally.",
        parameters: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "The name of the npm package to install.",
                },
                global: {
                    type: "boolean",
                    description: "Optional: If true, installs the package globally. Defaults to false.",
                    nullable: true,
                },
            },
            required: ["packageName"],
        },
    },
};
export function executeNpmInstallTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const installCommand = args.global ? `npm install -g ${args.packageName}` : `npm install ${args.packageName}`;
        return executeShellCommand(installCommand);
    });
}
export const pipInstallTool = {
    type: "function",
    function: {
        name: "pipInstall",
        description: "Installs a Python package using pip.",
        parameters: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "The name of the Python package to install.",
                },
            },
            required: ["packageName"],
        },
    },
};
export function executePipInstallTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const pythonExecutable = path.join(process.cwd(), '.venv', 'bin', 'python');
        const pipCommand = fs.existsSync(pythonExecutable) ? `${pythonExecutable} -m pip install ${args.packageName}` : `pip install ${args.packageName}`;
        return executeShellCommand(pipCommand);
    });
}
export const aptInstallTool = {
    type: "function",
    function: {
        name: "aptInstall",
        description: "Installs a package using apt (for Debian/Ubuntu-based systems). Requires sudo privileges.",
        parameters: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "The name of the package to install.",
                },
            },
            required: ["packageName"],
        },
    },
};
export function executeAptInstallTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (os.platform() !== 'linux') {
            return "Error: apt is only available on Linux systems.";
        }
        return executeShellCommand(`sudo apt-get update && sudo apt-get install -y ${args.packageName}`);
    });
}
export const brewInstallTool = {
    type: "function",
    function: {
        name: "brewInstall",
        description: "Installs a package using Homebrew (for macOS and Linux).",
        parameters: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "The name of the package to install.",
                },
            },
            required: ["packageName"],
        },
    },
};
export function executeBrewInstallTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (os.platform() !== 'darwin' && os.platform() !== 'linux') {
            return "Error: Homebrew is primarily for macOS and Linux.";
        }
        return executeShellCommand(`brew install ${args.packageName}`);
    });
}
export const chocoInstallTool = {
    type: "function",
    function: {
        name: "chocoInstall",
        description: "Installs a package using Chocolatey (for Windows). Requires administrative privileges.",
        parameters: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "The name of the package to install.",
                },
            },
            required: ["packageName"],
        },
    },
};
export function executeChocoInstallTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (os.platform() !== 'win32') {
            return "Error: Chocolatey is only available on Windows systems.";
        }
        return executeShellCommand(`choco install ${args.packageName} -y`);
    });
}
