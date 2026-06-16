import { expect } from '@playwright/test';
import { GitHubClient } from '../github.client';

export class RepositoryService {

    constructor(token, owner) {
        this.owner = owner;
        this.client = new GitHubClient(token);
    }

    async create(repoName) {

        const context = await this.client.getContext();

        const response = await context.post('/user/repos', {
            data: {
                name: repoName,
                private: false,
                description:
                    'Repo created via Playwright'
            }
        });

        expect(response.status()).toBe(201);

        return await response.json();
    }

    async get(repoName) {

        const context = await this.client.getContext();

        const response = await context.get(
            `/repos/${this.owner}/${repoName}`
        );

        expect(response.ok()).toBeTruthy();

        return await response.json();
    }

    async updateTopics(repoName, topics) {

        const context = await this.client.getContext();

        const response = await context.put(
            `/repos/${this.owner}/${repoName}/topics`,
            {
                data: {
                    names: topics
                }
            }
        );

        expect(response.status()).toBe(200);

        return await response.json();
    }

    async updateDescription(
        repoName,
        description
    ) {

        const context = await this.client.getContext();

        const response = await context.patch(
            `/repos/${this.owner}/${repoName}`,
            {
                data: {
                    description
                }
            }
        );

        expect(response.status()).toBe(200);

        return await response.json();
    }

    async delete(repoName) {

        const context = await this.client.getContext();

        const response = await context.delete(
            `/repos/${this.owner}/${repoName}`
        );

        expect(response.status()).toBe(204);
    }

    async verifyDeleted(repoName) {

        const context = await this.client.getContext();

        const response = await context.get(
            `/repos/${this.owner}/${repoName}`
        );

        expect(response.status()).toBe(404);

        return response.status();
    }

    async dispose() {
        await this.client.dispose();
    }
}