import { exec } from "child_process";
export const executeShellCommand = (command, options = {}) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: options.cwd, shell: options.shell, timeout: options.timeout }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
            }
            else {
                resolve((stdout || stderr).trim());
            }
        });
    });
};
