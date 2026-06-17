import { test, expect } from '@playwright/test';
import { RepositoryService } from '../api/services/RepositoryService';
import { LoginPage } from '../pages/LoginPage';

import dotenv from 'dotenv';
dotenv.config();

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
            console.log("Repo Created");
            
            //GET
            const repoDetails = await repoService.get(repoName);
            console.log("Repo Details: \n", 
                "Repository ID: " + repoDetails.id +"\n", 
                "Repo Name: " + repoDetails.name +"\n", 
                "Repository Full Name"+repoDetails.full_name);



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

            const loginPage =new LoginPage(page);

            await loginPage.navigate(githubUrl);

            await loginPage.login(username,password);

            await page.goto(repo.html_url);

            await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);

        } finally {

            //DELETE
            await repoService.delete(repoName);
            
            //GET
            await repoService.verifyDeleted(repoName);
            await repoService.dispose();
        }
    }
);