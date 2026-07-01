# Capstone Project: UI & API Testing with Playwright JS

A comprehensive test automation framework for GitHub using Playwright that covers API testing, UI testing, logging, reporting, and advanced automation features.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup & Installation](#setup--installation)
3. [Project Structure](#project-structure)
4. [Test Coverage (16 Points)](#test-coverage-16-points)
5. [Running Tests](#running-tests)
6. [Reports & Logging](#reports--logging)

---

## Project Overview

This project demonstrates enterprise-grade test automation for GitHub's UI and API, implementing best practices including:
- **Positive & Negative Test Cases**: Login validation, repository creation, file operations
- **Authentication & Authorization**: Stored sessions, token-based API auth
- **Reusable Components**: Page Object Model (POM), API client utilities
- **Data-Driven Approach**: External JSON and .env files
- **Comprehensive Reporting**: Allure Reports with log attachments
- **Advanced Features**: Logging, tagging, DDT, CI integration

---

## Setup & Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- GitHub account with a valid personal access token

### Step 1: Install Dependencies

```bash
npm install
```

**Installed Dependencies:**
- `@playwright/test` - Test framework
- `allure-playwright` - Allure reporting integration
- `dotenv` - Environment variable management
- `winston` - Structured logging
- `exceljs` - Excel file handling
- `csv-parse` - CSV parsing

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
GITHUB_USER=your_github_username
GITHUB_PASSWORD=your_github_password
GITHUB_TOKEN=your_personal_access_token
GITHUB_URL=https://github.com
GITHUB_API_BASE_URL=https://api.github.com
```

### Step 3: Generate Authentication Token

1. Go to GitHub Settings → Developer Settings → Personal access tokens
2. Create a new token with `repo` scope
3. Copy and paste in `.env` as `GITHUB_TOKEN`

### Step 4: Install Browsers

```bash
npx playwright install
```

---

## Project Structure

```
Capstone_Project_UI_API_Testing_With_Playwright_JS/
├── pages/                           # Page Object Model (UI Pages)
│   ├── LoginPage.js                 # Login page interactions
│   ├── HomePage.js                  # GitHub home page
│   ├── MyRepositoriesPage.js         # Repositories listing
│   ├── NewRepoCreationPage.js        # Repository creation
│   └── NewRepoHomePage.js            # Repository details page
│
├── api/                             # API Testing Layer
│   ├── github.client.js              # HTTP context & authentication
│   ├── repo.api.js                   # Repository API functions
│   └── services/
│       └── RepositoryService.js      # Reusable repository service class
│
├── tests/                           # Test Specifications
│   ├── GitHubUiTest1.spec.js         # UI tests (duplication of UiTest2)
│   ├── GitHubUiTest2.spec.js         # Complete UI test suite
│   ├── GitHubAPIUI_e2e_Integration.spec.js   # API + UI integration tests
│   ├── GitHubAPIUI_e2e_Using_RepositoryServiceClass.spec.js
│   └── githubUser.spec.js            # API authentication tests
│
├── utils/                           # Utilities & Helpers
│   ├── logger.js                     # Winston logger configuration
│   ├── allureLogger.js               # Log attachment for Allure reports
│   ├── apiClient.js                  # Reusable API client
│   ├── testData.js                   # Test data generation functions
│   └── updatedtestData.json          # Sample test data
│
├── auth/                            # Authentication Setup
│   └── auth.setup.js                 # Playwright authentication setup
│
├── files/                           # Test Data Files
│   └── NewFileDetails.json           # File creation test data
│
├── playwright/                      # Playwright Config
│   ├── .auth/
│   │   └── user.json                 # Stored session state
│   └── config.js (see playwright.config.js)
│
├── allure-results/                  # Allure report data
├── logs/                            # Execution logs
├── test-results/                    # Test execution results
├── playwright-report/               # HTML test report
│
├── playwright.config.js             # Playwright configuration
├── package.json                     # Dependencies & scripts
├── .env                            # Environment variables
└── README.md                        # This file
```

---

## Test Coverage

### 1. Write Tests (+ve, -ve, no auth, auth, presentation)

#### A. API Tests
**File:** `tests/githubUser.spec.js`

**Test Cases:**
- **Positive Test**: ✓ Valid credentials → Retrieve user details (TC-01)
  ```javascript
  test('TC-01- Verify that user is able to get authenticated user details with valid credentials', async () => {
      const response = await api.get('/user');
      expect(response.status()).toBe(200);
  });
  ```
- **Negative Test**: ✗ Invalid token → 401 Unauthorized (TC-02)
  ```javascript
  test('TC-02- Verify that user is not able to access gitHub api when token is invalid', async () => {
      const response = await request.get('https://api.github.com/user', {
          headers: { Authorization: 'Bearer invalid_token' }
      });
      expect(response.status()).toBe(401);
  });
  ```

#### B. UI Tests
**File:** `tests/GitHubUiTest2.spec.js`

**Test Cases:**
- **Authentication Test** (TC-01): Verify login using stored session
- **Navigation Test** (TC-02): Verify dashboard and repo navigation
- **Repository Operations** (TC-03, TC-04): Create repositories with various settings
- **File Operations** (TC-05): Create files in repositories

**Integration Test:**
**File:** `tests/GitHubAPIUI_e2e_Integration.spec.js`

Combines API operations with UI verification:
```javascript
// CREATE via API
repo = await createRepo(token, repoName);

// VERIFY in UI
await page.goto(repo.html_url);
await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);

// DELETE via API
await deleteRepo(token, username, repoName);
```

---

### 2. Identify Tests Which Can Be Automated

**Automated Scenarios:**
- ✅ User authentication flows
- ✅ CRUD operations (Create, Read, Update, Delete repositories)
- ✅ Navigation flows
- ✅ Data validation
- ✅ API response status codes
- ✅ UI element visibility and properties
- ✅ Session management

**Non-Automated (Manual):**
- Performance testing under load
- Visual regression with different browsers
- Network latency scenarios

---

### 3. Automate the Scripts

**Framework:** Playwright Test
**Language:** JavaScript (ES6+)
**Configuration:** `playwright.config.js`

**Key Features:**
```javascript
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html'], ['allure-playwright']],
    use: {
        trace: 'retain-on-failure',
        storageState: 'playwright/.auth/user.json'
    }
});
```

**Test Execution Modes:**
- Serial mode (tests run one after another)
- Parallel mode (tests run simultaneously)
- Headed mode (visible browser)
- Headed mode (headless, no visible browser)

---

### 4. Reusable Code / Utilities

#### Page Object Model (POM)
**File:** `pages/LoginPage.js`
```javascript
export class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async login(username, password) {
        // Reusable login logic
    }
}
```

**Benefits:**
- Centralized element locators
- Easy maintenance
- Reduced code duplication

#### API Utilities
**File:** `api/repo.api.js`
```javascript
export async function createRepo(token, repoName) {
    const context = await getGithubContext(token);
    return await context.post('/user/repos', { data: {...} });
}

export async function deleteRepo(token, owner, repoName) {
    const context = await getGithubContext(token);
    return await context.delete(`/repos/${owner}/${repoName}`);
}
```

#### Service Layer
**File:** `api/services/RepositoryService.js`
```javascript
export class RepositoryService {
    constructor(token, username) {
        this.githubClient = new GitHubClient(token);
        this.username = username;
    }

    async create(repoName) {
        // Reusable repository creation
    }

    async get(repoName) {
        // Reusable repository retrieval
    }
}
```

---

### 5. Data Coming from Files (No Hard Coded Values)

#### Environment Variables
**File:** `.env`
```
GITHUB_USER=username
GITHUB_PASSWORD=password
GITHUB_TOKEN=token
GITHUB_URL=https://github.com
```

**Usage in Code:**
```javascript
const username = process.env.GITHUB_USER;
const token = process.env.GITHUB_TOKEN;
```

#### JSON Test Data
**File:** `files/NewFileDetails.json`
```json
{
    "fileName": "README.md",
    "description": "Updated via Playwright UI Automation Test",
    "topics": {
        "names": ["playwright", "automation", "javascript"]
    }
}
```

**Usage:**
```javascript
import NewFileDetails from '../files/NewFileDetails.json';
await newRepoHomePage.fillFileDetails(
    NewFileDetails.fileName,
    NewFileDetails.description
);
```

#### Test Data Generation
**File:** `utils/testData.js`
```javascript
export function createRepoPayload() {
    return {
        name: `playwright-ui-test-${Date.now()}`,
        description: 'Repo created via Playwright UI Automation Test',
        private: false,
        owner: process.env.GITHUB_USER
    };
}
```

---

### 6. Important Validations

#### Status Code Validation
```javascript
expect(response.status()).toBe(201);  // Repository created
expect(response.status()).toBe(204);  // Repository deleted
expect(response.status()).toBe(401);  // Unauthorized
```

#### Header Validation
```javascript
const headers = response.headers();
expect(headers['content-type']).toContain('application/json');
```

#### JSON Response Validation
```javascript
const body = await response.json();
expect(body.name).toBe(repoName);
expect(body).toHaveProperty('id');
expect(body).toHaveProperty('html_url');
```

#### Array & Single Value Validation
```javascript
// Array validation
expect(topicsResponse.names).toContain('playwright');

// Single value validation
expect(repoDetails.private).toBe(false);
```

#### URL Validation
```javascript
await expect(page).toHaveURL('https://github.com/');
await expect(page).toHaveURL(/https:\/\/github\.com\/(?!login)/);
```

#### Element Visibility Validation
```javascript
await expect(page.locator('strong[itemprop="name"]')).toHaveText(repoName);
```

---

### 7. Reports (Internal, Allure/Extent)

#### HTML Report (Built-in)
```bash
# View Playwright HTML report
npx playwright show-report
```

**Features:**
- Test execution timeline
- Screenshot on failure
- Video recording
- Trace files

#### Allure Report
**File:** `playwright.config.js`
```javascript
reporter: [
    ['html'],
    ['allure-playwright', { resultsDir: 'allure-results' }]
]
```

**Generate & View:**
```bash
# Generate Allure report
npm run allure

# Serving on http://localhost:60203
```

**Allure Features:**
- Detailed test metrics
- Execution timeline
- Attachments (logs, screenshots)
- Trends over time
- Test categorization

---

### 8. Data-Driven Testing (DDT)

**Current Implementation:**
- Uses dynamic test data from `testData.js`
- Generates unique repo names using timestamps

**To Implement Full DDT:**
```javascript
const testData = [
    { repoName: 'test-repo-1', isPrivate: true },
    { repoName: 'test-repo-2', isPrivate: false },
    { repoName: 'test-repo-3', isPrivate: true }
];

test.each(testData)('Create repository: $repoName', async ({ repoName, isPrivate }) => {
    // Test runs 3 times with different data
});
```

---

### 9. Configurations

#### Playwright Configuration
**File:** `playwright.config.js`

**Key Settings:**
```javascript
{
    testDir: './tests',                    // Test location
    fullyParallel: true,                   // Parallel execution
    forbidOnly: !!process.env.CI,          // CI restrictions
    retries: process.env.CI ? 2 : 0,       // Retry on CI
    workers: process.env.CI ? 1 : undefined,
    use: {
        trace: 'retain-on-failure',        // Keep traces on failure
        storageState: 'playwright/.auth/user.json'
    },
    projects: [
        { name: 'setup', testMatch: /auth\.setup\.js/ },
        { name: 'chromium', dependencies: ['setup'] }
    ]
}
```

#### Authentication Setup
**File:** `auth/auth.setup.js`
```javascript
// Runs before all tests
setup('authenticate with GitHub', async ({ page }) => {
    if (existsSync(authFile)) {
        logger.info(`Using existing storage state from ${authFile}`);
        return;
    }

    const loginPage = new LoginPage(page);
    await loginPage.navigate(githubUrl);
    await loginPage.login(username, password);
    await page.context().storageState({ path: authFile });
});
```

---

### 10. Commands & Advanced Features

#### NPM Scripts
**File:** `package.json`
```json
{
    "scripts": {
        "test": "playwright test",
        "test:headed": "playwright test --headed",
        "report": "playwright show-report",
        "allure": "allure serve allure-results"
    }
}
```

#### Test Execution Commands

**Run All Tests:**
```bash
npm test
```

**Run in Headed Mode (Browser Visible):**
```bash
npm run test:headed
# or
npx playwright test --headed
```

**Run Specific File:**
```bash
npx playwright test tests/GitHubUiTest2.spec.js
```

**Run with Debugging:**
```bash
npx playwright test --debug
```

**Run with UI Mode (Interactive):**
```bash
npx playwright test --ui
```

**Run with Tracing:**
```bash
npx playwright test --trace on
```

**View Trace:**
```bash
npx playwright show-trace trace.zip
```

---

### 11. Challenges & Solutions

#### Challenge 1: Persistent Authentication
**Problem:** Tests needed to remain logged in across multiple tests
**Solution:** 
- Implement `auth.setup.js` to store session state
- Use `storageState` in config
- Share context across tests in serial mode

#### Challenge 2: Dynamic Data Management
**Problem:** Tests were hardcoded with static repository names
**Solution:**
- Generate unique names using timestamps
- Use `testData.js` for dynamic data generation
- Externalize data to JSON files

#### Challenge 3: Flaky Tests
**Problem:** Tests failed due to element loading delays
**Solution:**
```javascript
await page.waitForLoadState('domcontentloaded');
await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
```

#### Challenge 4: Log Visibility in Reports
**Problem:** Console logs weren't captured in Allure reports
**Solution:**
- Implemented Winston logger
- Created `allureLogger.js` to capture and attach logs
- Logs now appear as attachments in Allure reports

#### Challenge 5: PowerShell Tag Syntax Error
**Problem:** `--grep @smoke` failed with PowerShell variable error
**Solution:**
```bash
# Use single quotes to escape special characters
npx playwright test --grep '@smoke'
```

---

### 12. Explore Additional Features & Highlight

#### Winston Logger
**File:** `utils/logger.js`
```javascript
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/execution.log' })
    ]
});
```

**Features:**
- Structured logging with timestamps
- Dual output (console + file)
- Log levels (info, debug, error, warn)
- Persistent log file at `logs/execution.log`

#### Allure Logger Integration
**File:** `utils/allureLogger.js`
```javascript
export function createAllureLogger() {
    testBase.afterEach(() => {
        const testInfo = testBase.info();
        if (testInfo && testLogs.length > 0) {
            testInfo.attach('Execution Logs', {
                body: logContent,
                contentType: 'text/plain'
            });
        }
    });
}
```

**Features:**
- Automatically captures logs during test execution
- Attaches logs to Allure report as file
- Per-test log isolation

#### API Request Interception
```javascript
const context = await request.newContext({
    baseURL: process.env.GITHUB_API_BASE_URL,
    extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
    }
});
```

---

### 13. Correlation

#### API ↔ UI Correlation
**Test:** `tests/GitHubAPIUI_e2e_Integration.spec.js`

**Flow:**
```
1. Create Repository (API)
   ↓
