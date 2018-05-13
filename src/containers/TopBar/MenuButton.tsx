import * as React from 'react';
import { IconButton, Menu, MenuItem } from 'material-ui';

export interface IMenuCommand {
    icon: string;
    onClick?: () => void;
    menuItems?: IMenuCommand[];
}

interface IMenuCommandProps {
    command: IMenuCommand;
    menuItems?: IMenuCommand[];
}

interface IMenuCommandState {
    anchorEl: any;
}

export default class extends React.Component<IMenuCommandProps, IMenuCommandState> {

    constructor(props: IMenuCommandProps) {
        super(props);
        this.state = { anchorEl: null };
    }
    public render() {
        const open = Boolean(this.state.anchorEl);
        return (
            <div>
                <IconButton
                    color="inherit"
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

    private handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    private handleClose = () => {
        this.setState({ anchorEl: null });
    }
}