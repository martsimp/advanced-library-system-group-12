const { expect } = require('chai');
const sinon = require('sinon');
const service = require('../TransferService');
const repository = require('../TransferRepository');
const pool = require('../../../config/database');

describe('TransferService Tests', () => {
  let sandbox;
  let mockClient;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockClient = {
      query: sinon.stub(),
      release: sinon.stub(),
    };
    sandbox.stub(pool, 'connect').resolves(mockClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('transferMedia should call repository methods and succeed', async () => {
    sandbox.stub(repository, 'getAvailableCopies').resolves(10);
    sandbox.stub(repository, 'updateBranchInventory').resolves(true);

    const result = await service.transferMedia(1, 101, 102, 5);

    expect(repository.getAvailableCopies).to.have.been.calledWith(101, 1, sinon.match.any);
    expect(repository.updateBranchInventory).to.have.been.calledTwice;
    expect(result.message).to.equal('Transfer successful');
    expect(mockClient.release).to.have.been.called;
  });
});

describe('AddMedia Service Tests', () => {
  let sandbox;
  let mockClient;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockClient = {
      query: sinon.stub(),
      release: sinon.stub(),
    };
    sandbox.stub(pool, 'connect').resolves(mockClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('addMediaToBranch should add media successfully', async () => {
    const mockMedia = { id: 1, title: 'Media 1', total_copies: 10 };
    const mockBranch = { id: 101, name: 'Branch A' };
    const mockInventoryUpdate = { available_copies: 5 };

    sandbox.stub(repository, 'getMediaByName').resolves(mockMedia);
    sandbox.stub(repository, 'getBranchByName').resolves(mockBranch);
    sandbox.stub(repository, 'updateMediaQuantity').resolves({ ...mockMedia, total_copies: 5 });
    sandbox.stub(repository, 'updateBranchInventory').resolves(mockInventoryUpdate);

    const result = await service.addMediaToBranch('Media 1', 5, 'Branch A');

    expect(repository.getMediaByName).to.have.been.calledWith('Media 1');
    expect(repository.getBranchByName).to.have.been.calledWith('Branch A');
    expect(repository.updateMediaQuantity).to.have.been.calledWith(1, -5, sinon.match.any);
    expect(repository.updateBranchInventory).to.have.been.calledWith(101, 1, 5, sinon.match.any);
    expect(result).to.deep.equal({
      message: 'Media added successfully',
      mediaName: 'Media 1',
      branchName: 'Branch A',
      updatedCopies: 5,
    });
    expect(mockClient.query).to.have.been.calledWith('BEGIN');
    expect(mockClient.query).to.have.been.calledWith('COMMIT');
    expect(mockClient.release).to.have.been.called;
  });
});
