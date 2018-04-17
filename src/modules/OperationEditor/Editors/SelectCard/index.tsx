import * as React from 'react';
import { Button } from 'material-ui';
import { DialogActions, DialogTitle } from 'material-ui';
import RuleManager from '../../../RuleManager';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import EditorProperties from '../editorProperties';

type Props = EditorProperties<{ type: string, selected: string }>;

export default (props: Props) => {
    if (!props.current) {
        return <div>default parameters must set</div>;
    }
    return <>
        <DialogTitle>{
            props.current.selected
                ? `Change ${props.current.type}: ${props.current.selected}`
                : `Set ${props.current.type}`
        }
        </DialogTitle>
        <div style={{ margin: 4 }}>
            <CardSelectorPage
                cardType={props.current.type}
                onSelectCard={card => {
                    if (props.current) {
                        RuleManager.state.set(props.current.type, card.name);
                    }
                    props.success(props.actionName, props.current);
                }}
            />
        </div>
        <DialogActions>
            <Button onClick={() => props.cancel()}>Cancel</Button>
        </DialogActions>
    </>;
};