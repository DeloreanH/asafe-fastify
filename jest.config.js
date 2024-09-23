module.exports = {
    preset: 'ts-jest', 
    testEnvironment: 'node', 
    moduleFileExtensions: ['ts', 'js'],
    testMatch: [
        '**/modules/**/*(*.spec|*.test).[jt]s?(x)',
        '**/hooks/**/*(*.spec|*.test).[jt]s?(x)',                 // Match only test files (ending in .spec or .test)
    ],
    testPathIgnorePatterns: [
        '<rootDir>/src/server/',                               // Ignore all files in the server directory
        '<rootDir>/src/shared/',                               // Ignore all files in the shared directory
        '<rootDir>/src/config/',                               // Ignore all files in the config directory
        '<rootDir>/src/server/plugins/',                       // Ignore all plugins in the server
        '<rootDir>/src/shared/exceptions/',                    // Ignore shared exceptions
        '<rootDir>/src/modules/core.ts',                       // Ignore core.ts    
    ],
    coverageDirectory: 'coverage', 
    collectCoverage: true, 
    collectCoverageFrom: ['**/*.ts', '!**/node_modules/**'],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/server/',                               // Exclude server from coverage
        '<rootDir>/src/shared/',                               // Exclude shared from coverage
        '<rootDir>/src/config/',                               // Exclude config from coverage
        '<rootDir>/src/modules/core.ts',                       // Exclude core.ts from coverage
        '.*\\.module\\.ts$',                                   // Exclude any files ending with .module.ts
        '<rootDir>/src/app.ts',                                // Exclude app.ts
        '<rootDir>/src/declarations.d.ts',                     // Exclude declarations.d.ts
        '.*\\.routes\\.ts$',                                   // Exclude any files ending with .routes.ts
        '.*\\.schema\\.ts$',                                   // Exclude any files ending with .schema.ts
        '.*\\.repository\\.ts$',                               // Exclude any files ending with .schema.ts
    ],
};