/**
 * Simple logger utility
 */

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

const log = {
    info: (message) => {
        console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
    },

    success: (message) => {
        console.log(`${colors.green}✓ ${message}${colors.reset}`);
    },

    warning: (message) => {
        console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
    },

    error: (message) => {
        console.log(`${colors.red}✗ ${message}${colors.reset}`);
    },

    divider: () => {
        console.log('\n' + '='.repeat(60) + '\n');
    }
};

module.exports = log;
