import { Tool } from "../core/types.js";
import { exec } from "child_process";
import * as os from "os";

// Helper to execute shell commands
const executeShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Command failed: ${command}\nError: ${stderr}`);
      } else {
        resolve(stdout || stderr || `Command executed successfully: ${command}`);
      }
    });
  });
};

export const terminateProcessTool: Tool = {
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

export async function executeTerminateProcessTool(args: { pid: number }): Promise<string> {
  let command: string;
  if (os.platform() === 'win32') {
    command = `taskkill /PID ${args.pid} /F`; // /F to force terminate
  } else {
    command = `kill ${args.pid}`; // Default kill command
  }
  return executeShellCommand(command);
}

export const startProcessTool: Tool = {
  type: "function",
  function: {
    name: "startProcess",
    description: "Starts a new process with the given command and arguments.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The command to execute to start the process.",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Optional: An array of string arguments for the command.",
          nullable: true,
        },
        detached: {
          type: "boolean",
          description: "Optional: If true, the child process will be run independently of its parent process.",
          nullable: true,
        },
      },
      required: ["command"],
    },
  },
};

export async function executeStartProcessTool(args: { command: string; args?: string[]; detached?: boolean }): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(args.command + (args.args ? ' ' + args.args.join(' ') : ''), { detached: args.detached });
    child.unref(); // Allow the parent process to exit independently of the child
    resolve(`Process started with PID: ${child.pid}. Command: ${args.command} ${args.args ? args.args.join(' ') : ''}`);
  });
}

export const getProcessInfoTool: Tool = {
  type: "function",
  function: {
    name: "getProcessInfo",
    description: "Retrieves detailed information about a running process by its PID.",
    parameters: {
      type: "object",
      properties: {
        pid: {
          type: "number",
          description: "The Process ID (PID) of the process.",
        },
      },
      required: ["pid"],
    },
  },
};

export async function executeGetProcessInfoTool(args: { pid: number }): Promise<string> {
  let command: string;
  if (os.platform() === 'win32') {
    command = `tasklist /FI "PID eq ${args.pid}" /v`;
  } else {
    command = `ps -p ${args.pid} -o pid,ppid,user,group,comm,pcpu,pmem,vsz,rss,tty,stat,start,time,cmd`;
  }
  try {
    const output = await executeShellCommand(command);
    return `Process Info for PID ${args.pid}:\n${output}`;
  } catch (error: any) {
    return `Error getting process info for PID ${args.pid}: ${error.message}`;
  }
}