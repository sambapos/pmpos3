# PM-POS 3.0

PM-POS is an experimental POS application that aims to solve operational problems on retail, restaurant or similar environments. I released this project to discuss how to use latest software tech for the benefit of SambaPOS community. Everything released under this project is PoC grade for now.

Note: _Unlike previous PM-POS projects this project is a standalone POS application and will not need SambaPOS to operate._

- More Info: https://github.com/emreeren/pmpos3/wiki
- Demo: https://emreeren.github.io/pmpos3
- Demo Documentation: https://github.com/emreeren/pmpos3/wiki/1.-Creating-First-Ticket

## Primary Objectives

* PM-POS should be able to work offline under poor local networking conditions.
* We should be able to integrate PM-POS to other PM-POS networks, consumer apps or supplier apps.
* Local restaurants sould be able to allow data access for remote locations.
* Multiple location data should be able to consolidated to a centeral database for reporting, analytics and AI.
* PM-POS should have multiple operational configurations that can be switched instantly under certain conditions.

## Things we want to do

* Create a simplified data structure to record all financial and inventory transactions.
* Create P2P networks for local terminals to generate centeralized local ledgers to allow terminals to operate without need for connecting to a server.
* Create a decenteralized public ledger network to integrate local ledgers.
* Create a cyrptocurrency that will be used to operate public ledgers. That currency can also be useful to create loyalty and payment solutions.

## Things we used to create PM-POS

| Project                                                    | Description                              |
| ---------------------------------------------------------- | ---------------------------------------- |
| [y-js](http://y-js.org/)                                   | To share card commits with clients       |
| [react](https://reactjs.org/)                              | To create UI Components                  |
| [redux](https://redux.js.org/)                             | To manage UI State                       |
| [immutable-js](https://facebook.github.io/immutable-js/)   | To make UI State immutable               |
| [redux-observable](https://redux-observable.js.org/)       | To watch redux actions and trigger rules |
| [nools-ts](https://github.com/taoqf/nools-ts)              | To build and execute rules               |
| [material-ui](http://www.material-ui.com/)                 | For mobile UI components                 |
| [typescript](https://www.typescriptlang.org/)              | To add typesafe feature to JS            |
| [blueimp](https://github.com/blueimp/JavaScript-Templates) | To create string templates               |

## Documentation

Visit https://github.com/emreeren/pmpos3/wiki for documentation.
