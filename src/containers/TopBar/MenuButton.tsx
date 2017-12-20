import * as React from 'react';
import { IconButton } from 'material-ui';

export interface MenuCommand {
    icon: string;
    onClick: () => void;
}

export default (props: { command: MenuCommand }) => {
    return (
        <IconButton
            color="contrast"
            aria-label="open drawer"
            onClick={() => props.command.onClick()}
        >
            <i className="material-icons">{props.command.icon}</i>
        </IconButton>
    );
};