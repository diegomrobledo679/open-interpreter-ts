

import { Tool } from "../core/types.js";
import * as os from "os";
import { executeShellCommand } from "@utils/command.js";

export const createScheduledTaskTool: Tool = {
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

export async function executeCreateScheduledTaskTool(args: { name: string; command: string; schedule: string }): Promise<string> {
  let cmd: string;
  if (os.platform() === "linux" || os.platform() === "darwin") {
    // For Linux/macOS, replace any existing entry with the same name and then append the new one
    const entry = `${args.schedule} ${args.command} # ${args.name}`;
    cmd = `(crontab -l 2>/dev/null | grep -v '# ${args.name}$'; echo "${entry}") | crontab -`;
  } else if (os.platform() === 'win32') {
    // For Windows, use schtasks
    // This is a simplified example; schtasks is complex.
    cmd = `schtasks /create /tn "${args.name}" /tr "${args.command}" /sc ${args.schedule}`;
  } else {
    return "Error: Scheduled tasks are not supported on this operating system.";
  }
  await executeShellCommand(cmd);
  return "Scheduled task created.";
}

export const listScheduledTasksTool: Tool = {
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

export async function executeListScheduledTasksTool(): Promise<string> {
  let cmd: string;
  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    cmd = `crontab -l`;
  } else if (os.platform() === 'win32') {
    cmd = `schtasks /query /fo LIST /v`;
  } else {
    return "Error: Listing scheduled tasks is not supported on this operating system.";
  }
  await executeShellCommand(cmd);
  return "Scheduled task deleted.";
}

export const deleteScheduledTaskTool: Tool = {
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

export async function executeDeleteScheduledTaskTool(args: { name: string }): Promise<string> {
  let cmd: string;
  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    // Remove lines containing the identifier comment added during creation
    cmd = `crontab -l | grep -v '# ${args.name}$' | crontab -`;
  } else if (os.platform() === 'win32') {
    cmd = `schtasks /delete /tn "${args.name}" /f`; // /f to force delete
  }
  else {
    return "Error: Deleting scheduled tasks is not supported on this operating system.";
  }
  await executeShellCommand(cmd);
  return "Scheduled task deleted.";
}