2. Retrieve Repository Details (API)
   ↓
3. Update Topics (API - PUT)
   ↓
4. Update Description (API - PATCH)
   ↓
5. Navigate to Repository (UI)
   ↓
6. Verify Repository (UI)
   ↓
7. Delete Repository (API)
   ↓
8. Verify Deletion (API)
```

**Benefits:**
- Tests end-to-end workflows
- Validates API-UI consistency
- Identifies integration issues

---

### 14. CI/CD Integration

#### GitHub Actions Ready
**Configuration:** `playwright.config.js`
```javascript
retries: process.env.CI ? 2 : 0,    // Retry on CI only
workers: process.env.CI ? 1 : undefined  // Single worker on CI
```

**CI Environment Variables:**
```bash
CI=true
GITHUB_USER=your_ci_user
GITHUB_TOKEN=your_ci_token
```

**CI Pipeline Steps:**
```bash
1. npm install
2. npx playwright install
3. npm test
4. npm run allure
```

---

### 15. Logging

#### Winston Logger Output
**Location:** `logs/execution.log`
```
2026-07-01T03:47:04.708Z [INFO]: Using existing storage state
2026-07-01T03:47:11.602Z [INFO]: URL after using stored session: https://github.com/
2026-07-01T03:47:13.522Z [INFO]: Dashboard clicked successfully
```

#### Log Levels
- **INFO**: General test information
- **DEBUG**: Detailed debugging information
- **ERROR**: Error messages
- **WARN**: Warning messages

#### Capturing Logs in Allure
Each test automatically captures and attaches logs:
```
Test Report
├── Execution Logs (Attachment)
│   ├── Step 1 log
│   ├── Step 2 log
│   └── Step 3 log
└── Screenshots
```

**Usage:**
```javascript
logger.info(`Repository created: ${repoName}`);
// Automatically captured and attached to Allure
```

---

### 16. Run Only Failed Tests

#### Rerun Failed Tests
```bash
# View failed tests in HTML report
npx playwright show-report

