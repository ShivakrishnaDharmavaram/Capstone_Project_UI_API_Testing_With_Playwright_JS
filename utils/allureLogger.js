import { test as testBase } from '@playwright/test';
import logger from './logger.js';

let testLogs = []; // created an empty array to store logs for each test

// Intercept logger.info to capture logs for Allure
const originalInfo = logger.info.bind(logger);

logger.info = function(message) {
    originalInfo(message);
    testLogs.push(message);
};

export function createAllureLogger() {
    // Extend test to add afterEach hook that attaches logs
    testBase.afterEach(() => {
        // Access testInfo using test.info()
        const testInfo = testBase.info();
        
        if (testInfo && testLogs.length > 0) {
            const logContent = testLogs.join('\n');
            
            // Attach logs as a file to Allure report
            testInfo.attach('Execution Logs', {
                body: logContent,
                contentType: 'text/plain'
            });
            
            // Reset logs for next test
            testLogs = [];
        }
    });
}

export { logger };





