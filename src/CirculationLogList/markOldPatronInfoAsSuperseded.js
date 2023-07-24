// This looks like human-readable text, but is really an opaque ID
// XXX can it be included from elsewhere in the source?
const PATRON_INFO_ADDED = 'Patron info added';

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

// PRIVATE
function record2itemId(rec) {
  // Not every record has an item; potentially some have more than one
  return rec.items?.[0]?.itemBarcode;
}


// PRIVATE
function registerMostRecentPatronNotes(list) {
  const itemBarcode2mostRecentPatronNote = {};

  list.forEach(rec => {
    if (rec.action === PATRON_INFO_ADDED) {
      const itemId = record2itemId(rec);

      if (!itemId) {
        // console.log('no itemId in', rec);
      } else if (!itemBarcode2mostRecentPatronNote[itemId]) {
        // console.log('first patron-info for item', itemId, 'is', rec.id);
        itemBarcode2mostRecentPatronNote[itemId] = rec.id;
      } else {
        // console.log(' ignoring spare patron-info for item', itemId, '-', rec.id);
      }
    }
  });

  return itemBarcode2mostRecentPatronNote;
}


function markOldPatronInfoAsSuperseded(list) {
  // console.log(list);

  const chronologicalList = [...list];
  chronologicalList.sort((a, b) => (
    a.date < b.date ? 1 :
      a.date > b.date ? -1 :
        0
  ));

  const itemBarcode2mostRecentPatronNote = registerMostRecentPatronNotes(chronologicalList);

  // console.log(itemBarcode2mostRecentPatronNote);

  return list.map(rec => {
    const itemId = record2itemId(rec);
    const newRec = { ...rec };

    if (rec.action === PATRON_INFO_ADDED && itemBarcode2mostRecentPatronNote[itemId] !== rec.id) {
      newRec.action = 'Patron info superseded';
    }

    return newRec;
  });
}

export { markOldPatronInfoAsSuperseded };
