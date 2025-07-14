import { Tool } from "../core/types.js";
import { exec } from "child_process";
import * as os from "os";
import * as fs from "fs";
import * as crypto from "crypto";

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

export const scanOpenPortsTool: Tool = {
  type: "function",
  function: {
    name: "scanOpenPorts",
    description: "Scans for open ports on the local machine or a specified host. Requires appropriate network tools (e.g., nmap, netstat).",
    parameters: {
      type: "object",
      properties: {
        host: {
          type: "string",
          description: "Optional: The host to scan. Defaults to localhost.",
          nullable: true,
        },
        ports: {
          type: "string",
          description: "Optional: A comma-separated list of ports or port ranges to scan (e.g., '80,443,8000-9000').",
          nullable: true,
        },
      },
      required: [],
    },
  },
};

export async function executeScanOpenPortsTool(args: { host?: string; ports?: string }): Promise<string> {
  let command: string;
  const target = args.host || 'localhost';
  const portScan = args.ports ? `-p ${args.ports}` : '';

  if (os.platform() === 'win32') {
    // Windows: Use netstat or a conceptual nmap call
    command = `netstat -ano | findstr LISTENING`;
    if (args.host && args.host !== 'localhost') {
      return "Error: Remote port scanning on Windows requires nmap or similar tools not natively available via netstat.";
    }
  } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
    // Linux/macOS: Prefer nmap if available, otherwise netstat
    try {
      await executeShellCommand('which nmap'); // Check if nmap is installed
      command = `nmap ${portScan} ${target}`;
    } catch (e) {
      command = `netstat -tuln`; // Fallback to netstat for listening ports
      if (args.host && args.host !== 'localhost') {
        return "Error: nmap not found. Remote port scanning requires nmap.";
      }
    }
  } else {
    return "Error: Port scanning is not supported on this operating system.";
  }

  try {
    const output = await executeShellCommand(command);
    return `Open ports on ${target}:\n${output}`;
  } catch (error: any) {
    return `Error scanning ports: ${error.message}`;
  }
}

export const checkFileIntegrityTool: Tool = {
  type: "function",
  function: {
    name: "checkFileIntegrity",
    description: "Calculates the SHA256 hash of a file to verify its integrity.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path to the file to check.",
        },
      },
      required: ["filePath"],
    },
  },
};

export async function executeCheckFileIntegrityTool(args: { filePath: string }): Promise<string> {
  try {
    if (!fs.existsSync(args.filePath)) {
      return `Error: File not found at ${args.filePath}`;
    }
    const fileBuffer = fs.readFileSync(args.filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest('hex');
    return `SHA256 hash of ${args.filePath}: ${fileHash}`;
  } catch (error: any) {
    return `Error checking file integrity: ${error.message}`;
  }
}

export const listActiveConnectionsTool: Tool = {
  type: "function",
  function: {
    name: "listActiveConnections",
    description: "Lists all active network connections on the system. Requires appropriate permissions.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function executeListActiveConnectionsTool(): Promise<string> {
  let command: string;
  if (os.platform() === 'win32') {
    command = `netstat -ano`;
  } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
    command = `netstat -tulnap || ss -tulnap`; // Prefer ss on Linux if available
  } else {
    return "Error: Listing active connections is not supported on this operating system.";
  }
  try {
    const output = await executeShellCommand(command);
    return `Active Network Connections:\n${output}`;
  } catch (error: any) {
    return `Error listing active connections: ${error.message}`;
  }
}

export const scanForMalwareTool: Tool = {
  type: "function",
  function: {
    name: "scanForMalware",
    description: "Conceptually scans the system or a specified path for malware/viruses. A real implementation would integrate with an antivirus engine (e.g., ClamAV, Windows Defender CLI).",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Optional: The path to scan. Defaults to the entire system (conceptual).",
          nullable: true,
        },
      },
      required: [],
    },
  },
};

export async function executeScanForMalwareTool(args: { path?: string }): Promise<string> {
  const target = args.path || 'the entire system';
  return `Conceptual malware scan of ${target}. To make this functional, you would need to integrate with an external antivirus solution (e.g., by executing its command-line interface).`;
}

export const analyzeSecurityLogsTool: Tool = {
  type: "function",
  function: {
    name: "analyzeSecurityLogs",
    description: "Conceptually analyzes security-related logs for suspicious activities or anomalies. A real implementation would involve parsing and interpreting logs from various sources (e.g., system logs, firewall logs, application logs) and applying security analytics.",
    parameters: {
      type: "object",
      properties: {
        logType: {
          type: "string",
          description: "The type of security logs to analyze (e.g., 'auth.log', 'syslog', 'firewall').",
        },
        keywords: {
          type: "string",
          description: "Optional: Keywords to search for in the logs.",
          nullable: true,
        },
      },
      required: ["logType"],
    },
  },
};

export async function executeAnalyzeSecurityLogsTool(args: { logType: string; keywords?: string }): Promise<string> {
  const keywords = args.keywords ? ` with keywords: ${args.keywords}` : '';
  return `Conceptual analysis of ${args.logType} security logs${keywords}. A real implementation would involve reading, parsing, and analyzing log files for security events.`;
}

export const manageCryptographicKeysTool: Tool = {
  type: "function",
  function: {
    name: "manageCryptographicKeys",
    description: "Conceptually manages cryptographic keys (e.g., generate, store, retrieve, delete). A real implementation would interact with a secure key store or a cryptographic library.",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["generate", "store", "retrieve", "delete"],
          description: "The cryptographic key operation to perform.",
        },
        keyName: {
          type: "string",
          description: "The name or identifier of the key.",
        },
        keyType: {
          type: "string",
          description: "Optional: The type of key (e.g., 'RSA', 'AES').",
          nullable: true,
        },
      },
      required: ["operation", "keyName"],
    },
  },
};

export async function executeManageCryptographicKeysTool(args: { operation: "generate" | "store" | "retrieve" | "delete"; keyName: string; keyType?: string }): Promise<string> {
  const keyType = args.keyType ? ` of type ${args.keyType}` : '';
  return `Conceptual operation: ${args.operation} cryptographic key '${args.keyName}'${keyType}. A real implementation would involve secure key management practices and libraries.`;
}
