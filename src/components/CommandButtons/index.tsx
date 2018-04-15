import * as React from 'react';
import { Button, WithStyles } from 'material-ui';
import { CommandButton } from '../CommandButton';
import { CardRecord } from '../../models/Card';
import decorate, { Style } from './style';

interface CommandButtonsProps {
    buttons: CommandButton[];
    card: CardRecord;
    handleButtonClick: (card: CardRecord, button: CommandButton) => void;
}

const CommandButtons = (props: CommandButtonsProps & WithStyles<keyof Style>) => {
    return <>
        {props.buttons.map(button => (
            <Button variant="raised" className={props.classes.button}
                color="primary"
                key={`cmd_${button.caption}_${props.card.id}`}
                onClick={e => {
                    props.handleButtonClick(props.card, button);
                }}>
                {button.caption}
            </Button>
        ))}
    </>;
};

export default decorate(CommandButtons);