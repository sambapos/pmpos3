import Registry from './operationEditorRegistry';
import ExecuteCommand from './Editors/ExecuteCommand';
import AskQuestion from './Editors/AskQuestion';
import SelectCard from './Editors/SelectCard';
import SetCardIndex from './Editors/SetCardIndex';
import SetCardTag from './Editors/SetCardTag';

var registry = (function () {
    let r = new Registry();
    r.registerEditor('EXECUTE_COMMAND', ExecuteCommand);
    r.registerEditor('ASK_QUESTION', AskQuestion);
    r.registerEditor('SELECT_CARD', SelectCard);
    r.registerEditor('SET_CARD_INDEX', SetCardIndex);
    r.registerEditor('SET_CARD_TAG', SetCardTag);
    console.log('Registry', r);
    return r;
})();

export default registry;