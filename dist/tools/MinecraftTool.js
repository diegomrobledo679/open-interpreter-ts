var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from 'minecraft-protocol';
export const minecraftPingTool = {
    type: "function",
    function: {
        name: "minecraftPing",
        description: "Pings a Minecraft server to get its status (version, players, MOTD).",
        parameters: {
            type: "object",
            properties: {
                host: {
                    type: "string",
                    description: "The hostname or IP address of the Minecraft server.",
                },
                port: {
                    type: "number",
                    description: "Optional: The port of the Minecraft server. Defaults to 25565.",
                    default: 25565,
                },
            },
            required: ["host"],
        },
    },
};
export function executeMinecraftPingTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const client = createClient({
                host: args.host,
                port: args.port || 25565,
                username: 'bot', // A dummy username is required for ping
                version: '1.16.5', // Specify a common Minecraft version
            });
            client.on('error', (err) => {
                reject(`Error pinging Minecraft server: ${err.message}`);
            });
            client.on('end', () => {
                // This event fires when the connection closes, usually after receiving status
            });
            client.once('status', (status) => {
                client.end(); // Close the connection after receiving status
                resolve(JSON.stringify(status, null, 2));
            });
            // The client needs to be connected to send a ping request
            // The library handles the ping request automatically on connection for status
        });
    });
}
