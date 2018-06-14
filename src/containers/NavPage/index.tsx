import * as classNames from 'classnames';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';

import { ListItem, ListItemText, Typography, List, Hidden, Drawer, Divider } from '@material-ui/core';
import { Route, RouteComponentProps } from 'react-router';
import { subRoutes } from '../../routes';
import NavList from './navList';
import decorate, { IStyle } from './style';

import { connect } from 'react-redux';
import * as ClientStore from '../../store/Client';
import { IApplicationState } from '../../store/index';
import LoginPage from '../LoginPage';
import AppDialog from './AppDialog';

interface INavPageProps {
    drawerOpen: boolean;
    loggedInUser: string;
    modalOpen: boolean;
    modalComponent: any;
}

type Props =
    INavPageProps
    & WithStyles<keyof IStyle>
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class NavPage extends React.Component<Props> {
    public state = {
        anchor: 'Left'
    };

    public componentWillReceiveProps(props: Props) {
        if (this.props.modalOpen) { this.props.SetModalState(false); }
    }

    public handleDrawerToggle = () => {
        this.props.ToggleDrawer();
    }

    public closeDrawer = () => {
        this.props.ToggleDrawer(true);
    }

    public render() {
        const { classes } = this.props;
        const { anchor } = this.state;
        const drawer = (
            <div>
                <div className={classes.drawerHeader} >
                    <Typography
                        variant="title"
                        color="inherit"
                        className={classes.drawerCaption}
                    >
                        PM-POS 3.0<span style={{ fontSize: '0.5em', marginRight: 15, float: 'right' }}>
                            V{process.env.REACT_APP_VERSION}
                        </span>
                    </Typography>
                </div>
                <Divider />
                <NavList
                    loggedInUser={this.props.loggedInUser}
                    history={this.props.history}
                    closeDrawer={this.closeDrawer}
                />
                <Divider />
                <List>
                    <ListItem
                        button={true}
                        onClick={() => {
                            this.props.history.push(process.env.PUBLIC_URL + '/about');
                            if (window.innerWidth < 1024) { this.handleDrawerToggle(); }
                        }}
                    >
                        <ListItemText primary="About" />
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <Hidden mdUp={true}>
                        <Drawer
                            variant="temporary"
                            anchor="left"
                            open={this.props.drawerOpen}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            onClose={this.handleDrawerToggle}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown={true}>
                        <Drawer
                            variant="persistent"
                            open={this.props.drawerOpen}
                            anchor="left"
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: this.props.drawerOpen,
                            [classes[`contentShift${anchor}`]]: this.props.drawerOpen,
                        })}
                    >
                        {
                            this.props.loggedInUser
                                ? subRoutes
                                : <div style={{ height: '100%', display: 'flex' }}><Route component={LoginPage} /></div>
                        }
                    </main>
                </div>
                <AppDialog
                    modalOpen={this.props.modalOpen}
                    modalComponent={this.props.modalComponent}
                />
            </div >
        );
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    drawerOpen: state.client.drawerOpen,
    loggedInUser: state.client.loggedInUser,
    modalComponent: state.client.modalComponent,
    modalOpen: state.client.modalOpen
});

export default decorate(connect(
    mapStateToProps,
    ClientStore.actionCreators
)(NavPage));