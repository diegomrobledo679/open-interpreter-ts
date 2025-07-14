import { Tool } from "../core/types.js";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml"; // You might need to install js-yaml: npm install js-yaml
import * as xml2js from "xml2js"; // You might need to install xml2js: npm install xml2js

// Helper to execute shell commands (if needed for some config types)
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

export const readConfigFileTool: Tool = {
  type: "function",
  function: {
    name: "readConfigFile",
    description: "Reads and parses the content of a specified configuration file (supports JSON, YAML, INI, XML).",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path to the configuration file.",
        },
        fileType: {
          type: "string",
          enum: ["json", "yaml", "ini", "xml"],
          description: "The type of the configuration file.",
        },
      },
      required: ["filePath", "fileType"],
    },
  },
};

export async function executeReadConfigFileTool(args: { filePath: string; fileType: "json" | "yaml" | "ini" | "xml" }): Promise<string> {
  try {
    if (!fs.existsSync(args.filePath)) {
      return `Error: Configuration file not found at ${args.filePath}`;
    }
    const content = fs.readFileSync(args.filePath, "utf-8");

    switch (args.fileType) {
      case "json":
        return JSON.stringify(JSON.parse(content), null, 2);
      case "yaml":
        return JSON.stringify(yaml.load(content), null, 2);
      case "ini":
        // Basic INI parsing (key=value per line)
        const iniConfig: { [key: string]: string } = {};
        content.split(/\r\n|\r|\n/).forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith(';')) {
            const parts = trimmedLine.split('=');
            if (parts.length >= 2) {
              iniConfig[parts[0].trim()] = parts.slice(1).join('=').trim();
            }
          }
        });
        return JSON.stringify(iniConfig, null, 2);
      case "xml":
        return new Promise((resolve, reject) => {
          xml2js.parseString(content, (err, result) => {
            if (err) reject(err);
            else resolve(JSON.stringify(result, null, 2));
          });
        });
      default:
        return `Error: Unsupported file type for reading: ${args.fileType}`;
    }
  } catch (error: any) {
    return `Error reading configuration file: ${error.message}`;
  }
}

export const modifyConfigFileTool: Tool = {
  type: "function",
  function: {
    name: "modifyConfigFile",
    description: "Modifies a specified key-value pair in a configuration file (supports JSON, YAML, INI).",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path to the configuration file.",
        },
        fileType: {
          type: "string",
          enum: ["json", "yaml", "ini"],
          description: "The type of the configuration file.",
        },
        key: {
          type: "string",
          description: "The key to modify (for nested keys, use dot notation, e.g., 'database.port').",
        },
        value: {
          type: "string",
          description: "The new value for the key. Will be parsed as JSON for JSON/YAML files if possible.",
        },
      },
      required: ["filePath", "fileType", "key", "value"],
    },
  },
};

export async function executeModifyConfigFileTool(args: { filePath: string; fileType: "json" | "yaml" | "ini"; key: string; value: string }): Promise<string> {
  try {
    if (!fs.existsSync(args.filePath)) {
      return `Error: Configuration file not found at ${args.filePath}`;
    }
    const content = fs.readFileSync(args.filePath, "utf-8");
    let configData: any;

    switch (args.fileType) {
      case "json":
        configData = JSON.parse(content);
        break;
      case "yaml":
        configData = yaml.load(content);
        break;
      case "ini":
        // Basic INI parsing for modification
        const iniLines = content.split(/\r\n|\r|\n/);
        let modifiedIniLines: string[] = [];
        let keyFound = false;
        iniLines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith(args.key + '=')) {
            modifiedIniLines.push(`${args.key}=${args.value}`);
            keyFound = true;
          } else {
            modifiedIniLines.push(line);
          }
        });
        if (!keyFound) {
          modifiedIniLines.push(`${args.key}=${args.value}`); // Add if key not found
        }
        fs.writeFileSync(args.filePath, modifiedIniLines.join(os.EOL), "utf-8");
        return `Successfully modified key '${args.key}' in ${args.filePath}.`;
      default:
        return `Error: Unsupported file type for modification: ${args.fileType}`;
    }

    // For JSON and YAML
    const keys = args.key.split('.');
    let current = configData;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        try {
          current[k] = JSON.parse(args.value); // Try parsing as JSON
        } catch {
          current[k] = args.value; // Otherwise, treat as string
        }
      } else {
        if (!current[k] || typeof current[k] !== 'object') {
          current[k] = {};
        }
        current = current[k];
      }
    }

    let newContent: string;
    if (args.fileType === "json") {
      newContent = JSON.stringify(configData, null, 2);
    } else { // yaml
      newContent = yaml.dump(configData);
    }

    fs.writeFileSync(args.filePath, newContent, "utf-8");
    return `Successfully modified key '${args.key}' in ${args.filePath}.`;
  } catch (error: any) {
    return `Error modifying configuration file: ${error.message}`;
  }
}

export const validateConfigFileTool: Tool = {
  type: "function",
  function: {
    name: "validateConfigFile",
    description: "Conceptually validates a configuration file against a predefined schema or best practices. This is a placeholder and requires a specific schema definition and validation library for each file type.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path to the configuration file.",
        },
        fileType: {
          type: "string",
          enum: ["json", "yaml", "xml"],
          description: "The type of the configuration file.",
        },
        schemaName: {
          type: "string",
          description: "Optional: The name or identifier of the schema to validate against.",
          nullable: true,
        },
      },
      required: ["filePath", "fileType"],
    },
  },
};

export async function executeValidateConfigFileTool(args: { filePath: string; fileType: "json" | "yaml" | "xml"; schemaName?: string }): Promise<string> {
  return `Conceptual validation of ${args.fileType} file: ${args.filePath}.\nTo make this functional, you would need to define schemas (e.g., JSON Schema) and integrate a validation library (e.g., 'ajv' for JSON, 'jsonschema' for Python).`;
}