# Rerun last failed tests
npx playwright test --last-failed
```

#### Rerun Specific Tests
```bash
# Run specific test file
npx playwright test tests/GitHubUiTest2.spec.js

# Run specific test by name
npx playwright test -g "TC-01: Verify user can login"
```

---

### 17. Tags (Grouping Tests & Execute Specific)

#### Tag Implementation
**File:** `tests/GitHubUiTest2.spec.js`

**Test Tags:**
```javascript
test('TC-01: Verify user can login successfully @smoke @ui', async () => {...});
test('TC-02: Verify user can navigate to repositories page @smoke @ui', async () => {...});
test('TC-03: ... @smoke @ui', async () => {...});
test('TC-04: ... @smoke @ui', async () => {...});
test('TC-05: ... @ui', async () => {...});
```

**Tag Meanings:**
- `@smoke`: Quick sanity tests (TC-01 to TC-04)
- `@ui`: UI automation tests (All 5 tests)

#### Run Tests by Tags

**Run Only Smoke Tests:**
```bash
npx playwright test tests/GitHubUiTest2.spec.js --grep '@smoke'
```
**Result:** Runs TC-01, TC-02, TC-03, TC-04 only (4 tests)

**Run Only UI Tests:**
```bash
npx playwright test tests/GitHubUiTest2.spec.js --grep '@ui'
```
**Result:** Runs all 5 tests

**Run Tests with Both @smoke AND @ui:**
```bash
npx playwright test tests/GitHubUiTest2.spec.js --grep '@smoke.*@ui'
```
**Result:** Runs TC-01 to TC-04 (with both tags)

**Run Tests EXCEPT @smoke (Exclude):**
```bash
npx playwright test tests/GitHubUiTest2.spec.js --grep-invert '@smoke'
```
**Result:** Runs TC-05 only

**Run in Headed Mode with Tags:**
```bash
npx playwright test tests/GitHubUiTest2.spec.js --grep '@smoke' --headed
```

#### Use Cases for Tags

| Scenario | Command |
|----------|---------|
| Quick sanity check before deployment | `--grep '@smoke'` |
| Full UI regression | `--grep '@ui'` |
| Skip slow tests during CI | `--grep-invert '@slow'` |
| Run critical path tests only | `--grep '@critical'` |

#### PowerShell Syntax
**Important:** Always use single quotes in PowerShell:
```bash
✓ Correct
npx playwright test --grep '@smoke'
npx playwright test --grep '@ui'

