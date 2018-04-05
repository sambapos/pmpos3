import { withStyles } from 'material-ui';

const drawerWidth = 240;

export interface Style {
    root: any;
    appFrame: any;
    drawerHeader: any;
    drawerCaption: any;
    drawerPaper: any;
    content: any;
    contentShift: any;
    contentShiftLeft: any;
    contentShiftRight: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
    root: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden' as 'hidden',
    },
    appFrame: {
        position: 'relative' as 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    drawerHeader: {
        minHeight: '56px',
        [breakpoints.up('sm')]: {
            minHeight: '64px'
        },
    },
    drawerCaption: {
        paddingTop: '18px',
        paddingLeft: '16px',
        [breakpoints.up('sm')]: {
            paddingTop: '22px'
        },
    },
    drawerPaper: {
        width: 250,
        [breakpoints.up('md')]: {
            width: drawerWidth,
            // position: 'relative',
            height: '100%',
        },
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: palette.action.disabledBackground,
        padding: 0,
        transition: transitions.create('margin', {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
        marginTop: 56,
        [breakpoints.up('md')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
        [breakpoints.up('sm')]: {
            padding: spacing.unit * 3,
        }
    },
    contentShift: {
        transition: transitions.create('margin', {
            easing: transitions.easing.easeOut,
            duration: transitions.duration.enteringScreen,
        }),
    },
    contentShiftLeft: {
        [breakpoints.up('md')]: {
            marginLeft: drawerWidth,
        }
    },
    contentShiftRight: {
        [breakpoints.up('md')]: {
            marginRight: drawerWidth,
        }
    }
}));