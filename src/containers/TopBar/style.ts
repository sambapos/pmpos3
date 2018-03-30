import { withStyles } from 'material-ui';

const drawerWidth = 240;

export interface Style {
    appBar: any;
    appBarShift: any;
    appBarShiftLeft: any;
    appBarShiftRight: any;
    toolbar: any;
    flex: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
    appBar: {
        position: 'absolute' as 'absolute',
        transition: transitions.create(['margin', 'width'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        [breakpoints.down('sm')]: {
            width: '100%',
        },
        transition: transitions.create(['margin', 'width'], {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.enteringScreen,
        }),
    },
    appBarShiftLeft: {
        marginLeft: drawerWidth,
    },
    appBarShiftRight: {
        marginRight: drawerWidth,
    },
    toolbar: {

    },
    flex: {
        marginLeft: spacing.unit * 2,
        flex: 1,
        display: 'flex',
        flexFlow: 'column'
    }
}));