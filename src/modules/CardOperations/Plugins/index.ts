import CreateCard from './CreateCard';
import SetCardTag from './SetCardTag';
import CloseCard from './CloseCard';
import ExecuteCommand from './ExecuteCommand';
import SetState from './SetState';

export default [
    new CreateCard(),
    new SetCardTag(),
    new CloseCard(),
    new ExecuteCommand(),
    new SetState()
];