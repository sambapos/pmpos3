import CreateCard from './CreateCard';
import SetCardTag from './SetCardTag';
import CloseCard from './CloseCard';
import ExecuteCommand from './ExecuteCommand';
import SetState from './SetState';
import AskQuestion from './AskQuestion/index';
import SelectCard from './SelectCard/index';
import SetCardIndex from './SetCardIndex';

export default [
    new CreateCard(),
    new SetCardTag(),
    new CloseCard(),
    new SetCardIndex(),
    new ExecuteCommand(),
    new SetState(),
    new AskQuestion(),
    new SelectCard()
];