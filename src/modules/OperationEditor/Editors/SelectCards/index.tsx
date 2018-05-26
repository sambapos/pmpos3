import * as React from 'react';
import { DialogActions, Button } from '@material-ui/core';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import IEditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-core';

type Props = IEditorProperties<{ type: string }>;

export default (props: Props) => {
    if (!props.current) {
        return <div>default parameters must set</div>;
    }
    return <>
        <div style={{ margin: 4, overflow: 'auto' }}>
            <CardSelectorPage
                smallButtons
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