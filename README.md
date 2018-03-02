# PM-POS 3.0

PM-POS is an experimental POS application that aims to solve operational problems on retail, restaurant or similar environments. I released this project to discuss how to use latest software tech for the benefit of SambaPOS community. Everything released under this project is PoC grade for now.

Note: _Unlike previous PM-POS projects this project is a standalone POS application and will not need SambaPOS to operate._

https://emreeren.github.io/pmpos

## Primary Objectives

* PM-POS should be able to work offline under poor local networking conditions.
* We should be able to integrate PM-POS to other PM-POS networks, consumer apps or supplier apps.
* Local restaurants sould be able to allow data access for remote locations.
* Multiple venue data should be able to consolidated to a centeral database for reporting, analytics and AI.
* PM-POS should have multiple operational configurations that can be switched instantly under certain conditions.

## Things we want to do

* Create a simplified data structure to record all financial and inventory transactions.
* Create P2P networks for local terminals to generate centeralized local ledgers to allow terminals to operate without need for connecting to a server.
* Create a decenteralized public ledger network to integrate local ledgers.
* Create a cyrptocurrency that will be used to operate public ledgers. That currency can also be useful to create loyalty and payment solutions.

## Related projects

y-js, react, redux, redux-observable, nools-ts, material-ui, typescript

## Cards & Tags

To record operational data we're using two simple data types called Cards and Tags. We'll create a Card to create a record and use Tags to set properties of that record. Cards can be created in a tree structure to create transaction documents like tickets or invoices. So a card can be used like a transaction document, a transaction, an entity or an asset. By tagging cards we can set data values for a card. A tag can also be used to assign card a quantity or a financial value to track asset transactions or liabilities. We'll use Card Types to set default properties of cards.

## Commits

PM-POS stores all card creation and tagging operations as actions and groups them as a commit. Commits are shared between terminals through P2P network. All commits are related with a single root card. When a terminal receives a commit it replays all commits for related root card and rebuilds related records.

## Rules

All card creation and tagging actions may trigger custom rules to customize operational flow.
