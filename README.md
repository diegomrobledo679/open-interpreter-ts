# Open Interpreter (Unofficial JS/TS Port)

This is an unofficial port of the Open Interpreter to the JavaScript/TypeScript ecosystem, aiming to provide a robust and extensible environment for AI-driven code execution and interaction.

## Features:

This CLI agent now supports a wide range of functionalities, including:

*   **Multi-Language Code Execution:** Seamlessly execute code in various programming languages, including:
    *   Python
    *   JavaScript (Node.js)
    *   Shell (Bash/Zsh)
    *   Ruby
    *   Perl
    *   PHP
    *   PowerShell
    *   Java
    *   Go
    *   C++
    *   Rust
    *   Swift
    *   C#
    *   Kotlin
    *   R
    *   TypeScript
    *   Groovy
    *   Scala

*   **Intelligent Environment Setup:** Automatically checks for and installs necessary language runtimes and package managers (e.g., `python`, `node`, `npm`, `brew`, `apt`, `yum`, `choco`, `rustup`) across different operating systems (Linux, macOS, Windows).

*   **Code Analysis Tools:**
    *   **Syntax Checking:** Utilizes language-specific tools to perform syntax checks on provided code, reporting errors and warnings.
    *   **Automatic Error Fixing and Formatting:** Uses Prettier for JavaScript/TypeScript and leverages `autopep8` or `black` when available for Python to fix and format code snippets.

*   **Configurable Options:** Many aspects of the interpreter's behavior can be configured via command-line arguments, including:
    *   `--autoRun`: Automatically execute code blocks without user confirmation.
    *   `--loop`: Continuously run the interpreter in a loop until a breaking condition is met.
    *   `--safeMode`: Control the level of file system access during code execution.
    *   `--shrinkImages`: Automatically resize images for vision processing.
    *   `--disableTelemetry`: Disable telemetry data contribution.
    *   `--inTerminalInterface`: Optimize output for terminal display.
    *   `--speakMessage`: Enable text-to-speech for output messages.
    *   `--alwaysApplyMessageTemplate`: Always apply a predefined message template to LLM responses.
    *   `--multiLine`: Enable multi-line input.
    *   `--contributeConversation`: Allow conversation data to be contributed for telemetry.
    *   `--plainTextDisplay`: Force plain text output.
    *   `--highlightActiveLine`: Highlight the active line in code blocks.
    *   `--autoFixCode`: Enable automatic code fixing attempts.
    *   `--displayMode`: Set the display mode ('cli' or 'gui').
    *   `--uiName`: Specify which UI to launch when the display mode is `gui` or when running the `cyrah` command.
    *   `--conversationHistory`: Enable or disable conversation history.
    *   `--conversationFilename`: Specify the conversation history filename.

*   **Extensible Tooling:** Easily integrate new tools and functionalities.
*   **File Utilities:** Built-in helpers for reading, writing, and recursively searching files.
*   **System Management Tools:** Retrieve hardware details and manage network interfaces across platforms.
*   **Conceptual GUI Integration:** Includes conceptual methods for display updates and input event handling, laying the groundwork for future graphical user interface implementations.

## Installation and Usage:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the TypeScript source:

   ```bash
   npm run build
   ```

3. Run the automated test suite:

   ```bash
   npm test
   ```

4. Start the interpreter:

   ```bash
   node dist/index.js
   ```

After installation you can also launch the UI directly via the bundled command:

```bash
npx cyrah
```

## Configuration via Environment Variables

The interpreter reads various settings from environment variables if corresponding CLI options are omitted. Useful variables include:

- `LLM_PROVIDER` – Provider name like `openai` or `ollama`.
- `LLM_MODEL` – Model identifier to use.
- `LLM_API_KEY` – API key for the provider.
- `LLM_BASE_URL` – Base URL for API requests.
- `OPENAI_BASE_URL` – Override the default OpenAI API URL when using the `openai` provider.
- `OLLAMA_BASE_URL` – Override the default Ollama API URL when using the `ollama` provider.
- `OPENAI_API_KEY` – API key specifically for OpenAI.
- `OLLAMA_API_KEY` – API key specifically for Ollama if required.
- `LLM_TEMPERATURE` – Sampling temperature for responses.
- `LLM_MAX_TOKENS` – Maximum tokens to request from the model.
- `AUTO_RUN` – Set to `true` or `false` to control automatic execution of code blocks.
- `LOOP` – Set to `true` to keep the interpreter running in a loop.
- `OFFLINE` – Set to `true` to disable network access by default.
- `VERBOSE` – Set to `true` for verbose logging output.
- `DEBUG` – Set to `true` to enable debug logging.
- `SAFE_MODE` – Specify the default safe mode level.
- `MAX_OUTPUT` – Maximum number of characters to display from tool or code output.
- `CONVERSATION_HISTORY_PATH` – Directory where conversation logs are stored.
- `CONVERSATION_FILENAME` – Name of the JSON file used to save conversations.
- `CONVERSATION_MAX_LENGTH` – Maximum number of messages to keep in memory and
  in saved conversation history.
- `SKILLS_PATH` – Directory containing custom skill modules.
- `IMPORT_SKILLS` – Set to `true` to automatically load skills on startup.
- `UI_BASE_URL` – Base URL used by the `launchUI` tool if no URL is provided.
- `UI_NAME` – Name of the UI to launch when running the `cyrah` command or when
  `DISPLAY_MODE` is set to `gui`.
- `DISPLAY_MODE` – Set to `gui` to automatically open the UI when the interpreter starts.

Create a `.env` file with these values to avoid passing them as flags.
