import { formatCurrency } from '../../scripts/utils/money.js';

function doTest(condition, testDescription) {
  console.log(testDescription);

  if (condition) {
    console.log('passed');
  } else {
    console.log('failed');
  }
}

console.log('test suite: formatCurrency');

doTest(formatCurrency(2095) === '20.95', 'converts cents into dollars');

doTest(formatCurrency(0) === '0.00', 'works with 0')

doTest(formatCurrency(2000.5) === '20.01', 'rounds up to the nearest cent')

doTest(formatCurrency(2000.4) === '20.00', 'rounds down to the nearest cent')
