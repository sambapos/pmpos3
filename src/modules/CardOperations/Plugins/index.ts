import CreateCard from './CreateCard';
import SetCardTag from './SetCardTag';
import CloseCard from './CloseCard';
import ExecuteCommand from './ExecuteCommand';
import SetState from './SetState';
import AskQuestion from './AskQuestion/index';
import SelectCard from './SelectCard/index';
import SetCardIndex from './SetCardIndex';
import SubmitCard from './SubmitCard';
import DisplayCard from './DisplayCard';

export default [
    new CreateCard(),
    new SetCardTag(),
    new CloseCard(),
    new SubmitCard(),
    new DisplayCard(),
    new SetCardIndex(),
    new ExecuteCommand(),
    new SetState(),
    new AskQuestion(),
    new SelectCard()
];