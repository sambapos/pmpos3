import * as React from 'react';
import { DialogContent, DialogActions, Button } from 'material-ui';
import Accounts from './Accounts';
import TopBar from '../TopBar';
import Commits from './Commits';
import CardList from '../../modules/CardList';
import { CardRecord } from 'pmpos-models';

const getTitle = (card: CardRecord) => {
    let ct = CardList.getCardType(card.typeId);
    let cap = ct ? ct.reference : `Card`;
    return !card.name
        ? `New ${cap}`
        : `${card.display}`;
};

export default (props: any) => {
    return (<TopBar
        title={getTitle(props.card)}
        menuCommand={{ icon: 'close', onClick: () => { props.history.goBack(); } }}
        secondaryCommands={[
            {
                icon: 'folder_open',
                menuItems: [{
                    icon: 'Display Commits', onClick: () => {
                        props.SetModalComponent((
                            <>
                                <DialogContent>
                                    <Commits
                                        pendingActions={props.pendingActions}
                                        commits={props.commits}
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
                    if (props.onClose) { props.onClose(); }
                }
            }
        ]}
    />);
};