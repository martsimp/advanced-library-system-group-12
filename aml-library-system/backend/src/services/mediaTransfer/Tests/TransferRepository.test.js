const { expect } = require('chai');
const sinon = require('sinon');
const repository = require('../TransferRepository');
const pool = require('../../../config/database');

describe('TransferRepository Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('updateBranchInventory should update inventory correctly', async () => {
    const mockClient = {
      query: sinon.stub().resolves({ rows: [{ available_copies: 15 }] }),
    };

    const result = await repository.updateBranchInventory(101, 1, 5, mockClient);

    expect(mockClient.query).to.have.been.calledWith(
      sinon.match.string,
      [101, 1, 5]
    );
    expect(result).to.deep.equal({ available_copies: 15 });
  });
});

describe('AddMedia Repository Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('updateMediaQuantity should update and return media', async () => {
    const mockUpdatedMedia = { id: 1, title: 'Media 1', total_copies: 15 };
    const mockClient = { query: sinon.stub().resolves({ rows: [mockUpdatedMedia] }) };

    const result = await repository.updateMediaQuantity(1, 5, mockClient);

    expect(mockClient.query).to.have.been.calledWith(sinon.match.string, [5, 1]);
    expect(result).to.deep.equal(mockUpdatedMedia);
  });

  it('updateBranchInventory should update and return inventory', async () => {
    const mockInventory = { available_copies: 10 };
    const mockClient = { query: sinon.stub().resolves({ rows: [mockInventory] }) };

    const result = await repository.updateBranchInventory(101, 1, 5, mockClient);

    expect(mockClient.query).to.have.been.calledWith(sinon.match.string, [101, 1, 5]);
    expect(result).to.deep.equal(mockInventory);
  });
});
