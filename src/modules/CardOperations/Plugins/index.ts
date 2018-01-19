import CreateCard from './CreateCard';
import SetCardTag from './SetCardTag';
import CloseCard from './CloseCard';
import ExecuteCommand from './ExecuteCommand';
import SetState from './SetState';
import AskQuestion from './AskQuestion/index';

export default [
    new CreateCard(),
    new SetCardTag(),
    new CloseCard(),
    new ExecuteCommand(),
    new SetState(),
    new AskQuestion()
];