const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Setup MongoDB Memory Server before all tests
beforeAll(async () => {
    console.log('🚀 Setting up MongoDB Memory Server for testing...');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Memory Server connected for testing');
});

// Clean up database between tests
beforeEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

// Clean up after all tests
afterAll(async () => {
    console.log('🧹 Cleaning up test environment...');
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    console.log('✅ Test environment cleaned up');
});

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
}); 