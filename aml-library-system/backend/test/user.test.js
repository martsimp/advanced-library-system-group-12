const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../src/services/user/userService');
const userRepository = require('../src/services/user/userRepository');

describe('User Registration Tests', () => {
    let createUserStub;

    beforeEach(() => {
        // Create stub for userRepository.createUser
        createUserStub = sinon.stub(userRepository, 'createUser');
    });

    afterEach(() => {
        // Restore all stubs
        sinon.restore();
    });

    it('TC001: Should successfully register a user with valid information', async () => {
        // Test data matching the test case
        const userData = {
            firebase_uid: 'test-firebase-uid',
            email: 'test.user@example.co.uk',
            name: 'John Smith',
            phone: '+44 7700 900123',
            street_address: '42 High Street',
            city: 'London',
            postal_code: 'SW1A 1AA',
            role: 'member',
            outstanding_fines: 0,
            has_seen_tutorial: false
        };

        // Mock the successful user creation
        const expectedUser = { ...userData, id: 1 };
        createUserStub.resolves(expectedUser);

        // Execute the test
        const result = await userService.createUser(userData);

        // Verify the results
        expect(createUserStub.calledOnce).to.be.true;
        expect(createUserStub.calledWith(userData)).to.be.true;
        expect(result).to.deep.equal(expectedUser);
        expect(result.role).to.equal('member');
        expect(result.outstanding_fines).to.equal(0);
        expect(result.has_seen_tutorial).to.be.false;
    });

    it('TC002: Should fail when registering with duplicate email', async () => {
        // Test data with duplicate email
        const userData = {
            firebase_uid: 'new-firebase-uid',
            email: 'JohnDoe12@gmail.com',
            name: 'Another User',
            phone: '+44 7700 900456',
            street_address: '15 Church Lane',
            city: 'Manchester',
            postal_code: 'M1 1AA',
            role: 'member',
            outstanding_fines: 0,
            has_seen_tutorial: false
        };

        // Mock the duplicate email error
        createUserStub.rejects(new Error('Email already exists'));

        // Execute the test and expect it to fail
        try {
            await userService.createUser(userData);
            expect.fail('Should have thrown an error for duplicate email');
        } catch (error) {
            expect(error.message).to.equal('Email already exists');
            expect(createUserStub.calledOnce).to.be.true;
            expect(createUserStub.calledWith(userData)).to.be.true;
        }
    });

    it('TC003: Should fail when registering with invalid email formats', async () => {
        const invalidEmails = [
            'invalid.email',
            'invalid@',
            '@invalid.co.uk',
            'invalid@invalid'
        ];

        const baseUserData = {
            firebase_uid: 'test-firebase-uid',
            name: 'Test User',
            phone: '+44 7700 900123',
            street_address: '42 High Street',
            city: 'London',
            postal_code: 'SW1A 1AA',
            role: 'member',
            outstanding_fines: 0,
            has_seen_tutorial: false
        };

        // Test each invalid email format
        for (const invalidEmail of invalidEmails) {
            const userData = { ...baseUserData, email: invalidEmail };
            
            // Mock the invalid email error
            createUserStub.rejects(new Error('Invalid email format'));

            try {
                await userService.createUser(userData);
                expect.fail(`Should have thrown an error for invalid email: ${invalidEmail}`);
            } catch (error) {
                expect(error.message).to.equal('Invalid email format');
                expect(createUserStub.calledWith(userData)).to.be.true;
            }
        }
    });

    it('Should fail when required fields are missing', async () => {
        const invalidUserData = {
            email: 'test.user@example.co.uk',
            // Missing other required fields
        };

        // Mock the failed user creation
        createUserStub.rejects(new Error('Missing required fields'));

        try {
            await userService.createUser(invalidUserData);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.equal('Missing required fields');
        }
    });
}); 