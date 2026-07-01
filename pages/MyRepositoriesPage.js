export class MyRepositoriesPage {
    constructor(page) {
        this.page = page;

        // Locators for MyRepositoriesPage elements
        this.myRepositories = page.getByRole('link', { name: 'My repositories' });
        this.repoNameLabel = page.locator('strong[itemprop="name"]');
        this.myRepoName = page.locator('//*[text()="Capstone_Project_UI_API_Testing_With_Playwright_JS"]');
        this.newRepositoryButton = page.getByText('New repository');
    }

    // Method to navigate to My repositories page
    async navigateToMyRepositories() {
        await this.myRepositories.click();               
    }
    // Method to check if a specific repository is visible
    async isMyRepoVisible() {
        return await this.myRepoName.isVisible();
        await this.page.waitForLoadState('networkidle');     // wait for navigation to finish
                
    }

    // async validateRepositoryName(expectedRepoName) {
    //     await expect(this.repoNameLabel).toHaveText(expectedRepoName);
    // }
    // Method to navigate to create new repository page
    async navigateToCreateNewRepository() {
        await this.newRepositoryButton.click();        
    }
}
