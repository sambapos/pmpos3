import Registry from './operationEditorRegistry';
import ExecuteCommand from './Editors/ExecuteCommand';
import AskQuestion from './Editors/AskQuestion';
import SelectCard from './Editors/SelectCard';
import SelectCards from './Editors/SelectCards';
import SetCardIndex from './Editors/SetCardIndex';
import SetCardTag from './Editors/SetCardTag';

const registry = (() => {
    const r = new Registry();
    r.registerEditor('EXECUTE_COMMAND', ExecuteCommand);
    r.registerEditor('ASK_QUESTION', AskQuestion);
    r.registerEditor('SELECT_CARD', SelectCard);
    r.registerEditor('SELECT_CARDS', SelectCards);
    r.registerEditor('SET_CARD_INDEX', SetCardIndex);
    r.registerEditor('SET_CARD_TAG', SetCardTag);
    return r;
})();

export default registry;