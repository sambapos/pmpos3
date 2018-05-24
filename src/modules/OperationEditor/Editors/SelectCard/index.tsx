import * as React from 'react';
import { DialogActions, DialogTitle, Button } from '@material-ui/core';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import IEditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-modules';

type Props = IEditorProperties<{ type: string, selected: string }>;

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
        <div style={{ margin: 4, overflow: 'auto' }}>
            <CardSelectorPage
                cardType={props.current.type}
                onSelectCard={card => {
                    if (props.current) {
                        RuleManager.setState(props.current.type, card.name);
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