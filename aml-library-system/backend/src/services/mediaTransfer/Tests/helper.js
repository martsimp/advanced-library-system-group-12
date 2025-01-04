const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

before(() => {
  console.log('Global setup before all tests');
});

after(() => {
  console.log('Global teardown after all tests');
});