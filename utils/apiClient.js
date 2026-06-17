import dotenv from 'dotenv';
dotenv.config();
import { request } from '@playwright/test';

export async function createApiContext() {
  return await request.newContext({
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  });
}
