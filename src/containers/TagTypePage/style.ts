import withStyles from 'material-ui/styles/withStyles';

export interface IStyle {
    card: any;
    content: any;
    paper: any;
    root: any;
    footer: any;
    tagItem: any;
    tagItemContent: any;
    cardLine: any;
    cardLineIcon: any;
    node: any;
    leaf: any;
    fixedEdit: any;
    grouper: any;
    spacer: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    node: {
        backgroundColor: palette.background.paper,
        paddingLeft: spacing.unit,
        paddingRight: spacing.unit,
        paddingBottom: spacing.unit,
        marginBottom: spacing.unit,
        borderColor: palette.divider,
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
        overflowX: 'auto',
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
    },
    spacer: {
        [breakpoints.up('sm')]: {
            marginRight: spacing.unit * 3
        },
        width: 0,
        height: 0
    },
    grouper: {
        flex: 1,
        display: 'flex',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            flexFlow: 'row'
        },
    }
}));