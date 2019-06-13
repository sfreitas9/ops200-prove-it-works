const express = require('express');
const expect = require('chai').expect;
const path = require('path');
const Nightmare = require('nightmare');
const axios = require('axios');


const app = express();

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../dist')));

const url = 'http://localhost:8888';

const nightmare = new Nightmare();

describe('End to End Tests', () => {
  let httpServer = null;
  let pageObject = null;

  before((done) => {
    httpServer = app.listen(8888);
    done();
  });

  beforeEach(() => {
    pageObject = nightmare.goto(url);
  });

  after((done) => {
    httpServer.close();
    done();
  });

  // This is where your code is going to go
  it('should load successfully', () => axios.get(url).then(r => expect(r.status === 200)));

  it('should contain a <h1> element for the page title', () => { 
    return pageObject
      .evaluate(() => document.querySelector('h1').innerText)
      .then(headerText => {
        expect(headerText).to.not.be.null;
        expect(headerText).to.equal('Mortgage Calculator');
      });
  });

  it('should contain a #output element for result', () => { 
    return pageObject
      .evaluate(() => document.querySelector('#output'))
      .then(output => {
        expect(output).to.exist;
        expect(output).to.not.be.null;
        expect(typeof output).to.equal('object');
         });
  });

  it('should correctly calculate mortgage', () =>
    pageObject
      .wait()
      .type('input[name=principal]', 300000)
      .type('input[name=interestRate]', 3.75)
      .type('input[name=loanTerm]', 30)
      .select('select[name=period]', 12)
      .click('button#calculate')
      .wait('#output')
      .evaluate(() => document.querySelector('#output').innerText)
      .then((outputText) => {
        expect(outputText).to.equal('$1389.35');
      })
  ).timeout(6500);

  it('should correctly calculate mortgage with quarterly payments', () =>
    pageObject
      .wait()
      .type('input[name=principal]', 300000)
      .type('input[name=interestRate]', 3.75)
      .type('input[name=loanTerm]', 30)
      .select('select[name=period]', 4)
      .click('button#calculate')
      .wait('#output')
      .evaluate(() => document.querySelector('#output').innerText)
      .then((outputText) => {
        expect(outputText).to.equal('$4175.07');
      })
  ).timeout(6500);

  it('should return $0 if prinicpal is missing', () =>
    pageObject
      .wait()
      .type('input[name=interestRate]', 3.75)
      .type('input[name=loanTerm]', 30)
      .select('select[name=period]', 4)
      .click('button#calculate')
      .wait('#output')
      .evaluate(() => document.querySelector('#output').innerText)
      .then((outputText) => {
        expect(outputText).to.equal('$0.00');
      })
  ).timeout(6500);

  it('should return $NaN if interest rate is missing', () =>
    pageObject
      .wait()
      .type('input[name=principal]', 300000)
      .type('input[name=loanTerm]', 30)
      .select('select[name=period]', 4)
      .click('button#calculate')
      .wait('#output')
      .evaluate(() => document.querySelector('#output').innerText)
      .then((outputText) => {
        expect(outputText).to.equal('$NaN');
      })
  ).timeout(6500);

  it('should return $0.00 if term is missing', () =>
  pageObject
    .wait()
    .type('input[name=principal]', 300000)
    .type('input[name=interestRate]', 3.75)
    .select('select[name=period]', 4)
    .click('button#calculate')
    .wait('#output')
    .evaluate(() => document.querySelector('#output').innerText)
    .then((outputText) => {
      expect(outputText).to.equal('$Infinity');
    })
).timeout(6500);



})