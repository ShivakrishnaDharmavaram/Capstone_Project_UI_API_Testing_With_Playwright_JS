import { test as setup } from '@playwright/test';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import logger from '../utils/logger.js';

dotenv.config();

const authDir = path.resolve('playwright/.auth');
const authFile = path.join(authDir, 'user.json');

setup('authenticate with GitHub', async ({ page }) => {
    if (existsSync(authFile)) {
        logger.info(`Using existing storage state from ${authFile}`);
        return;
    }

    const username = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;
    const githubUrl = process.env.GITHUB_URL || 'https://github.com/login';

    if (!username || !password) {
        throw new Error('GITHUB_USER and GITHUB_PASSWORD must be set to create storage state.');
    }

    const loginPage = new LoginPage(page);

    await loginPage.navigate(githubUrl);
    await loginPage.login(username, password);

    await page.waitForURL(/https:\/\/github\.com\/(?!login)/, { timeout: 30000 });

    await mkdir(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });

    logger.info(`Storage state saved to ${authFile}`);
});
