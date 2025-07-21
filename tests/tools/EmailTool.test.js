import { jest } from '@jest/globals';

let executeSendEmailTool;
beforeAll(async () => {
  ({ executeSendEmailTool } = await import('@/tools/EmailTool'));
});

test('sends an email', async () => {
  process.env.EMAIL_HOST = 'smtp.example.com';
  process.env.EMAIL_USER = 'user';
  process.env.EMAIL_PASS = 'pass';
  const msg = await executeSendEmailTool({ to: 'a@b.c', subject: 'Hi', text: 'Test' });
  expect(msg).toContain('Email sent');
});
