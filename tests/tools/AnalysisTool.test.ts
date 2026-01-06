import { jest } from '@jest/globals';
import * as fs from 'fs';
import { fileTypeFromFile } from 'file-type';
import { executeGetFileContentTypeTool } from '@/tools/AnalysisTool';

// Mock the file-type library
jest.mock('file-type', () => ({
  fileTypeFromFile: jest.fn(),
}));

// Mock the fs module if needed for other tests, though fileTypeFromFile handles file reading internally
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    ...jest.requireActual('fs').promises,
    readFile: jest.fn(),
  },
  readFileSync: jest.fn(),
}));

describe('AnalysisTool', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('executeGetFileContentTypeTool', () => {
    const mockFilePath = '/path/to/some/file.png';

    it('should return the correct content type for a known file type', async () => {
      (fileTypeFromFile as jest.Mock).mockResolvedValue({ ext: 'png', mime: 'image/png' });

      const result = await executeGetFileContentTypeTool({ filePath: mockFilePath });
      expect(result).toBe(`Content type of ${mockFilePath}: image/png`);
      expect(fileTypeFromFile).toHaveBeenCalledWith(mockFilePath);
    });

    it('should indicate if content type cannot be determined', async () => {
      (fileTypeFromFile as jest.Mock).mockResolvedValue(undefined);

      const result = await executeGetFileContentTypeTool({ filePath: mockFilePath });
      expect(result).toBe(`Could not determine content type for ${mockFilePath}.`);
      expect(fileTypeFromFile).toHaveBeenCalledWith(mockFilePath);
    });

    it('should handle errors during content type determination', async () => {
      const errorMessage = 'File not found';
      (fileTypeFromFile as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await executeGetFileContentTypeTool({ filePath: mockFilePath });
      expect(result).toBe(`Error determining content type for ${mockFilePath}: ${errorMessage}`);
      expect(fileTypeFromFile).toHaveBeenCalledWith(mockFilePath);
    });
  });
});
