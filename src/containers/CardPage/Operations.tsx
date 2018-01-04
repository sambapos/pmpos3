import * as React from 'react';
import CardOperation from '../../modules/CardOperations/CardOperation';
import { IconButton, Menu, MenuItem, WithStyles } from 'material-ui';
import decorate, { Style } from './style';
import { CardRecord } from '../../models/Card';

interface OperationsProps {
    card: CardRecord;
    operations: CardOperation[];
    onClick: (operation: CardOperation) => void;
}

type PageProps = OperationsProps & WithStyles<keyof Style>;

const ITEM_HEIGHT = 48;

class Operations extends React.Component<PageProps, { anchorEl: any }> {
    state = {
        anchorEl: undefined,
    };
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    }
    render() {
        const open = Boolean(this.state.anchorEl);
        return (
            <div className={this.props.classes.opMenu}>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <i className="material-icons">more_vert</i>
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 200,
                        },
                    }}
                >
                    {this.props.operations.map(option => (
                        <MenuItem
                            key={option.type}
                            onClick={e => {
                                this.props.onClick(option);
                                this.handleClose();
                            }}
                        >
                            {option.description}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

export default decorate(Operations);