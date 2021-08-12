import { buildDateRangeQuery, DESC_DIRECTION } from '@folio/stripes-acq-components';

export const DATE_DEFAULT_SORTING_DIRECTION = DESC_DIRECTION;

export const CUSTOM_FILTERS = {
  userBarcode: (value) => `userBarcode=="*${value}*"`,
  itemBarcode: (value) => `items=="*${value}*"`,
  description: (value) => `description=="*${value}*"`,
  date: buildDateRangeQuery.bind(null, ['date']),
};

export const LOG_EVENT_OBJECTS = {
  FEE: 'Fee/Fine',
  ITEM_BLOCK: 'Item Block',
  LOAN: 'Loan',
  MANUAL_BLOCK: 'Manual Block',
  NOTICE: 'Notice',
  PATRON_BLOCK: 'Patron Block',
  REQUEST: 'Request',
  NA: 'N/A',
};

export const LOAN_ACTIONS = {
  CHANGED_DUE_DATE: 'Changed due date',
  CHECKED_OUT: 'Checked out',
  CHECKED_OUT_OVERRIDE: 'Checked out through override',
  CHECKED_IN: 'Checked in',
  ANONYMIZE: 'Anonymize',
  CLAIMED_RETURNED: 'Claimed returned',
  CLOSED_LOAN: 'Closed loan',
  DECLARED_LOAST: 'Declared lost',
  MISSED: 'Marked as missing',
  RECALL_REQUEST: 'Recall requested',
  RENEWED: 'Renewed',
  RENEW_OVERRIDE: 'Renewed through override',
  AGE_OF_LOST: 'Age to lost',
};

export const NOTICE_ACTIONS = {
  SEND: 'Send',
  SEND_ERROR: 'Send error',
};

export const FEE_ACTIONS = {
  BILLED: 'Billed',
  CREDITED_FULLY: 'Credited fully',
  PAID_FULLY: 'Paid fully',
  PAID_PARTIALLY: 'Paid partially',
  REFUNDED_FULLY: 'Refunded fully',
  REFUNDED_PARTIALLY: 'Refunded partially',
  STAFF_INFO_ADDED: 'Staff information only added',
  TRANSFERED_ONLY: 'Transferred fully',
  TRANSFERED_PARTIALLY: 'Transferred partially',
  WAIVED_FULLY: 'Waived fully',
  WAIVED_PARTIALLY: 'Waived partially',
  CANCELLED_AS_ERROR: 'Cancelled as error',
};

export const REQUEST_ACTIONS = {
  CANCELLED: 'Cancelled',
  CREATED: 'Created',
  PICKUP_EXPIRED: 'Pickup expired',
  EXPIRED: 'Expired',
  MOVED: 'Moved',
  QUEUE_POSIION_REORDERED: 'Queue position reordered',
};
