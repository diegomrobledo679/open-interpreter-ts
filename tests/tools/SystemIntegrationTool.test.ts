import { jest } from '@jest/globals';
import { executeLaunchUITool } from '@/tools/SystemIntegrationTool';
import { exec } from 'child_process';

jest.mock('child_process', () => ({
  exec: jest.fn((cmd: string, cb: (err: any) => void) => cb(null)),
  spawn: jest.fn(),
}));

describe('SystemIntegrationTool', () => {
  it('uses UI_BASE_URL environment variable', async () => {
    process.env.UI_BASE_URL = 'http://example.com';
    const msg = await executeLaunchUITool({ uiName: 'cyrah' });
    expect(msg).toContain('http://example.com/cyrah');
    delete process.env.UI_BASE_URL;
  });

  it('appends UI_ARGS query string', async () => {
    process.env.UI_ARGS = 'theme=dark';
    const msg = await executeLaunchUITool({ uiName: 'cyrah' });
    expect(msg).toContain('?theme=dark');
    delete process.env.UI_ARGS;
  });
});
