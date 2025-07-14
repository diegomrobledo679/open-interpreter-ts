var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import * as os from "os";
export const readFileTool = {
    type: "function",
    function: {
        name: "readFile",
        description: "Reads the content of a specified file.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file to read.",
                },
            },
            required: ["filePath"],
        },
    },
};
export function executeReadFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = fs.readFileSync(args.filePath, "utf-8");
            return `File content:\n${content}`;
        }
        catch (error) {
            return `Error reading file: ${error.message}`;
        }
    });
}
export const writeFileTool = {
    type: "function",
    function: {
        name: "writeFile",
        description: "Writes content to a specified file. Overwrites if the file exists.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file to write.",
                },
                content: {
                    type: "string",
                    description: "The content to write to the file.",
                },
            },
            required: ["filePath", "content"],
        },
    },
};
export function executeWriteFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.writeFileSync(args.filePath, args.content, "utf-8");
            return `Content successfully written to ${args.filePath}`;
        }
        catch (error) {
            return `Error writing to file: ${error.message}`;
        }
    });
}
export const prependToFileTool = {
    type: "function",
    function: {
        name: "prependToFile",
        description: "Adds content to the beginning of a specified file.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file.",
                },
                content: {
                    type: "string",
                    description: "The content to prepend.",
                },
            },
            required: ["filePath", "content"],
        },
    },
};
export function executePrependToFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const originalContent = fs.readFileSync(args.filePath, "utf-8");
            fs.writeFileSync(args.filePath, args.content + originalContent, "utf-8");
            return `Content successfully prepended to ${args.filePath}`;
        }
        catch (error) {
            return `Error prepending to file: ${error.message}`;
        }
    });
}
export const appendToFileTool = {
    type: "function",
    function: {
        name: "appendToFile",
        description: "Adds content to the end of a specified file.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file.",
                },
                content: {
                    type: "string",
                    description: "The content to append.",
                },
            },
            required: ["filePath", "content"],
        },
    },
};
export function executeAppendToFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.appendFileSync(args.filePath, args.content, "utf-8");
            return `Content successfully appended to ${args.filePath}`;
        }
        catch (error) {
            return `Error appending to file: ${error.message}`;
        }
    });
}
export const insertIntoFileTool = {
    type: "function",
    function: {
        name: "insertIntoFile",
        description: "Inserts content into a specified file at a given line number.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file.",
                },
                content: {
                    type: "string",
                    description: "The content to insert.",
                },
                lineNumber: {
                    type: "number",
                    description: "The 1-based line number before which to insert the content.",
                },
            },
            required: ["filePath", "content", "lineNumber"],
        },
    },
};
export function executeInsertIntoFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lines = fs.readFileSync(args.filePath, "utf-8").split(/\r\n|\r|\n/);
            if (args.lineNumber < 1 || args.lineNumber > lines.length + 1) {
                return `Error: Line number ${args.lineNumber} is out of bounds for file ${args.filePath} (total lines: ${lines.length}).`;
            }
            lines.splice(args.lineNumber - 1, 0, args.content);
            fs.writeFileSync(args.filePath, lines.join(os.EOL), "utf-8");
            return `Content successfully inserted into ${args.filePath} at line ${args.lineNumber}.`;
        }
        catch (error) {
            return `Error inserting into file: ${error.message}`;
        }
    });
}
export const deleteFromFileTool = {
    type: "function",
    function: {
        name: "deleteFromFile",
        description: "Deletes specific lines or content from a file.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "The path to the file.",
                },
                lineNumber: {
                    type: "number",
                    description: "Optional: The 1-based line number to delete.",
                    nullable: true,
                },
                pattern: {
                    type: "string",
                    description: "Optional: A regex pattern to match and delete lines containing it.",
                    nullable: true,
                },
            },
            required: ["filePath"],
        },
    },
};
export function executeDeleteFromFileTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let lines = fs.readFileSync(args.filePath, "utf-8").split(/\r\n|\r|\n/);
            let originalLength = lines.length;
            if (args.lineNumber !== undefined) {
                if (args.lineNumber < 1 || args.lineNumber > lines.length) {
                    return `Error: Line number ${args.lineNumber} is out of bounds for file ${args.filePath} (total lines: ${lines.length}).`;
                }
                lines.splice(args.lineNumber - 1, 1);
            }
            else if (args.pattern !== undefined) {
                const regex = new RegExp(args.pattern, 'gim');
                lines = lines.filter(line => !regex.test(line));
            }
            else {
                return "Error: Either lineNumber or pattern must be provided.";
            }
            if (lines.length === originalLength) {
                return `No changes made to ${args.filePath}. No matching lines found or line number out of bounds.`;
            }
            fs.writeFileSync(args.filePath, lines.join(os.EOL), "utf-8");
            return `Content successfully deleted from ${args.filePath}. New line count: ${lines.length}.`;
        }
        catch (error) {
            return `Error deleting from file: ${error.message}`;
        }
    });
}
