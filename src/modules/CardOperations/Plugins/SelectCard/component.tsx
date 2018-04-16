import * as React from 'react';
import { Button } from 'material-ui';
import { DialogActions, DialogTitle } from 'material-ui';
import RuleManager from '../../../RuleManager';
import { EditorProps } from '../EditorProps';
import CardSelectorPage from '../../../../containers/CardSelectorPage';

type Props = EditorProps<{ type: string, selected: string }>;

export default (props: Props) => {
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
                    RuleManager.state.set(props.current.type, card.name);
                    props.success(props.actionName, props.current);
                }}
            />
        </div>
        <DialogActions>
            <Button onClick={() => props.cancel()}>Cancel</Button>
        </DialogActions>
    </>;
};