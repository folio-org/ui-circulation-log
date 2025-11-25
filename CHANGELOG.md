# Change history for ui-circulation-log

## [6.1.0] In progress

* Add translations for use-at-location actions. Refs UICIRCLOG-180.
* Add loan-action filter options In Use and Held. Refs UICIRCLOG-181.
* Migrate jest to use `@folio/jest-config-stripes`. Refs UICIRCLOG-182.

## 6.0.2 (https://github.com/folio-org/ui-circulation-log/tree/v6.0.2) (2025-11-04)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v6.0.1...v6.0.2)

* Make a separate call with a zero limit to get actual totalRecords. Reset recordsCount when `location.search` is empty in `useCirculationLog`. Include timezone in query of `useCirculationLogExport` Fixes UICIRCLOG-179.

## 6.0.1 (https://github.com/folio-org/ui-circulation-log/tree/v6.0.1) (2025-03-20)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v6.0.0...v6.0.1)

* Bump `@folio/stripes-acq-components` to 7.0.0. Refs UICIRCLOG-175.

## 6.0.0 (https://github.com/folio-org/ui-circulation-log/tree/v6.0.0) (2025-03-14)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v5.0.1...v6.0.0)

* [UICIRCLOG-155](https://folio-org.atlassian.net/browse/UICIRCLOG-155) React v19: refactor away from default props for functional components.
* [UICIRCLOG-170](https://folio-org.atlassian.net/browse/UICIRCLOG-170) *BREAKING* Migrate stripes dependencies to their Sunflower versions.
* [UICIRCLOG-171](https://folio-org.atlassian.net/browse/UICIRCLOG-171) *BREAKING* Migrate react-intl to v7.
* [UICIRCLOG-173](https://folio-org.atlassian.net/browse/UICIRCLOG-173)*BREAKING* Upgrade plugin-find-user to v8.

## 5.0.1 (https://github.com/folio-org/ui-circulation-log/tree/v5.0.1) (2024-12-03)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v5.0.0...v5.0.1)

* [UICIRCLOG-167](https://folio-org.atlassian.net/browse/UICIRCLOG-167) "Circulation log: All" permission to include sub permissions needed for patron look up.

## 5.0.0 (https://github.com/folio-org/ui-circulation-log/tree/v5.0.0) (2024-10-30)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v4.1.0...v5.0.0)

* [UICIRCLOG-159](https://folio-org.atlassian.net/browse/UICIRCLOG-159) Upgrade version for `actions/upload-artifact` to v4.
* [UICIRCLOG-165](https://folio-org.atlassian.net/browse/UICIRCLOG-165) *BREAKING* Bump "@folio/stripes-acq-components" version to v6.0.0.
* [UICIRCLOG-141](https://folio-org.atlassian.net/browse/UICIRCLOG-141) Fix lint config.

## [4.1.0](https://github.com/folio-org/ui-circulation-log/tree/v4.1.0) (2024-03-19)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v4.0.1...v4.1.0)

* [UICIRCLOG-140](https://issues.folio.org/browse/UICIRCLOG-140) Disable item barcode link for virtual items, in circulation log list.
* [UICIRCLOG-150](https://issues.folio.org/browse/UICIRCLOG-150) Define translation for ui-circulation-log permission "Circulation log: View".
* [UICIRCLOG-148](https://issues.folio.org/browse/UICIRCLOG-148) Update "Circulation Log: All" permission with permission to download the file.
* [UXPROD-3903](https://folio-org.atlassian.net/browse/UXPROD-3903) Support `data-export-spring` interface `2.0`

## [4.0.1](https://github.com/folio-org/ui-circulation-log/tree/v4.0.1) (2023-11-07)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v4.0.0...v4.0.1)

* [UICIRCLOG-125](https://issues.folio.org/browse/UICIRCLOG-125) Update date range query to include timezone and send as ISOString.


## [4.0.0](https://github.com/folio-org/ui-circulation-log/tree/v4.0.0) (2022-10-13)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v3.0.0...v4.0.0)

* [UICIRCLOG-115](https://issues.folio.org/browse/UICIRCLOG-115) Implement EXACT search for item barcode in circulation log
* [UICIRCLOG-122](https://issues.folio.org/browse/UICIRCLOG-122) Make patron and staff information visible and searchable in Circulation log
* [UICIRCLOG-123](https://issues.folio.org/browse/UICIRCLOG-123) Add loan patron and staff info filter to circulation log.
* [UICIRCLOG-128](https://issues.folio.org/browse/UICIRCLOG-128) Distinct between patron info and patron info (SUPERSEDED) in the Circ action column
* [UICIRCLOG-130](https://issues.folio.org/browse/UICIRCLOG-130) Adjust patron info (SUPERSEDED) items in the Circ action column
* [UICIRCLOG-131](https://issues.folio.org/browse/UICIRCLOG-131) Update Node.js to v18 in GitHub Actions
* [UICIRCLOG-129](https://issues.folio.org/browse/UICIRCLOG-129) *BREAKING* Upgrade React to v18.
* [UICIRCLOG-136](https://issues.folio.org/browse/UICIRCLOG-136) *BREAKING* bump `react-intl` to `v6.4.4`.

## [3.0.0](https://github.com/folio-org/ui-circulation-log/tree/v3.0.0) (2022-02-24)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.3.0...v3.0.0)

* [UICIRCLOG-109](https://issues.folio.org/browse/UICIRCLOG-109) Update circ log Actions ellipses UX
* [UICIRCLOG-111](https://issues.folio.org/browse/UICIRCLOG-111) bump stripes to 8.0.0 for Orchid/2023-R1
* [UIEXPMGR-65](https://issues.folio.org/browse/UIEXPMGR-65) Download refactoring to support /download endpoint (Circulation log)

## [2.3.0](https://github.com/folio-org/ui-circulation-log/tree/v2.3.0) (2022-10-26)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.2.1...v2.3.0)

* [UICIRCLOG-107](https://issues.folio.org/browse/UICIRCLOG-107) Add view permission to Circulation log


## [2.2.1](https://github.com/folio-org/ui-circulation-log/tree/v2.2.1) (2022-07-22)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.2.0...v2.2.1)

* [UICIRCLOG-96](https://issues.folio.org/browse/UICIRCLOG-96) Remove react-hot-loader from package.json
* [UICIRCLOG-98](https://issues.folio.org/browse/UICIRCLOG-98) Replace babel-eslint with @babel/eslint-parser
* [UICIRCLOG-104](https://issues.folio.org/browse/UICIRCLOG-104) Circ Log - Implement MCL Next/Previous pagination

## [2.2.0](https://github.com/folio-org/ui-circulation-log/tree/v2.2.0) (2022-07-08)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.1.1...v2.2.0)

* Translations update

## [2.1.1](https://github.com/folio-org/ui-circulation-log/tree/v2.1.1) (2022-04-04)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.1.0...v2.1.1)

* [UICIRCLOG-92](https://issues.folio.org/browse/UICIRCLOG-92) Circulation log showing UTC time instead of local time for loans/requests/fee-fines

## [2.1.0](https://github.com/folio-org/ui-circulation-log/tree/v2.1.0) (2022-03-03)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.0.1...v2.1.0)

* [UICIRCLOG-85](https://issues.folio.org/browse/UICIRCLOG-85) Change "Age" to lost to "Aged" to lost

## [2.0.1](https://github.com/folio-org/ui-circulation-log/tree/v2.0.0) (2021-11-03)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v2.0.0...v2.0.1)

* [UICIRCLOG-77](https://issues.folio.org/browse/UICIRCLOG-77) `plugin-find-user` is now compatible with `stripes` `v7`.
* [UICIRCLOG-76](https://issues.folio.org/browse/UICIRCLOG-76) Date range filters in Circulation log do not honor tenant locale.
* [UICIRCLOG-75](https://issues.folio.org/browse/UICIRCLOG-75) Fee/fine Details action menu has unfriendly errors for missing/undefined userId

## [2.0.0](https://github.com/folio-org/ui-circulation-log/tree/v2.0.0) (2021-10-06)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v1.2.0...v2.0.0)

* [UICIRCLOG-70](https://issues.folio.org/browse/UICIRCLOG-70) Add support for log records with new Circ action: "Send error".
* [UICIRCLOG-71](https://issues.folio.org/browse/UICIRCLOG-71) increment stripes to v7.
* [UICIRCLOG-54](https://issues.folio.org/browse/UICIRCLOG-54) Date range filter on Enter or clicking Apply moves focus to Results list pane (if there are results).
* [UICIRCLOG-73](https://issues.folio.org/browse/UICIRCLOG-73) DateRange filter focus blocks opening of Accordion components.
* [UICIRCLOG-72](https://issues.folio.org/browse/UICIRCLOG-72) Edit success toast language in Circulation log export

## [1.2.0](https://github.com/folio-org/ui-circulation-log/tree/v1.2.0) (2021-06-17)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v1.1.1...v1.2.0)

* [UICIRCLOG-39](https://issues.folio.org/browse/UICIRCLOG-39) Update anonymize filter in Circulation log.
* [UICIRCLOG-42](https://issues.folio.org/browse/UICIRCLOG-42) Add patron look-up in filters.
* [UICIRCLOG-64](https://issues.folio.org/browse/UICIRCLOG-64) Compile Translation Files into AST Format.
* [UICIRCLOG-65](https://issues.folio.org/browse/UICIRCLOG-65) Focus the "User barcode" field after "Patron lookup" is used.

## [1.1.1](https://github.com/folio-org/ui-circulation-log/tree/v1.1.1) (2021-04-20)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v1.1.0...v1.1.1)

* [UICIRCLOG-51](https://issues.folio.org/browse/UICIRCLOG-51) Add support for circ action "Created through override".
* [UICIRCLOG-57](https://issues.folio.org/browse/UICIRCLOG-57) Removing "loan details" option for log entries containing multiple barcodes.
* [UICIRCLOG-59](https://issues.folio.org/browse/UICIRCLOG-59) Not showing the links to Loan details if user ID is undefined.

## [1.1.0](https://github.com/folio-org/ui-circulation-log/tree/v1.1.0) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v1.0.1...v1.1.0)

* [UICIRCLOG-30](https://issues.folio.org/browse/UICIRCLOG-30) Add 'Checked in' loan filter.
* [UICIRCLOG-34](https://issues.folio.org/browse/UICIRCLOG-34) Make text filters submit on a button or Enter.
* [UICIRCLOG-28](https://issues.folio.org/browse/UICIRCLOG-28) Auto-focus first search field.
* [UICIRCLOG-35](https://issues.folio.org/browse/UICIRCLOG-35) Reformat dates to match date format across FOLIO.
* [UICIRCLOG-46](https://issues.folio.org/browse/UICIRCLOG-46) Update `@folio/stripes-cli` to `v2`.
* [UICIRCLOG-41](https://issues.folio.org/browse/UICIRCLOG-41) Update `@folio/stripes` to `v6.0.0`.
* [UICIRCLOG-36](https://issues.folio.org/browse/UICIRCLOG-36) Add personal data disclosure form.
* [UICIRCLOG-22](https://issues.folio.org/browse/UICIRCLOG-22) Circulation log Action dropdown - Exporting Data.
* [UICIRCLOG-29](https://issues.folio.org/browse/UICIRCLOG-29) Entering values in Search fields OR Clicking Apply moves focus to Results list pane.

## [1.0.1](https://github.com/folio-org/ui-circulation-log/tree/v1.0.1) (2020-10-30)
[Full Changelog](https://github.com/folio-org/ui-circulation-log/compare/v1.0.0...v1.0.1)

* [UICIRCLOG-24](https://issues.folio.org/browse/UICIRCLOG-24) Fix non-sorting by date by default

## [1.0.0](https://github.com/folio-org/ui-circulation-log/tree/v1.0.0) (2020-10-16)

### Stories
* [UICIRCLOG-11](https://issues.folio.org/browse/UICIRCLOG-11) Project Setup: ui-circulation-log
* [UICIRCLOG-3](https://issues.folio.org/browse/UICIRCLOG-3) View circulation log table
* [UICIRCLOG-13](https://issues.folio.org/browse/UICIRCLOG-13) Circulation log permissions
* [UICIRCLOG-4](https://issues.folio.org/browse/UICIRCLOG-4) Filtering & Searching the circulation logs
* [UICIRCLOG-12](https://issues.folio.org/browse/UICIRCLOG-12) Circulation log ellipses pop up box
* [UICIRCLOG-16](https://issues.folio.org/browse/UICIRCLOG-16) Ellipses pop up for Manual Blocks
* [UICIRCLOG-17](https://issues.folio.org/browse/UICIRCLOG-17) Cover ui-circulation-log by unit test with Jest
* [UICIRCLOG-18](https://issues.folio.org/browse/UICIRCLOG-18) Ellipses menu option permissions
* [UICIRCLOG-19](https://issues.folio.org/browse/UICIRCLOG-19) Update circulation log table headings
* [UICIRCLOG-20](https://issues.folio.org/browse/UICIRCLOG-20) Switch service point filter from checkboxes to multi-select picker
* [UICIRCLOG-21](https://issues.folio.org/browse/UICIRCLOG-21) Show items for multiple-item notice in circulation log
