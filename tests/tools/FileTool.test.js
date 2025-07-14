var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { executeReadFileTool, executeWriteFileTool } from '@/tools/FileTool';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
describe('FileTool', () => {
    const tempDir = os.tmpdir();
    const testFilePath = path.join(tempDir, 'testfile.txt');
    afterEach(() => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });
    it('should write content to a file', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = 'Hello, world!';
        const result = yield executeWriteFileTool({ filePath: testFilePath, content });
        expect(result).toBe(`Content successfully written to ${testFilePath}`);
        const fileContent = fs.readFileSync(testFilePath, 'utf-8');
        expect(fileContent).toBe(content);
    }));
    it('should read content from a file', () => __awaiter(void 0, void 0, void 0, function* () {
        const content = 'Hello, world!';
        fs.writeFileSync(testFilePath, content, 'utf-8');
        const result = yield executeReadFileTool({ filePath: testFilePath });
        expect(result).toBe(`File content:\n${content}`);
    }));
    it('should handle error when reading a non-existent file', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield executeReadFileTool({ filePath: 'nonexistentfile.txt' });
        expect(result).toContain('Error reading file');
    }));
});
