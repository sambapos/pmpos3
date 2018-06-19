import * as React from 'react';
import { DialogActions, DialogTitle, Button } from '@material-ui/core';
import CardSelectorPage from '../../../../containers/CardSelectorPage';
import IEditorProperties from '../editorProperties';
import { RuleManager } from 'pmpos-core';

type Props = IEditorProperties<{ type: string, selected: string, selectedCards: object }>;

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
        <div style={{ margin: 4, overflow: 'auto', flex: 1 }}>
            <CardSelectorPage
                highlight={props.current ? props.current.selected : ''}
                cardType={props.current.type}
                onSelectCards={selectedCards => {
                    if (props.current) {
                        props.current.selectedCards = selectedCards.items;
                        for (const type of selectedCards.cardTypes) {
                            const card = selectedCards.get(type);
                            if (card) {
                                RuleManager.setState(type, card.name);
                            }
                        }
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