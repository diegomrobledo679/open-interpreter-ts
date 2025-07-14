var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const listContainersTool = {
    type: "function",
    function: {
        name: "listContainers",
        description: "Conceptually lists running or stopped containers (e.g., Docker, Podman). This is a placeholder and requires integration with a container runtime.",
        parameters: {
            type: "object",
            properties: {
                all: {
                    type: "boolean",
                    description: "Optional: If true, lists all containers (running and stopped). Defaults to false (only running).",
                    nullable: true,
                },
            },
            required: [],
        },
    },
};
export function executeListContainersTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = args.all ? 'all' : 'running';
        return `Conceptually listing ${status} containers. A real implementation would call Docker/Podman CLI or API.`;
    });
}
export const startContainerTool = {
    type: "function",
    function: {
        name: "startContainer",
        description: "Conceptually starts a stopped container. This is a placeholder.",
        parameters: {
            type: "object",
            properties: {
                containerId: {
                    type: "string",
                    description: "The ID or name of the container to start.",
                },
            },
            required: ["containerId"],
        },
    },
};
export function executeStartContainerTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return `Conceptually starting container ${args.containerId}. A real implementation would call Docker/Podman CLI or API.`;
    });
}
export const stopContainerTool = {
    type: "function",
    function: {
        name: "stopContainer",
        description: "Conceptually stops a running container. This is a placeholder.",
        parameters: {
            type: "object",
            properties: {
                containerId: {
                    type: "string",
                    description: "The ID or name of the container to stop.",
                },
            },
            required: ["containerId"],
        },
    },
};
export function executeStopContainerTool(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return `Conceptually stopping container ${args.containerId}. A real implementation would call Docker/Podman CLI or API.`;
    });
}
