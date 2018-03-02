# PM-POS 3.0

PM-POS is an experimental POS application that aims to solve operational problems on retail, restaurant or similar environments. I released this project to discuss how to use latest software tech for the benefit of SambaPOS community. Everything released under this project is PoC grade for now.

Note: _Unlike previous PM-POS projects this project is a standalone POS appliation and will not need SambaPOS to operate._

## Things we want to do

1. Creating a simplified data structure to record all financial and inventory transactions.
2. Creating P2P networks for local terminals to generate centeralized local ledgers to allow terminals to operate without need for connecting to a server.
3. Create a decenteralized public ledger network to integrate local ledgers.
4. Create a cyrptocurrency that will be used to operate public ledgers. That currency can also be useful to create loyalty and payment solutions.

## Related projects

y-js, react, redux, redux-observable, nools-ts, material-ui, typescript

## Cards & Tags

To record operational data we're using two simple data types called Cards and Tags. We'll create a Card to create a record and use Tags to set properties of that record. Cards can be created in a tree structure.