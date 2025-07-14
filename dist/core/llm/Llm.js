var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Models } from "../../const.js";
import { logger } from "../../utils/logger.js";
import { assert } from "console";
import { Role, MessageType } from "../types.js";
import OpenAI from 'openai';
export class Llm {
    constructor(interpreter, options) {
        this.temperature = 0;
        this.interpreter = interpreter;
        this.contextWindow = interpreter.maxOutput;
        this.maxTokens = interpreter.maxOutput;
        // Determine LLM provider and configuration
        const llmProvider = options.llmProvider || 'openai';
        this.model = options.llmModel || Models.GPT_4O;
        const llmApiKey = options.llmApiKey || process.env.OPENAI_API_KEY;
        let llmBaseUrl = options.llmBaseUrl;
        if (llmProvider === 'ollama') {
            llmBaseUrl = llmBaseUrl || 'http://localhost:11434/v1';
        }
        else if (llmProvider === 'openai') {
            llmBaseUrl = llmBaseUrl || 'https://api.openai.com/v1';
        }
        this.openai = new OpenAI({
            apiKey: llmApiKey,
            baseURL: llmBaseUrl,
        });
    }
    run(messages, tools) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug("Llm.run called.");
            if (this.maxTokens && this.contextWindow && this.maxTokens > this.contextWindow) {
                logger.warn("Warning: max_tokens is larger than context_window. Setting max_tokens to 0.2 times the context_window.");
                this.maxTokens = Math.floor(0.2 * this.contextWindow);
            }
            assert(messages[0].role === Role.System, "First message must have the role 'system'");
            assert(!messages.slice(1).some(m => m.role === Role.System), "No message after the first can have the role 'system'");
            const model = this.model;
            logger.info(`Running LLM with model: ${model}`);
            logger.debug(`Messages sent to LLM: ${JSON.stringify(messages)}`);
            const preparedMessages = messages.map(msg => (Object.assign({ role: msg.role.toLowerCase(), content: msg.content }, (msg.tool_calls && { tool_calls: msg.tool_calls }))));
            const maxRetries = 3;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = yield this.openai.chat.completions.create({
                        model: model,
                        messages: preparedMessages, // Cast to any to satisfy OpenAI type, as we handle roles dynamically
                        temperature: this.temperature,
                        max_tokens: this.maxTokens || undefined,
                        tools: tools,
                    });
                    const choice = response.choices[0];
                    if (!choice) {
                        logger.warn("LLM returned no choices.");
                        return { role: Role.Assistant, messageType: MessageType.Message, content: "" };
                    }
                    const message = choice.message;
                    logger.debug(`LLM response content: ${message.content}`);
                    logger.debug(`LLM tool calls: ${JSON.stringify(message.tool_calls)}`);
                    return {
                        role: Role.Assistant,
                        messageType: MessageType.Message,
                        content: message.content || "",
                        tool_calls: message.tool_calls || [],
                    };
                }
                catch (error) {
                    logger.error(`Error during LLM completion (Attempt ${i + 1}/${maxRetries}): ${error}`);
                    if (i < maxRetries - 1) {
                        yield new Promise(res => setTimeout(res, 1000 * 2 ** i));
                    }
                    else {
                        throw error;
                    }
                }
            }
            throw new Error("Failed to get LLM completion after multiple retries.");
        });
    }
}
