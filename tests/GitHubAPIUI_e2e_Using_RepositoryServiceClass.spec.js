import { test, expect } from '@playwright/test';
import { RepositoryService } from '../api/services/RepositoryService';
import { MyRepositoriesPage } from '../pages/MyRepositoriesPage';
import logger from '../utils/logger.js';
import { createAllureLogger } from '../utils/allureLogger.js';

import dotenv from 'dotenv';
dotenv.config();

createAllureLogger();

test('Create repository via API and verify in UI',async ({ page }) => {

        const token = process.env.GITHUB_TOKEN;
        const username = process.env.GITHUB_USER;
        const password = process.env.GITHUB_PASSWORD;
        const githubUrl = process.env.GITHUB_URL;
        const repoName = `playwright-api-ui-${Date.now()}`;
        const repoService = new RepositoryService(token,username);

        try {
            //POST
            const repo = await repoService.create(repoName);
            expect(repo.name).toBe(repoName);
            logger.info('Repo Created');
            
            //GET
            const repoDetails = await repoService.get(repoName);
            logger.info(`Repo Details: Repository ID: ${repoDetails.id}, Repo Name: ${repoDetails.name}, Repository Full Name: ${repoDetails.full_name}`);



            //PUT
            const topics =await repoService.updateTopics(repoName,
                    [
                        'playwright',
                        'api',
                        'testing'
                    ]
                );
            expect(topics.names).toContain('playwright');

            //PATCH
            const updatedRepo = await repoService.updateDescription(
                    repoName,'Updated via PATCH');

            expect(updatedRepo.description).toBe('Updated via PATCH');

            //UI
            await page.goto(repo.html_url);

            const myRepositoriesPage = new MyRepositoriesPage(page);

            // await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);
            await expect(myRepositoriesPage.repoNameLabel).toHaveText(repoName);

        } finally {

            //DELETE
            await repoService.delete(repoName);
            
            //GET
            await repoService.verifyDeleted(repoName);
            await repoService.dispose();
        }
    }
);