✗ Incorrect (will fail)
npx playwright test --grep @smoke
```

---

## Running Tests

### Quick Start

```bash
# Install dependencies
npm install

# Configure .env file
# Add: GITHUB_USER, GITHUB_PASSWORD, GITHUB_TOKEN, etc.

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# View HTML report
npm run report

# View Allure report
npm run allure
```

### Test Execution Modes

```bash
# Standard headless mode
npx playwright test

# Headed mode (visible browser)
npx playwright test --headed

# Debug mode with Playwright Inspector
npx playwright test --debug

# UI mode (interactive test explorer)
npx playwright test --ui

# Run specific file
npx playwright test tests/GitHubUiTest2.spec.js

# Run specific test
npx playwright test -g "TC-01"

# Run with parallel execution
npx playwright test --workers=4

# Run serially (one at a time)
npx playwright test --workers=1

# With retries
npx playwright test --retries=2

# With tracing
npx playwright test --trace on
```

### Filtering Tests

```bash
# By tags
npx playwright test --grep '@smoke'
npx playwright test --grep '@ui'
npx playwright test --grep-invert '@slow'

# By test name
npx playwright test -g "login"
npx playwright test -g "repository"

# Last failed
npx playwright test --last-failed
```

---

## Reports & Logging

### Playwright HTML Report
```bash
# Auto-generated after test run
npx playwright show-report

