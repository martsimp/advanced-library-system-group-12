const { expect } = require('chai');
const sinon = require('sinon');
const transactionsService = require('../src/services/transactions/transactionsService');
const transactionsRepository = require('../src/services/transactions/transactionsRepository');

describe('Media Borrowing Tests', () => {
    let borrowMediaStub;

    beforeEach(() => {
        borrowMediaStub = sinon.stub(transactionsRepository, 'borrowMedia');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('TC004: Should successfully borrow available media', async () => {
        const borrowData = {
            userId: 1,
            mediaId: 'media_001',
            branchId: 1
        };

        const currentTimestamp = new Date();
        const dueDate = new Date(currentTimestamp);
        dueDate.setDate(dueDate.getDate() + 14);

        const expectedTransaction = {
            id: 1,
            user_id: borrowData.userId,
            media_id: borrowData.mediaId,
            branch_id: borrowData.branchId,
            borrow_date: currentTimestamp,
            due_date: dueDate,
            status: 'borrowed',
            return_date: null
        };

        borrowMediaStub.resolves(expectedTransaction);

        const result = await transactionsService.borrowMedia(
            borrowData.userId,
            borrowData.mediaId,
            borrowData.branchId
        );

        expect(borrowMediaStub.calledOnce).to.be.true;
        expect(borrowMediaStub.calledWith(
            borrowData.userId,
            borrowData.mediaId,
            borrowData.branchId
        )).to.be.true;
        
        expect(result.user_id).to.equal(borrowData.userId);
        expect(result.media_id).to.equal(borrowData.mediaId);
        expect(result.branch_id).to.equal(borrowData.branchId);
        expect(result.status).to.equal('borrowed');
        expect(result.return_date).to.be.null;
        
        const borrowDate = new Date(result.borrow_date);
        const resultDueDate = new Date(result.due_date);
        const daysDifference = Math.ceil((resultDueDate - borrowDate) / (1000 * 60 * 60 * 24));
        expect(daysDifference).to.equal(14);
    });

    it('TC005: Should fail when borrowing unavailable media', async () => {
        const borrowData = {
            userId: 1,
            mediaId: 'media_002',
            branchId: 1
        };

        borrowMediaStub.rejects(new Error('Media not available at this branch'));

        try {
            await transactionsService.borrowMedia(
                borrowData.userId,
                borrowData.mediaId,
                borrowData.branchId
            );
            expect.fail('Should have thrown an error for unavailable media');
        } catch (error) {
            expect(error.message).to.equal('Media not available at this branch');
            expect(borrowMediaStub.calledOnce).to.be.true;
            expect(borrowMediaStub.calledWith(
                borrowData.userId,
                borrowData.mediaId,
                borrowData.branchId
            )).to.be.true;
        }
    });

    it('TC006: Should fail when borrowing with non-existent user ID', async () => {
        const borrowData = {
            userId: 'non_existent_user_123',
            mediaId: 'media_001',
            branchId: 'branch_001'
        };

        const error = new Error('User not found');
        error.status = 404;
        borrowMediaStub.rejects(error);

        try {
            await transactionsService.borrowMedia(
                borrowData.userId,
                borrowData.mediaId,
                borrowData.branchId
            );
            expect.fail('Should have thrown an error for non-existent user');
        } catch (error) {
            expect(error.message).to.equal('User not found');
            expect(error.status).to.equal(404);
            expect(borrowMediaStub.calledOnce).to.be.true;
            expect(borrowMediaStub.calledWith(
                borrowData.userId,
                borrowData.mediaId,
                borrowData.branchId
            )).to.be.true;
        }
    });
}); 