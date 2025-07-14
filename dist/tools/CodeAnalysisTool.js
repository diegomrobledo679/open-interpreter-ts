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
import * as path from "path";
import * as os from "os";
export const syntaxCheckTool = {
    type: "function",
    function: {
        name: "syntaxCheck",
        description: "Performs a syntax check on the provided code using language-specific tools. Returns a report of syntax errors or warnings.",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "The code to check for syntax errors.",
                },
                language: {
                    type: "string",
                    description: "The programming language of the code (e.g., 'python', 'javascript', 'typescript', 'java', 'cpp', 'ruby', 'php', 'go', 'rust', 'swift', 'csharp', 'kotlin', 'r', 'groovy', 'scala', 'powershell').",
                },
            },
            required: ["code", "language"],
        },
    },
};
export function executeSyntaxCheckTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code, language } = args;
        const tempDir = os.tmpdir();
        const fileName = `temp_syntax_check_${Date.now()}`;
        let fileExtension;
        let command;
        const filePath = path.join(tempDir, fileName);
        let fullFilePath; // Declare fullFilePath here
        switch (language.toLowerCase()) {
            case 'python':
                fileExtension = 'py';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `python -m py_compile ${JSON.stringify(fullFilePath)}`;
                break;
            case 'javascript':
                fileExtension = 'js';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `node --check ${JSON.stringify(fullFilePath)}`;
                break;
            case 'typescript':
                fileExtension = 'ts';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `tsc --noEmit ${JSON.stringify(fullFilePath)}`;
                break;
            case 'java':
                fileExtension = 'java';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `javac -Xlint:all -Werror ${JSON.stringify(fullFilePath)}`;
                break;
            case 'cpp':
                fileExtension = 'cpp';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `g++ -Wall -Wextra -pedantic -fsyntax-only ${JSON.stringify(fullFilePath)}`;
                break;
            case 'ruby':
                fileExtension = 'rb';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `ruby -c ${JSON.stringify(fullFilePath)}`;
                break;
            case 'php':
                fileExtension = 'php';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `php -l ${JSON.stringify(fullFilePath)}`;
                break;
            case 'go':
                fileExtension = 'go';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `go build -o /dev/null ${JSON.stringify(fullFilePath)}`;
                break;
            case 'rust':
                fileExtension = 'rs';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `rustc --emit=metadata --crate-type lib ${JSON.stringify(fullFilePath)}`;
                break;
            case 'swift':
                fileExtension = 'swift';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `swiftc -parse-as-library -typecheck ${JSON.stringify(fullFilePath)}`;
                break;
            case 'csharp':
                fileExtension = 'cs';
                fullFilePath = path.join(tempDir, `csharp_syntax_check_${Date.now()}`, `Program.cs`); // Update fullFilePath for C#
                const csharpProjectDir = path.dirname(fullFilePath); // Get project directory from fullFilePath
                const csharpProjectFile = path.join(csharpProjectDir, `csharp_syntax_check_${Date.now()}.csproj`);
                fs.mkdirSync(csharpProjectDir, { recursive: true });
                fs.writeFileSync(csharpProjectFile, `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>`);
                fs.writeFileSync(fullFilePath, code);
                command = `dotnet build ${csharpProjectDir} --nologo`;
                // Add cleanup for the project directory
                setTimeout(() => {
                    fs.rmSync(csharpProjectDir, { recursive: true, force: true });
                }, 5000); // Clean up after 5 seconds
                break;
            case 'kotlin':
                fileExtension = 'kt';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `kotlinc -Xno-stdlib -nowarn -Werror -proc:none ${JSON.stringify(fullFilePath)}`;
                break;
            case 'r':
                fileExtension = 'R';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `Rscript -e "parse(text=readLines(${JSON.stringify(fullFilePath)}))"`;
                break;
            case 'groovy':
                fileExtension = 'groovy';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `groovyc -c ${JSON.stringify(fullFilePath)}`;
                break;
            case 'scala':
                fileExtension = 'scala';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                command = `scalac -Xlint ${JSON.stringify(fullFilePath)}`;
                break;
            case 'powershell':
                fileExtension = 'ps1';
                fullFilePath = filePath + '.' + fileExtension;
                fs.writeFileSync(fullFilePath, code);
                // Use PSScriptAnalyzer for robust syntax checking if available, otherwise a basic check.
                // This assumes PSScriptAnalyzer is installed. If not, the user might need to install it.
                command = `pwsh -NoProfile -Command "try { Get-Content -Raw ${JSON.stringify(fullFilePath)} | Invoke-ScriptAnalyzer -Severity Error,Warning,Information | Out-String } catch { Invoke-Expression (Get-Content -Raw ${JSON.stringify(fullFilePath)}) }"`;
                break;
            default:
                return `Error: Unsupported language for syntax check: ${language}`;
        }
        return new Promise((resolve) => {
            exec(command, { cwd: tempDir }, (error, stdout, stderr) => {
                fs.unlinkSync(fullFilePath); // Clean up temp file
                if (error) {
                    resolve(`Syntax check failed for ${language} code:\n${stderr || stdout || error.message}`);
                }
                else {
                    if (stderr) {
                        resolve(`Syntax check completed with warnings for ${language} code:\n${stderr}`);
                    }
                    else if (stdout) {
                        resolve(`Syntax check completed for ${language} code:\n${stdout}`);
                    }
                    else {
                        resolve(`Syntax check completed successfully for ${language} code. No issues found.`);
                    }
                }
            });
        });
    });
}
export const fixCodeTool = {
    type: "function",
    function: {
        name: "fixCode",
        description: "Conceptually fixes code errors using AI or linting tools. This is a placeholder and requires integration with actual code analysis and fixing services.",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "The code to fix.",
                },
                language: {
                    type: "string",
                    description: "The programming language of the code.",
                },
                errorDetails: {
                    type: "string",
                    description: "Details about the error to help in fixing the code.",
                    nullable: true,
                },
            },
            required: ["code", "language"],
        },
    },
};
export function executeFixCodeTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const codeBlock = `\`\`\`${args.language}\n${args.code}\n\`\`\``;
        const errorInfo = args.errorDetails ? `\n\nError details: ${args.errorDetails}` : '';
        return `Conceptual code fix for ${args.language} code. Original code: ${codeBlock}${errorInfo}\n\nNote: A real implementation would involve sending the code and error details to a linter, formatter, or an AI model for suggestions and applying the fixes.`;
    });
}
export const formatCodeTool = {
    type: "function",
    function: {
        name: "formatCode",
        description: "Conceptually formats code according to standard style guidelines. This is a placeholder and requires integration with actual code formatting tools (e.g., Prettier, Black, gofmt).",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "The code to format.",
                },
                language: {
                    type: "string",
                    description: "The programming language of the code.",
                },
            },
            required: ["code", "language"],
        },
    },
};
export function executeFormatCodeTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const codeBlock = `\`\`\`${args.language}\n${args.code}\n\`\`\``;
        return `Conceptual code formatting for ${args.language} code. Original code: ${codeBlock}\n\nNote: A real implementation would involve calling an external formatter tool for the specified language.`;
    });
}
