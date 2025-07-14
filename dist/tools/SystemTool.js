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
export const systemInfoTool = {
    type: "function",
    function: {
        name: "getSystemInfo",
        description: "Retrieves various system information.",
        parameters: {
            type: "object",
            properties: {
                infoType: {
                    type: "string",
                    enum: ["platform", "arch", "hostname", "uptime", "totalmem", "freemem", "cpus", "networkInterfaces"],
                    description: "The type of system information to retrieve.",
                },
            },
            required: ["infoType"],
        },
    },
};
export function executeSystemInfoTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            switch (args.infoType) {
                case "platform":
                    return os.platform();
                case "arch":
                    return os.arch();
                case "hostname":
                    return os.hostname();
                case "uptime":
                    const uptimeSeconds = os.uptime();
                    const hours = Math.floor(uptimeSeconds / 3600);
                    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                    const seconds = Math.floor(uptimeSeconds % 60);
                    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
                case "totalmem":
                    return `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`;
                case "freemem":
                    return `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`;
                case "cpus":
                    const cpus = os.cpus();
                    return `CPU Model: ${cpus[0].model}, Cores: ${cpus.length}`;
                case "networkInterfaces":
                    const nets = os.networkInterfaces();
                    let networkInfo = '';
                    for (const name of Object.keys(nets)) {
                        for (const net of nets[name]) {
                            if (net.family === 'IPv4' && !net.internal) {
                                networkInfo += `Interface: ${name}, Address: ${net.address}, MAC: ${net.mac}\n`;
                            }
                        }
                    }
                    return networkInfo.trim();
                default:
                    return `Error: Unknown info type ${args.infoType}`;
            }
        }
        catch (error) {
            return `Error retrieving ${args.infoType} information: ${error.message}`;
        }
    });
}
export const processListTool = {
    type: "function",
    function: {
        name: "listProcesses",
        description: "Lists running processes on the system.",
        parameters: {
            type: "object",
            properties: {},
            required: [],
        },
    },
};
export function executeProcessListTool() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let command;
            if (os.platform() === 'win32') {
                command = 'tasklist';
            }
            else {
                command = 'ps aux';
            }
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error listing processes: ${stderr}`);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    });
}
