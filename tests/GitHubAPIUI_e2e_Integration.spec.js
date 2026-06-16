import {test, expect} from '@playwright/test';
import {createRepo, getRepo, updateTopics, updateDescription,
    deleteRepo, verifyRepoDeleted} from '../api/repo.api';
import {LoginPage} from '../pages/LoginPage';
import {HomePage} from '../pages/HomePage';
import { MyRepositoriesPage } from '../pages/MyRepositoriesPage';
import dotenv from 'dotenv';
dotenv.config();

test('Create a repository via API and verify in UI', async ({ page })=> {
        const token = process.env.GITHUB_TOKEN;
        const username = process.env.GITHUB_USER;
        const password = process.env.GITHUB_PASSWORD;
        const githubUrl = process.env.GITHUB_URL;
        const repoName = `playwright-api-ui-${Date.now()}`;
        let repo;

        try {
            // CREATE
            repo = await createRepo(token, repoName);
            expect(repo.name)
                .toBe(repoName);
            console.log(`Repository '${repoName}' created successfully`);

            // GET
            const repoDetails =await getRepo(token,username,repoName);
            expect(repoDetails.name).toBe(repoName);
            console.log(`Repository '${repoName}' verified`);

            // PUT
            const topicsResponse =await updateTopics(token,username,repoName,
                    [     
                        'playwright',
                        'testing',
                        'api'
                    ]
                );

            expect(topicsResponse.names).toContain('playwright');
            console.log('Topics updated:',topicsResponse.names);

            // PATCH

            const patchResponse =await updateDescription(
                    token,
                    username,
                    repoName,
                    'Updated description via PATCH'
                );

            expect(patchResponse.description).toBe('Updated description via PATCH');
            console.log('Description updated successfully');

            // UI LOGIN

            const loginPage =new LoginPage(page);
            await loginPage.navigate(githubUrl);

            await expect(page).toHaveTitle(/Sign in to GitHub/);

            await loginPage.login(username,password);

            console.log('Logged into GitHub UI');

            // OPEN REPO

            await page.goto(repo.html_url);

            // VERIFY UI

            await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);

            console.log('Repository verified in UI');

        } finally {

            await deleteRepo(token,username,repoName);
        }

        const status = await verifyRepoDeleted(token,username,repoName);
        console.log('Deletion verification status:', status);
    }
);




// test('Create a repository via API and verify in UI', async ({request, page}) => {
//     const token = process.env.GITHUB_TOKEN;
//     const repoName = `playwright-Api-To-Ui-test-${Date.now()}`;
//     const url = process.env.GITHUB_URL || 'https://github.com';
//     const github_api = process.env.GITHUB_API_BASE_URL;
//     const username = process.env.GITHUB_USER;
//     const password = process.env.GITHUB_PASSWORD;

//     try
//     {
//     //Create a repository via API
//     const repoResponse = await createRepo(token, repoName);
//     expect(repoResponse.name).toBe(repoName);
//     console.log(`Repository '${repoName}' created successfully.`);


//     // retrive the created repository to verify it exists
//     const getResponse = await request.get(`${github_api}/repos/${username}/${repoName}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }
//     );
//     console.log('GET Status:', getResponse.status());
//     console.log('GET Body:', await getResponse.text());

//     expect(getResponse.ok()).toBeTruthy();
//     const getBody = await getResponse.json();
//     expect(getBody.name).toBe(repoName);
//     console.log(`Repository '${repoName}' exists and is accessible.`);

//     // //PUT - Update Repository Topics
//     const putResponse = await request.put(`${github_api}/repos/${username}/${repoName}/topics`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 Accept: 'application/vnd.github+json'
//             },
//             data: {names: ['playwright', 'testing', 'api']}

//         }
//     );
   
//     // const putResponse = await request.put(`${github_api}/repos/${username}/${repoName}/topics`, {
//     // data: { names: ['playwright', 'testing', 'api'] }});
//     expect(putResponse.status()).toBe(200);
//     const putBody = await putResponse.json();
//     expect(putBody.names).toContain('playwright');
//     console.log(`Successfully updated topics for '${repoName}':`, putBody.names);

//     // //PATCH - Edit Repo Description
//     // const patchResponse = await request.patch(`${github_api}/repos/${username}/${repoName}`, {
//     //     data: { description: 'Updated description via PATCH' }
//     // });

//     const patchResponse = await request.patch(`${github_api}/repos/${username}/${repoName}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 Accept: 'application/vnd.github+json'
//             },
//             data: { description: 'Updated description via PATCH'}

//         }
//     );

//     expect(patchResponse.status()).toBe(200);
//     const patchBody = await patchResponse.json();
//     expect(patchBody.description).toBe('Updated description via PATCH');
//     console.log(`Repository '${repoName}' description updated successfully.`);
//     console.log(`Repository '${repoName}' updated description:`, patchBody.description);
    
//     //Navigate to GitHub UI
//     const loginPage = new LoginPage(page);
//     await loginPage.navigate(url);
//     await page.waitForLoadState('domcontentloaded');
//     await expect(page).toHaveTitle(/Sign in to GitHub/);
        
//     // sign in to GitHub with valid credentials
//     await loginPage.login(username, password);

//     const currentUrl =await loginPage.getCurrentURL();
//     console.log("URL after login:", currentUrl);

//     // Navigate to repo
//     await page.goto(repoResponse.html_url);

//     // Validate repo in UI
//     await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);
//     } finally {
//         // Clean up - delete the repository via API
//         await deleteRepo(token, username, repoName);
//     }

//     const checkResponse = await request.get(`https://api.github.com/repos/${username}/${repoName}`);
//     expect(checkResponse.status()).toBe(404);
//     console.log("Verified repository deletion via API with status code:", checkResponse.status());
// });


// // to run this specific file, use the command: npx playwright test tests/GitHubAPIUI_e2e_Integration.spec.js