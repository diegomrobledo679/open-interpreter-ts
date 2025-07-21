import { jest } from '@jest/globals';

describe('EmailTool', () => {
  it('sends an email', async () => {
    const { executeSendEmailTool } = await import('@/tools/EmailTool');
    process.env.EMAIL_HOST = 'smtp.example.com';
    process.env.EMAIL_USER = 'user';
    process.env.EMAIL_PASS = 'pass';
    const msg = await executeSendEmailTool({ to: 'a@b.c', subject: 'Hi', text: 'Test' });
    expect(msg).toContain('Email sent');
  });
});
