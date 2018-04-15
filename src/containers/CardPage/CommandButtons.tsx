import * as React from 'react';
import { Button } from 'material-ui';
import { CommandButton } from './CommandButton';
import { CardRecord } from '../../models/Card';

interface CommandButtonsProps {
    buttons: CommandButton[];
    card: CardRecord;
    handleButtonClick: (card: CardRecord, button: CommandButton) => void;
}

export default (props: CommandButtonsProps) => {
    return <>
        {props.buttons.map(button => (
            <Button
                key={`cmd_${button.caption}_${props.card.id}`}
                onClick={e => {
                    props.handleButtonClick(props.card, button);
                }}>
                {button.caption}
            </Button>
        ))}
    </>;
};