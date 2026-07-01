// import {request, expect} from '@playwright/test';

// export async function createRepo(token, repoName) {
//     const context = await request.newContext({
//         baseURL: 'https://api.github.com',
//         extraHTTPHeaders: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/vnd.github+json'
//         }
//     });

//     const response = await context.post('/user/repos', {
//         data: {
//             name: repoName,
//             private: false,
//             description: 'Repo created via Playwright API Automation'
//         }
//     });
//     console.log("Repository created:", repoName);
//     console.log("status code:", response.status());
//     console.log("Response body:", await response.json());

//     expect(response.status()).toBe(201);

//     return await response.json();
// }

// export async function deleteRepo(token, owner, repoName) {
//     const context = await request.newContext({
//         baseURL: 'https://api.github.com',
//         extraHTTPHeaders: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/vnd.github+json'
//         }
//     });

//     const response = await context.delete(`/repos/${owner}/${repoName}`);
//     expect (response.status()).toBe(204);
//     console.log("Repository deleted:", repoName);
//     console.log("status code:", response.status());
// }


import { expect } from '@playwright/test';
import { getGithubContext } from './github.client';
import logger from '../utils/logger.js';

export async function createRepo(token, repoName) {

    const context = await getGithubContext(token);

    const response = await context.post('/user/repos', {
        data: {
            name: repoName,
            private: false,
            description: 'Repo created via Playwright API Automation'
        }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    logger.info(`Repository created: ${repoName}`);

    return body;
}

export async function getRepo(token, owner, repoName) {

    const context = await getGithubContext(token);

    const response = await context.get(
        `/repos/${owner}/${repoName}`
    );

    expect(response.ok()).toBeTruthy();

    return await response.json();
}

export async function updateTopics(
    token,
    owner,
    repoName,
    topics
) {

    const context = await getGithubContext(token);

    const response = await context.put(
        `/repos/${owner}/${repoName}/topics`,
        {
            data: {
                names: topics
            }
        }
    );

    expect(response.status()).toBe(200);

    return await response.json();
}

export async function updateDescription(
    token,
    owner,
    repoName,
    description
) {

    const context = await getGithubContext(token);

    const response = await context.patch(
        `/repos/${owner}/${repoName}`,
        {
            data: {
                description
            }
        }
    );

    expect(response.status()).toBe(200);

    return await response.json();
}

export async function deleteRepo(
    token,
    owner,
    repoName
) {

    const context = await getGithubContext(token);

    const response = await context.delete(
        `/repos/${owner}/${repoName}`
    );

    expect(response.status()).toBe(204);

    logger.info(`Repository deleted: ${repoName}`);
}

export async function verifyRepoDeleted(
    token,
    owner,
    repoName
) {

    const context = await getGithubContext(token);

    const response = await context.get(
        `/repos/${owner}/${repoName}`
    );

    expect(response.status()).toBe(404);

    return response.status();
}