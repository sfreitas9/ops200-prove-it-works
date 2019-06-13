const expect = require('chai').expect;
const Mortgage = require('../../src/js/lib/Mortgage');

describe('Mortgage Calculator', () => {
  let mortgage = null;

  beforeEach(() => {
    mortgage = new Mortgage(100000,3.92,30,12);
  });

  it('should have a monthlyPayment function', () => {
    expect(mortgage.monthlyPayment).to.exist;
  });
    
  it('should calculate monthly payment correctly', () => {
    expect(mortgage.monthlyPayment().toFixed(0)).to.equal('473');
  });

  before(() => {
    mortgage1 = new Mortgage(1);
  });

  it('should give NaN if parameters are missing', () => {
    expect(mortgage1.monthlyPayment().toFixed(0)).to.equal('NaN');
  });

  before(() => {
    mortgage3 = new Mortgage(10,100,10,12);
  });

  it('should calculate monthly payment correctly with low mortgage amount', () => {
    expect(mortgage3.monthlyPayment().toFixed(0)).to.equal('1');
  });

});
