import '@folio/stripes-acq-components/test/jest/__mock__';
import { registerMostRecentPatronNotes, markOldPatronInfoAsSuperseded } from './markOldPatronInfoAsSuperseded';
import { LOAN_ACTIONS } from './constants';

const data = [
  { id: 1, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 2, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 3, items: [{ itemBarcode: 234 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 4, items: [{ itemBarcode: 123 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 5, items: [{ itemBarcode: 234 }], action: LOAN_ACTIONS.PATRON_INFO },
  { id: 6, items: [{ itemBarcode: 345 }], action: 'Whatever' },
];

describe('markOldPatronInfoAsSuperseded', () => {
  it('creates the mostRecentPatronNotes register', () => {
    const register = registerMostRecentPatronNotes(data);
    expect(Object.keys(register).length).toBe(2);
    expect(register[123]).toBe(1);
    expect(register[234]).toBe(3);
    expect(register[345]).toBe(undefined);
  });

  it('calculates modified data', () => {
    const newData = markOldPatronInfoAsSuperseded(data);
    expect(newData.length).toBe(data.length);
    [0, 2].forEach(i => {
      expect(newData[i].action).toBe(LOAN_ACTIONS.PATRON_INFO);
    });
    [1, 3, 4].forEach(i => {
      expect(newData[i].action).toBe('Patron info superseded');
    });
  });
});
