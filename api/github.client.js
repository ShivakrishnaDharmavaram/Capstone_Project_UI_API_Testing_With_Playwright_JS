import { request } from '@playwright/test';

export async function getGithubContext(token) {
    return await request.newContext({
        baseURL: process.env.GITHUB_API_BASE_URL,
        extraHTTPHeaders: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
        }
    });
}