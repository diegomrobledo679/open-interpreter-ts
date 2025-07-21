import { jest } from '@jest/globals';
import { executeOpenPathTool } from '@/tools/OpenPathTool';
import { exec } from 'child_process';

jest.mock('child_process', () => ({
  exec: jest.fn((cmd: string, cb: (err?: any) => void) => cb(null)),
}));

describe('OpenPathTool', () => {
  it('opens path with exec', async () => {
    const msg = await executeOpenPathTool({ path: '/tmp' });
    expect(msg).toContain('Opened');
  });
});
