import { markOldPatronInfoAsSuperseded } from './markOldPatronInfoAsSuperseded';
import { LOAN_ACTIONS } from './constants';

const data = [
  { id: 1, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 2, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 3, items: [{ itemBarcode: 234 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 4, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 5, items: [{ itemBarcode: 234 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 6, items: [{ itemBarcode: 345 }], action: 'Whatever' },
];

const logsByIdsMap = new Map([
  [1, data[0]],
  [3, data[2]],
]);

describe('markOldPatronInfoAsSuperseded', () => {
  it('calculates modified data', () => {
    const newData = markOldPatronInfoAsSuperseded(data, logsByIdsMap);
    expect(newData.length).toBe(data.length);
    [0, 2].forEach(i => {
      expect(newData[i].action).toBe(LOAN_ACTIONS.PATRON_INFO);
    });
    [1, 3, 4].forEach(i => {
      expect(newData[i].action).toBe('Patron info superseded');
    });
  });
});
