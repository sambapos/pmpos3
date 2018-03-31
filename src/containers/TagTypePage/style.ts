import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    modal: any;
    root: any;
    footer: any;
    tagItem: any;
    tagItemContent: any;
    cardLine: any;
    cardLineIcon: any;
    node: any;
    leaf: any;
    fixedEdit: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    node: {
        backgroundColor: palette.background.paper,
        paddingLeft: spacing.unit,
        paddingRight: spacing.unit,
        paddingBottom: spacing.unit,
        marginBottom: spacing.unit,
        borderColor: (<any>palette).divider,
        border: '1px solid',
    },
    leaf: {
        paddingLeft: spacing.unit,
        backgroundColor: palette.background.paper,
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
        flex: '1 1 auto'
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        padding: spacing.unit,
        [breakpoints.up('sm')]: {
            maxWidth: 600,
            width: '100%',
            alignSelf: 'center',
            padding: spacing.unit * 3,
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
    },
    fixedEdit: {
        fontFamily: `Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Courier New, monospace`
    }
}));