export const executeShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec(command, (error: any, stdout: string, stderr: string) => {
      if (error) {
        reject(`Command failed: ${command}\nError: ${stderr}`);
      } else {
        resolve(stdout || stderr || `Command executed successfully: ${command}`);
      }
    });
  });
};
