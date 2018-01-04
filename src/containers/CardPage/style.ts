import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    modal: any;
    root: any;
    footer: any;
    opMenu: any;
    tagItem: any;
    tagItemContent: any;
    cardLine: any;
    cardLineIcon: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    opMenu: {
        float: 'right'
    },
    tagItem: {
        paddingTop: '4px',
        paddingBottom: '4px',
    },
    tagItemContent: {
        flex: 1
    },
    cardLine: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    cardLineIcon: {
        marginTop: spacing.unit,
        fontSize: 20
    },
    card: {
        minWidth: 275,
        padding: spacing.unit,
        marginBottom: spacing.unit
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto',
        padding: spacing.unit
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        [breakpoints.down('sm')]: {
            flexFlow: 'column'
        },
        [breakpoints.up('md')]: {
            width: '900px',
            alignSelf: 'center'
        },
    },
    footer: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
        },
        flex: 'none'
    },
    modal: {
        position: 'absolute',
        width: '80%',
        maxWidth: spacing.unit * 50,
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        border: '1px solid #e5e5e5',
        backgroundColor: '#fff',
        boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
        padding: spacing.unit * 3,
    },
    paper: {
        [breakpoints.down('sm')]: {
            marginTop: spacing.unit * 3,
        },
        [breakpoints.up('sm')]: {
            marginLeft: spacing.unit * 3,
        },

        flex: '1 1 auto',
        overflowX: 'auto' as 'auto',
    }
}));