/*
   In the markOldPatronInfoAsSuperseded function, we want to mark
   superseded patron-info events (i.e. all such events but the last
   for each item).

   We effect this change visually by changing the their `action` field
   from "Patron info added" to "Patron info superseded".

   Identifying the relevant records is tricky in the general case,
   though, as the list may not be sorted chronologically. (It starts
   out that way, but the user can re-sort the list by clicking on a
   column header). So we have to go the long way around, generating
   chronologically sorted list, using this to generate a register of
   entries that need changing, then running through the original list
   and changing the relevant entries.
*/

import { LOAN_ACTIONS } from './constants';

// For given log records fetch log records by item barcode
// and return a map of most recent PATRON_INFO logs
async function captureMostRecentPatronInfoLogs(mutator, logRecords) {
  const barcodeSet = new Set();
  const logsByIdMap = new Map();

  logRecords.forEach(log => {
    if (log.action === LOAN_ACTIONS.PATRON_INFO && log?.items?.[0]?.itemBarcode) {
      barcodeSet.add(`items=${log?.items?.[0]?.itemBarcode}`);
    }
  });

  const query = Array.from(barcodeSet).join(' or ');

  if (!query) {
    return logsByIdMap;
  }

  mutator.logEventsListEventsByBarcode.reset();
  const results = await mutator.logEventsListEventsByBarcode.GET({
    params: {
      query: `(${query}) and action=="${LOAN_ACTIONS.PATRON_INFO}" sortby date/sort.descending`,
      limit: 1000,
    },
  });

  if (results?.logRecords) {
    const { logRecords: logs } = results;
    // key represents item barcode, value represents log id
    const itemBarcodeMap = new Map();

    // capture the most recent log based on given item barcode
    logs.forEach(log => {
      const itemBarcode = log?.items?.[0]?.itemBarcode;

      if (!itemBarcodeMap.has(itemBarcode)) {
        itemBarcodeMap.set(itemBarcode, log.id);
        logsByIdMap.set(log.id, log);
      }
    });
  }

  return logsByIdMap;
}

function markOldPatronInfoAsSuperseded(list, logsByIdMap) {
  return list.map(rec => {
    const newRec = { ...rec };

    if (rec.action === LOAN_ACTIONS.PATRON_INFO && !logsByIdMap.has(rec.id)) {
      newRec.action = 'Patron info superseded';
    }

    return newRec;
  });
}

export { markOldPatronInfoAsSuperseded, captureMostRecentPatronInfoLogs };
