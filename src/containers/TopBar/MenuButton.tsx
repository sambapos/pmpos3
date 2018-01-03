import * as React from 'react';
import { IconButton, Menu, MenuItem } from 'material-ui';

export interface MenuCommand {
    icon: string;
    onClick?: () => void;
    menuItems?: MenuCommand[];
}

interface MenuCommandProps {
    command: MenuCommand;
    menuItems?: MenuCommand[];
}

interface MenuCommandState {
    anchorEl: any;
}

export default class extends React.Component<MenuCommandProps, MenuCommandState> {

    constructor(props: MenuCommandProps) {
        super(props);
        this.state = { anchorEl: null };
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {
        const open = Boolean(this.state.anchorEl);
        return (
            <div>
                <IconButton
                    color="contrast"
                    aria-label="open drawer"
                    onClick={(e) => {
                        if (this.props.command.onClick) {
                            this.props.command.onClick();
                        } else if (this.props.menuItems) {
                            this.handleMenu(e);
                        }
                    }}
                >
                    <i className="material-icons">{this.props.command.icon}</i>
                </IconButton>
                <Menu
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    {this.props.menuItems && this.props.menuItems.map(mi => {
                        return (
                            <MenuItem
                                key={mi.icon}
                                onClick={() => {
                                    if (mi.onClick) { mi.onClick(); }
                                    this.handleClose();
                                }}
                            >
                                {mi.icon}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </div>
        );
    }
}