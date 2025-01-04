const { expect } = require('chai');
const sinon = require('sinon');
const controller = require('../TransferController');
const service = require('../TransferService');

describe('TransferController Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('transferMedia should call service and return 200', async () => {
    const mockResult = { message: 'Transfer successful' };
    sandbox.stub(service, 'transferMedia').resolves(mockResult);

    const req = { body: { mediaId: 1, fromBranchId: 101, toBranchId: 102, quantity: 5 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await controller.transferMedia(req, res);

    expect(service.transferMedia).to.have.been.calledWith(1, 101, 102, 5);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({
      message: 'Transfer successful',
      result: mockResult
    });
  });
});

describe('AddMedia Controller Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('addMediaToBranch should call service and return 200 on success', async () => {
    const mockResult = { 
      branchName: 'Branch A',
      updatedCopies: 10
    };
    sandbox.stub(service, 'addMediaToBranch').resolves(mockResult);

    const req = { body: { mediaName: 'Media 1', quantity: 5, branchName: 'Branch A' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await controller.addMediaToBranch(req, res);

    expect(service.addMediaToBranch).to.have.been.calledWith('Media 1', 5, 'Branch A');
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({
      message: 'Media successfully added to branch',
      result: mockResult
    });
  });
});
