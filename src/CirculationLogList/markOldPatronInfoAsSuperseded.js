/*
   In the markOldPatronInfoAsSuperseded function, we want to mark
   superseded patron-info events (i.e. all such events but the last
   for each item).

   We effect this change visually by changing the their `action` field
   from "Patron info added" to "Patron info superseded".
*/

import { LOAN_ACTIONS } from './constants';

function markOldPatronInfoAsSuperseded(list, logsByIdMap) {
  return list.map(rec => {
    const newRec = { ...rec };

    if (rec.action === LOAN_ACTIONS.PATRON_INFO && !logsByIdMap.has(rec.id)) {
      newRec.action = 'Patron info superseded';
    }

    return newRec;
  });
}

export { markOldPatronInfoAsSuperseded };
