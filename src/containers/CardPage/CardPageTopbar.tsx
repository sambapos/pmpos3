import * as React from 'react';
import { DialogContent, DialogActions, Button } from '@material-ui/core';
import Accounts from './Accounts';
import TopBar from '../TopBar';
import Commits from './Commits';
import { CardRecord, ActionRecord, CommitRecord, ConfigManager } from 'pmpos-core';
import { CardPageProps } from './CardPageProps';
import { List } from 'immutable';
import { vibrate } from '../../lib/helpers';

const getTitle = (card: CardRecord) => {
    const ct = ConfigManager.getCardTypeById(card.typeId);
    const cap = ct ? ct.reference : `Card`;
    return !card.name
        ? `New ${cap}`
        : `${card.display}`;
};

interface ITopBarProps {
    onCancel: () => void;
    onClose: () => void;
    pendingActions: () => List<ActionRecord>;
    commits: () => List<CommitRecord> | undefined;
}

export default (props: CardPageProps & ITopBarProps) => {
    return (<TopBar
        title={getTitle(props.card)}
        menuCommand={{
            icon: 'close', onClick: () => {
                vibrate(10);
                props.onCancel();
            }
        }}
        secondaryCommands={[
            {
                icon: 'folder_open',
                menuItems: [{
                    icon: 'Display Commits', onClick: () => {
                        props.SetModalComponent((
                            <>
                                <DialogContent>
                                    <Commits
                                        pendingActions={props.pendingActions()}
                                        commits={props.commits() || List<CommitRecord>()}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => props.SetModalState(false)}>Close</Button>
                                </DialogActions>
                            </>
                        ));

                    }
                },
                {
                    icon: 'Display Accounts', onClick: () => {
                        props.SetModalComponent((
                            <>
                                <DialogContent>
                                    <Accounts card={props.card} />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => props.SetModalState(false)}>Close</Button>
                                </DialogActions>
                            </>
                        ));

                    }
                }]
            },
            {
                icon: 'check', onClick: () => {
                    if (props.onClose) {
                        vibrate([10, 50, 10, 50, 10]);
                        props.onClose();
                    }
                }
            }
        ]}
    />);
};