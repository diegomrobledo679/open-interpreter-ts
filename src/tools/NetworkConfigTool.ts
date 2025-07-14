import { Tool } from "../core/types.js";import { exec } from "child_process";import * as os from "os";// Helper to execute shell commandsconst executeShellCommand = (command: string): Promise<string> => {  return new Promise((resolve, reject) => {    exec(command, (error, stdout, stderr) => {      if (error) {        reject(`Command failed: ${command}\nError: ${stderr}`);      } else {        resolve(stdout || stderr || `Command executed successfully: ${command}`);      }    });  });};export const getNetworkConfigTool: Tool = {  type: "function",  function: {    name: "getNetworkConfig",    description: "Displays the network configuration of the system's interfaces.",    parameters: {      type: "object",      properties: {},      required: [],    },  },};export async function executeGetNetworkConfigTool(): Promise<string> {  let command: string;  if (os.platform() === 'win32') {    command = 'ipconfig /all';  } else {    command = 'ifconfig -a || ip a'; // Try ifconfig first, then ip a  }  return executeShellCommand(command);}export const flushDnsCacheTool: Tool = {  type: "function",  function: {    name: "flushDnsCache",    description: "Flushes the DNS resolver cache.",    parameters: {      type: "object",      properties: {},      required: [],    },  },};export async function executeFlushDnsCacheTool(): Promise<string> {
  let command: string;
  if (os.platform() === 'win32') {
    command = 'ipconfig /flushdns';
  } else if (os.platform() === 'darwin') {
    command = 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder';
  } else if (os.platform() === 'linux') {
    command = 'sudo systemctl restart systemd-resolved || sudo /etc/init.d/nscd restart'; // Common Linux DNS services
  } else {
    return "Error: Flushing DNS cache is not supported on this operating system.";
  }
  return executeShellCommand(command);
}

export const addFirewallRuleTool: Tool = {
  type: "function",
  function: {
    name: "addFirewallRule",
    description: "Adds a firewall rule to allow or block traffic. Requires appropriate permissions.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "A unique name for the firewall rule.",
        },
        action: {
          type: "string",
          enum: ["allow", "block"],
          description: "The action to perform (allow or block).",
        },
        direction: {
          type: "string",
          enum: ["in", "out"],
          description: "The direction of traffic (inbound or outbound).",
        },
        port: {
          type: "number",
          description: "Optional: The port number to apply the rule to.",
          nullable: true,
        },
        protocol: {
          type: "string",
          enum: ["tcp", "udp", "any"],
          description: "Optional: The protocol (tcp, udp, or any). Defaults to any.",
          default: "any",
          nullable: true
        },
        ipAddress: {
          type: "string",
          description: "Optional: The IP address or range to apply the rule to.",
          nullable: true
        },
      },
      required: ["name", "action", "direction"],
    },
  },
};

export async function executeAddFirewallRuleTool(args: { name: string; action: "allow" | "block"; direction: "in" | "out"; port?: number; protocol?: "tcp" | "udp" | "any"; ipAddress?: string }): Promise<string> {
  let command: string;
  const { name, action, direction, port, protocol, ipAddress } = args;

  if (os.platform() === 'win32') {
    let portStr = port ? `localport=${port}` : '';
    let protocolStr = protocol && protocol !== "any" ? `protocol=${protocol}` : '';
    let remoteIpStr = ipAddress ? `remoteip=${ipAddress}` : '';
    command = `netsh advfirewall firewall add rule name="${name}" dir=${direction} action=${action} ${portStr} ${protocolStr} ${remoteIpStr}`;
  } else if (os.platform() === 'linux') {
    let portStr = port ? `proto ${protocol || 'any'} to any port ${port}` : '';
    let ipStr = ipAddress ? `from ${ipAddress}` : '';
    command = `sudo ufw ${action} ${direction} ${portStr} ${ipStr}`;
  } else {
    return "Error: Firewall management is not supported on this operating system.";
  }
  return executeShellCommand(command);
}

