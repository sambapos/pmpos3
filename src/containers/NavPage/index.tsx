import * as React from 'react';
import classNames from 'classnames';
import { WithStyles } from 'material-ui/styles/withStyles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';

import NavList from './navList';
import { subRoutes } from '../../routes';
import { RouteComponentProps, Route } from 'react-router';
import { ListItem, ListItemText, Typography, Dialog } from 'material-ui';
import decorate, { Style } from './style';

import * as ClientStore from '../../store/Client';
import { ApplicationState } from '../../store/index';
import { connect } from 'react-redux';
import LoginPage from '../LoginPage';

interface NavPageProps {
    drawerOpen: boolean;
    loggedInUser: string;
    modalOpen: boolean;
    modalComponent: any;
}

type Props =
    NavPageProps
    & WithStyles<keyof Style>
    & typeof ClientStore.actionCreators
    & RouteComponentProps<{}>;

class NavPage extends React.Component<Props> {
    state = {
        anchor: 'Left'
    };

    componentWillReceiveProps(props: Props) {
        if (this.props.modalOpen) { this.props.SetModalState(false); }
    }

    handleDrawerToggle = () => {
        this.props.ToggleDrawer();
    }

    closeDrawer = () => {
        this.props.ToggleDrawer(true);
    }

    render() {
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
                        button
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
                    <Hidden mdUp>
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
                    <Hidden smDown>
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
                <Dialog
                    disableBackdropClick
                    transition={undefined}
                    open={this.props.modalOpen}
                >
                    {this.props.modalComponent}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    drawerOpen: state.client.drawerOpen,
    loggedInUser: state.client.loggedInUser,
    modalOpen: state.client.modalOpen,
    modalComponent: state.client.modalComponent
});

export default decorate(connect(
    mapStateToProps,
    ClientStore.actionCreators
)(NavPage));