var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Interpreter } from "./core/Interpreter.js";
import { logger } from "./utils/logger.js";
import * as readline from "readline";
import minimist from "minimist";
import { config } from "./config.js";
// Import all tools and their execution functions
import { calculatorTool, executeCalculatorTool } from "./tools/CalculatorTool.js";
import { readFileTool, writeFileTool, executeReadFileTool, executeWriteFileTool, prependToFileTool, executePrependToFileTool, appendToFileTool, executeAppendToFileTool, insertIntoFileTool, executeInsertIntoFileTool, deleteFromFileTool, executeDeleteFromFileTool } from "./tools/FileTool.js";
import { listDirectoryTool, executeListDirectoryTool } from "./tools/DirectoryTool.js";
import { webFetchTool, executeWebFetchTool, httpRequestTool, executeHttpRequestTool } from "./tools/WebTool.js";
import { searchTool, executeSearchTool } from "./tools/SearchTool.js";
import { sqlTool, executeSqlTool } from "./tools/SqlTool.js";
import { jsonTool, executeJsonTool } from "./tools/JsonTool.js";
import { pingTool, executePingTool, tracerouteTool, executeTracerouteTool } from "./tools/NetworkTool.js";
import { systemInfoTool, executeSystemInfoTool, processListTool, executeProcessListTool } from "./tools/SystemTool.js";
import { syntaxCheckTool, executeSyntaxCheckTool, fixCodeTool, executeFixCodeTool, formatCodeTool, executeFormatCodeTool } from "./tools/CodeAnalysisTool.js";
import { gitStatusTool, executeGitStatusTool, gitDiffTool, executeGitDiffTool, gitAddTool, executeGitAddTool, gitCommitTool, executeGitCommitTool, gitLogTool, executeGitLogTool } from "./tools/GitTool.js";
import { resizeImageTool, executeResizeImageTool, cropImageTool, executeCropImageTool, greyscaleImageTool, executeGreyscaleImageTool, rotateImageTool, executeRotateImageTool, generateImageTool, executeGenerateImageTool } from "./tools/ImageTool.js";
import { countLinesInFileTool, executeCountLinesInFileTool, findTextInFileTool, executeFindTextInFileTool, getDirectoryStructureTool, executeGetDirectoryStructureTool, listFileTypesTool, executeListFileTypesTool, deepSearchTool, executeDeepSearchTool } from "./tools/AnalysisTool.js";
import { minecraftPingTool, executeMinecraftPingTool } from "./tools/MinecraftTool.js";
import { launchUITool, executeLaunchUITool, launchVirtualTerminalTool, executeLaunchVirtualTerminalTool } from "./tools/SystemIntegrationTool.js";
import { terminateProcessTool, executeTerminateProcessTool } from "./tools/ProcessManagementTool.js";
import { npmInstallTool, executeNpmInstallTool, pipInstallTool, executePipInstallTool, aptInstallTool, executeAptInstallTool, brewInstallTool, executeBrewInstallTool, chocoInstallTool, executeChocoInstallTool } from "./tools/PackageManagerTool.js";
import { zipCompressTool, executeZipCompressTool, zipDecompressTool, executeZipDecompressTool, tarCompressTool, executeTarCompressTool, tarDecompressTool, executeTarDecompressTool } from "./tools/CompressionTool.js";
import { generateBoilerplateCodeTool, executeGenerateBoilerplateCodeTool } from "./tools/CodeGenerationTool.js";
import { getEnvironmentVariableTool, setEnvironmentVariableTool, unsetEnvironmentVariableTool, executeGetEnvironmentVariableTool, executeSetEnvironmentVariableTool, executeUnsetEnvironmentVariableTool } from "./tools/EnvironmentTool.js";
import { changeFilePermissionsTool, executeChangeFilePermissionsTool } from "./tools/FilePermissionsTool.js";
import { createSymbolicLinkTool, readSymbolicLinkTool, deleteSymbolicLinkTool, executeCreateSymbolicLinkTool, executeReadSymbolicLinkTool, executeDeleteSymbolicLinkTool } from "./tools/SymbolicLinkTool.js";
import { createScheduledTaskTool, listScheduledTasksTool, deleteScheduledTaskTool, executeCreateScheduledTaskTool, executeListScheduledTasksTool, executeDeleteScheduledTaskTool } from "./tools/SchedulerTool.js";
import { checkPortTool, executeCheckPortTool } from "./tools/NetworkScanTool.js";
import { readClipboardTool, writeClipboardTool, executeReadClipboardTool, executeWriteClipboardTool } from "./tools/ClipboardTool.js";
import { listDependenciesTool, executeListDependenciesTool } from "./tools/DependencyTool.js";
import { listContainersTool, startContainerTool, stopContainerTool, executeListContainersTool, executeStartContainerTool, executeStopContainerTool } from "./tools/ContainerTool.js";
import { getDiskUsageTool, getMemoryUsageTool, executeGetDiskUsageTool, executeGetMemoryUsageTool } from "./tools/SystemMonitorTool.js";
import { getNetworkConfigTool, flushDnsCacheTool, executeGetNetworkConfigTool, executeFlushDnsCacheTool } from "./tools/NetworkConfigTool.js";
export function main() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info("Starting Open Interpreter CLI...");
        const argv = minimist(process.argv.slice(2));
        const options = Object.assign(Object.assign({}, argv), { autoRun: argv.autoRun !== undefined ? argv.autoRun : true, loop: argv.loop || config.defaultLoop, safeMode: argv.safeMode || config.defaultSafeMode, llmProvider: argv.llmProvider, llmModel: argv.llmModel, llmApiKey: argv.llmApiKey, llmBaseUrl: argv.llmBaseUrl });
        const interpreter = new Interpreter(options);
        // Register all tools
        interpreter.registerTool(calculatorTool, executeCalculatorTool);
        interpreter.registerTool(readFileTool, executeReadFileTool);
        interpreter.registerTool(writeFileTool, executeWriteFileTool);
        interpreter.registerTool(prependToFileTool, executePrependToFileTool);
        interpreter.registerTool(appendToFileTool, executeAppendToFileTool);
        interpreter.registerTool(insertIntoFileTool, executeInsertIntoFileTool);
        interpreter.registerTool(deleteFromFileTool, executeDeleteFromFileTool);
        interpreter.registerTool(listDirectoryTool, executeListDirectoryTool);
        interpreter.registerTool(webFetchTool, executeWebFetchTool);
        interpreter.registerTool(httpRequestTool, executeHttpRequestTool);
        interpreter.registerTool(searchTool, executeSearchTool);
        interpreter.registerTool(sqlTool, executeSqlTool);
        interpreter.registerTool(jsonTool, executeJsonTool);
        interpreter.registerTool(pingTool, executePingTool);
        interpreter.registerTool(tracerouteTool, executeTracerouteTool);
        interpreter.registerTool(systemInfoTool, executeSystemInfoTool);
        interpreter.registerTool(processListTool, executeProcessListTool);
        interpreter.registerTool(syntaxCheckTool, executeSyntaxCheckTool);
        interpreter.registerTool(fixCodeTool, executeFixCodeTool);
        interpreter.registerTool(formatCodeTool, executeFormatCodeTool);
        interpreter.registerTool(gitStatusTool, executeGitStatusTool);
        interpreter.registerTool(gitDiffTool, executeGitDiffTool);
        interpreter.registerTool(gitAddTool, executeGitAddTool);
        interpreter.registerTool(gitCommitTool, executeGitCommitTool);
        interpreter.registerTool(gitLogTool, executeGitLogTool);
        interpreter.registerTool(resizeImageTool, executeResizeImageTool);
        interpreter.registerTool(cropImageTool, executeCropImageTool);
        interpreter.registerTool(greyscaleImageTool, executeGreyscaleImageTool);
        interpreter.registerTool(rotateImageTool, executeRotateImageTool);
        interpreter.registerTool(generateImageTool, executeGenerateImageTool);
        interpreter.registerTool(countLinesInFileTool, executeCountLinesInFileTool);
        interpreter.registerTool(findTextInFileTool, executeFindTextInFileTool);
        interpreter.registerTool(getDirectoryStructureTool, executeGetDirectoryStructureTool);
        interpreter.registerTool(listFileTypesTool, executeListFileTypesTool);
        interpreter.registerTool(deepSearchTool, executeDeepSearchTool);
        interpreter.registerTool(minecraftPingTool, executeMinecraftPingTool);
        interpreter.registerTool(launchUITool, executeLaunchUITool);
        interpreter.registerTool(launchVirtualTerminalTool, executeLaunchVirtualTerminalTool);
        interpreter.registerTool(terminateProcessTool, executeTerminateProcessTool);
        interpreter.registerTool(npmInstallTool, executeNpmInstallTool);
        interpreter.registerTool(pipInstallTool, executePipInstallTool);
        interpreter.registerTool(aptInstallTool, executeAptInstallTool);
        interpreter.registerTool(brewInstallTool, executeBrewInstallTool);
        interpreter.registerTool(chocoInstallTool, executeChocoInstallTool);
        interpreter.registerTool(zipCompressTool, executeZipCompressTool);
        interpreter.registerTool(zipDecompressTool, executeZipDecompressTool);
        interpreter.registerTool(tarCompressTool, executeTarCompressTool);
        interpreter.registerTool(tarDecompressTool, executeTarDecompressTool);
        interpreter.registerTool(generateBoilerplateCodeTool, executeGenerateBoilerplateCodeTool);
        interpreter.registerTool(getEnvironmentVariableTool, executeGetEnvironmentVariableTool);
        interpreter.registerTool(setEnvironmentVariableTool, executeSetEnvironmentVariableTool);
        interpreter.registerTool(unsetEnvironmentVariableTool, executeUnsetEnvironmentVariableTool);
        interpreter.registerTool(changeFilePermissionsTool, executeChangeFilePermissionsTool);
        interpreter.registerTool(createSymbolicLinkTool, executeCreateSymbolicLinkTool);
        interpreter.registerTool(readSymbolicLinkTool, executeReadSymbolicLinkTool);
        interpreter.registerTool(deleteSymbolicLinkTool, executeDeleteSymbolicLinkTool);
        interpreter.registerTool(createScheduledTaskTool, executeCreateScheduledTaskTool);
        interpreter.registerTool(listScheduledTasksTool, executeListScheduledTasksTool);
        interpreter.registerTool(deleteScheduledTaskTool, executeDeleteScheduledTaskTool);
        interpreter.registerTool(checkPortTool, executeCheckPortTool);
        interpreter.registerTool(readClipboardTool, executeReadClipboardTool);
        interpreter.registerTool(writeClipboardTool, executeWriteClipboardTool);
        interpreter.registerTool(listDependenciesTool, executeListDependenciesTool);
        interpreter.registerTool(listContainersTool, executeListContainersTool);
        interpreter.registerTool(startContainerTool, executeStartContainerTool);
        interpreter.registerTool(stopContainerTool, executeStopContainerTool);
        interpreter.registerTool(getDiskUsageTool, executeGetDiskUsageTool);
        interpreter.registerTool(getMemoryUsageTool, executeGetMemoryUsageTool);
        interpreter.registerTool(getNetworkConfigTool, executeGetNetworkConfigTool);
        interpreter.registerTool(flushDnsCacheTool, executeFlushDnsCacheTool);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.log("\nWelcome to Open Interpreter! Type your message or '/exit' to quit, '/reset' to clear conversation.");
        const chat = (initialMessage) => __awaiter(this, void 0, void 0, function* () {
            const userInput = initialMessage || (yield new Promise((resolve) => {
                rl.question("User: ", (answer) => {
                    resolve(answer);
                });
            }));
            if (userInput.toLowerCase() === '/exit') {
                logger.info("User initiated exit.");
                rl.close();
                return;
            }
            if (userInput.toLowerCase() === '/reset') {
                interpreter.reset();
                console.clear();
                logger.info("Conversation has been reset. Welcome to Open Interpreter! Type your message or '/exit' to quit, '/reset' to clear conversation.");
                chat();
                return;
            }
            try {
                yield interpreter.chat(userInput);
            }
            catch (error) {
                logger.error(`Error during chat: ${error.message}`);
            }
            if (interpreter.loop) {
                chat(); // Continue loop
            }
            else if (!initialMessage) {
                chat(); // Keep asking for input if not in a loop and not from initial message
            }
        });
        // If there's a command line query, use it as the first message
        const initialQuery = argv._.join(' ');
        if (initialQuery) {
            yield chat(initialQuery);
            if (!options.loop) {
                rl.close();
            }
        }
        else {
            chat();
        }
    });
}
main().catch((error) => {
    logger.error(`An error occurred: ${error.message}`);
});
