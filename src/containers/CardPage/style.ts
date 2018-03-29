import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    card: any;
    content: any;
    paper: any;
    modal: any;
    root: any;
    footer: any;
    tagSection: any;
    tagItem: any;
    tagItemContent: any;
    tagBalance: any;
    selectedCardLine: any;
    cardLine: any;
    cardLineIcon: any;
    node: any;
    leaf: any;
    indexHeader: any;
    subCards: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    node: {
        // marginLeft: spacing.unit,
        // paddingBottom: spacing.unit,
        // marginBottom: spacing.unit,
        borderColor: palette.divider,
        backgroundColor: palette.background.default,
        display: 'flex',
        flexFlow: 'column',
        paddingLeft: spacing.unit,
        flex: 1
    },
    leaf: {
        backgroundColor: palette.common.white,
        paddingLeft: spacing.unit,
    },
    subCards: {
        overflow: 'auto',
        flex: '1 1 auto',
        height: '1px'
    },
    tagSection: {
        display: 'inline-flex',
        flex: 1,
        flexFlow: 'column',
        paddingBottom: spacing.unit / 2,
        paddingTop: spacing.unit,
    },
    tagItem: {
        display: 'inline-flex',
        width: '100%',
        paddingBottom: spacing.unit / 2
    },
    tagItemContent: {
        flex: 1,
        alignSelf: 'center',
        paddingLeft: spacing.unit / 2
    },
    tagBalance: {
        fontSize: '1.2em',
        paddingRight: 8,
        alignSelf: 'center'
    },
    cardLine: {
        flex: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: '1px solid ' + palette.divider,
        '&:hover': {
            background: palette.grey.A100
        }

        // borderLeft: '1px solid ' + palette.text.divider,
        // borderRight: '1px solid ' + palette.text.divider,
    },
    selectedCardLine: {
        backgroundColor: palette.grey.A100
        // borderLeft: '1px solid ' + palette.text.divider,
        // borderRight: '1px solid ' + palette.text.divider,
    },
    cardLineIcon: {
        marginTop: spacing.unit,
        fontSize: 20
    },
    card: {
        padding: spacing.unit,
        marginBottom: spacing.unit
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    indexHeader: {
        padding: spacing.unit,
        borderBottom: '1px solid ' + palette.divider,
    },
    content: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
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