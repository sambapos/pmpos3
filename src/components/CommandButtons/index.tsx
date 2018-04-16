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
    return <div className={props.classes.commandButtonsContainer}>
        {props.buttons.map(button => (
            <Button size="large" variant="raised" className={props.classes.button}
                color="primary"
                key={`cmd_${button.caption}_${props.card.id}`}
                onClick={e => {
                    props.handleButtonClick(props.card, button);
                }}>
                {button.caption}
            </Button>
        ))}
    </div>;
};

export default decorate(CommandButtons);