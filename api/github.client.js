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

export class GitHubClient {

    constructor(token) {
        this.token = token;
    }

    async getContext() {

        if (!this.context) {

            this.context = await request.newContext({
                baseURL: process.env.GITHUB_API_BASE_URL,
                extraHTTPHeaders: {
                    Authorization: `Bearer ${this.token}`,
                    Accept: 'application/vnd.github+json'
                }
            });
        }

        return this.context;
    }

    async dispose() {
        if (this.context) {
            await this.context.dispose();
        }
    }
}