# Features:
# - Test timeline
# - Screenshots on failure
# - Video recording
# - Trace files
# - Full test details
```

### Allure Report
```bash
# Generate and serve Allure report
npm run allure

# Or manually:
npx allure serve allure-results

# Serves on http://localhost:60203
```

### Log Files
```
logs/
└── execution.log  # All test execution logs with timestamps
```

**Access Logs:**
```bash
# View log file
cat logs/execution.log

# Or open in text editor
code logs/execution.log
```

### Log Attachments in Allure
Each test in Allure report includes:
- **Execution Logs** attachment with all captured logger.info() calls
- Automatically captured and attached per test
- No manual intervention needed

---

## Test Files Summary

### 1. GitHubUiTest2.spec.js (Primary)
**Tests:** 5 UI tests covering full GitHub workflow
- TC-01: Login verification
- TC-02: Dashboard & repositories navigation
- TC-03: My repositories navigation
- TC-04: Repository creation
- TC-05: File creation in repository
**Status:** ✅ Complete with tags (@smoke, @ui) and logging

### 2. GitHubUiTest1.spec.js
**Status:** Duplicate of GitHubUiTest2.spec.js (same tests)

### 3. GitHubAPIUI_e2e_Integration.spec.js
**Tests:** 1 end-to-end API + UI integration test
- Create repository via API
- Update repository via API (PUT, PATCH)
- Verify in UI
- Delete repository via API
**Status:** ✅ Complete with logging

### 4. GitHubAPIUI_e2e_Using_RepositoryServiceClass.spec.js
**Tests:** 1 end-to-end test using RepositoryService class
- Demonstrates service-oriented architecture
- Same workflow as integration test
- Uses class-based API client
**Status:** ✅ Complete with logging

### 5. githubUser.spec.js
**Tests:** 2 API authentication tests
- TC-01: Get user with valid token (positive)
- TC-02: Get user with invalid token (negative)
**Status:** ✅ Complete with logging and tag support

---

## Key Features Implemented

✅ **Page Object Model** - Organized, reusable UI interactions  
✅ **API Testing** - Complete REST API validation  
✅ **Authentication** - Persistent session management  
✅ **Logging** - Winston logger with structured logs  
✅ **Allure Reports** - Beautiful, detailed test reports  
✅ **Log Attachments** - Logs captured in Allure per test  
✅ **Tags** - Organize and run tests by category  
✅ **External Data** - JSON files, .env configuration  
✅ **CI Ready** - GitHub Actions compatible  
✅ **Error Handling** - Comprehensive validation and assertions  

---

## Troubleshooting

### Issue: Authentication token expired
**Solution:**
```bash
# Generate new token in GitHub Settings
# Update .env file with new token
# Delete playwright/.auth/user.json
# Run tests again
```

### Issue: Tests timeout
**Solution:**
```bash
# Increase timeout in playwright.config.js
use: {
    navigationTimeout: 30000,
    actionTimeout: 10000
}
```

### Issue: Allure report not generating
**Solution:**
```bash
# Clear existing results
rm -rf allure-results/

# Run tests again
npm test

# Generate report
npm run allure
```

### Issue: PowerShell tag command fails
**Solution:**
```bash
# Use single quotes for special characters
npx playwright test --grep '@smoke'  # ✓ Correct
npx playwright test --grep @smoke    # ✗ Fails
```

---

## Contributing

1. Follow Page Object Model pattern for UI pages
2. Keep API functions small and reusable
3. Use logger instead of console.log
4. Add tags to new tests
5. Update this README for new test files

---

## License

MIT

---

## Contact

For questions or issues, please refer to the project documentation or contact the development team.

---

**Last Updated:** July 1, 2026  
**Playwright Version:** 1.60.0  
**Node Version:** 18.x+  
**Status:** ✅ Production Ready
