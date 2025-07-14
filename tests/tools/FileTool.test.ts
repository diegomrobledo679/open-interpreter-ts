import { executeReadFileTool, executeWriteFileTool } from '@/tools/FileTool';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

describe('FileTool', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const testTempDir = path.join(__dirname, 'temp_test_files');
  const testFilePath = path.join(testTempDir, 'testfile.txt');

  beforeAll(() => {
    // Create a temporary directory for tests
    if (!fs.existsSync(testTempDir)) {
      fs.mkdirSync(testTempDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up the test file after each test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  afterAll(() => {
    // Clean up the temporary directory after all tests are done
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, { recursive: true, force: true });
    }
  });

  it('should write content to a file', async () => {
    const content = 'Hello, world!';
    const result = await executeWriteFileTool({ filePath: testFilePath, content });
    expect(result).toBe(`Content successfully written to ${testFilePath}`);
    const fileContent = fs.readFileSync(testFilePath, 'utf-8');
    expect(fileContent).toBe(content);
  });

  it('should read content from a file', async () => {
    const content = 'Hello, world!';
    fs.writeFileSync(testFilePath, content, 'utf-8');
    const result = await executeReadFileTool({ filePath: testFilePath });
    expect(result).toBe(`File content:\n${content}`);
  });

  it('should handle error when reading a non-existent file', async () => {
    const result = await executeReadFileTool({ filePath: 'nonexistentfile.txt' });
    expect(result).toContain('Error reading file');
  });
});