export const deleteFirewallRuleTool: Tool = {
  type: "function",
  function: {
    name: "deleteFirewallRule",
    description: "Deletes a firewall rule by its name. Requires appropriate permissions.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the firewall rule to delete.",
        },
      },
      required: ["name"],
    },
  },
};

export async function executeDeleteFirewallRuleTool(args: { name: string }): Promise<string> {
  let command: string;
  const { name } = args;

  if (os.platform() === 'win32') {
    command = `netsh advfirewall firewall delete rule name="${name}"`;
  } else if (os.platform() === 'linux') {
    command = `sudo ufw delete allow name="${name}" || sudo ufw delete deny name="${name}"`; // UFW doesn't have a direct delete by name, so try both allow/deny
  } else {
    return "Error: Firewall management is not supported on this operating system.";
  }
  return executeShellCommand(command);
}

export const addFirewallRuleTool: Tool = {
  type: "function",
  function: {
    name: "addFirewallRule",
    description: "Adds a firewall rule to allow or block traffic. Requires appropriate permissions.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "A unique name for the firewall rule.",
        },
        action: {
          type: "string",
          enum: ["allow", "block"],
          description: "The action to perform (allow or block).",
        },
        direction: {
          type: "string",
          enum: ["in", "out"],
          description: "The direction of traffic (inbound or outbound).",
        },
        port: {
          type: "number",
          description: "Optional: The port number to apply the rule to.",
          nullable: true,
        },
        protocol: {
          type: "string",
          enum: ["tcp", "udp", "any"],
          description: "Optional: The protocol (tcp, udp, or any). Defaults to any.",
          default: "any",
          nullable: true
        },
        ipAddress: {
          type: "string",
          description: "Optional: The IP address or range to apply the rule to.",
          nullable: true
        },
      },
      required: ["name", "action", "direction"],
    },
  },
};

export async function executeAddFirewallRuleTool(args: { name: string; action: "allow" | "block"; direction: "in" | "out"; port?: number; protocol?: "tcp" | "udp" | "any"; ipAddress?: string }): Promise<string> {
  let command: string;
  const { name, action, direction, port, protocol, ipAddress } = args;

  if (os.platform() === 'win32') {
    let portStr = port ? `localport=${port}` : '';
    let protocolStr = protocol && protocol !== "any" ? `protocol=${protocol}` : '';
    let remoteIpStr = ipAddress ? `remoteip=${ipAddress}` : '';
    command = `netsh advfirewall firewall add rule name="${name}" dir=${direction} action=${action} ${portStr} ${protocolStr} ${remoteIpStr}`;
  } else if (os.platform() === 'linux') {
    let portStr = port ? `proto ${protocol || 'any'} to any port ${port}` : '';
    let ipStr = ipAddress ? `from ${ipAddress}` : '';
    command = `sudo ufw ${action} ${direction} ${portStr} ${ipStr}`;
  } else {
    return "Error: Firewall management is not supported on this operating system.";
  }
  return executeShellCommand(command);
}

export const deleteFirewallRuleTool: Tool = {
  type: "function",
  function: {
    name: "deleteFirewallRule",
    description: "Deletes a firewall rule by its name. Requires appropriate permissions.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the firewall rule to delete.",
        },
      },
      required: ["name"],
    },
  },
};

export async function executeDeleteFirewallRuleTool(args: { name: string }): Promise<string> {
  let command: string;
  const { name } = args;

  if (os.platform() === 'win32') {
    command = `netsh advfirewall firewall delete rule name="${name}"`;
  } else if (os.platform() === 'linux') {
    command = `sudo ufw delete allow name="${name}" || sudo ufw delete deny name="${name}"`; // UFW doesn't have a direct delete by name, so try both allow/deny
  } else {
    return "Error: Firewall management is not supported on this operating system.";
  }
  return executeShellCommand(command);
}