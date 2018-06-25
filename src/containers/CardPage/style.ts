import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    card: any;
    content: any;
    paper: any;
    modal: any;
    root: any;
    cardView: any;
    container: any;
    commandButtons: any;
    footer: any;
    tagSection: any;
    tagItem: any;
    tagItemAmount: any;
    tagLocation: any;
    tagItemContent: any;
    tagBalance: any;
    selectedCardLine: any;
    pendingCardLine: any;
    cardLine: any;
    cardLineIcon: any;
    node: any;
    leaf: any;
    indexHeader: any;
    subCards: any;
    icon: any;
    newCard: any;
    spacer: any;
    nodeContent: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    newCard: {
        flex: 1,
        margin: spacing.unit,
        fontStyle: 'italic',
        color: palette.text.disabled
    },
    node: {
        borderColor: palette.divider,
        display: 'flex',
        flexFlow: 'column',
        flex: 1
    },
    leaf: {
        display: 'flex',
        flex: 1
    },
    subCards: {
        overflow: 'auto',
        flex: '1 1 auto'
        // height: '1px'
    },
    tagSection: {
        flex: 1,
        paddingBottom: spacing.unit / 2,
        paddingTop: spacing.unit,
    },
    tagItem: {
        display: 'inline-flex',
        backgroundColor: palette.divider,
        borderRadius: 4,
        padding: spacing.unit / 2,
        marginLeft: spacing.unit / 2,
        marginBottom: spacing.unit / 2
    },
    tagItemAmount: {
        display: 'inline-flex',
        width: '100%',
        paddingBottom: spacing.unit / 2
    },
    tagItemContent: {
        flex: 1,
        alignSelf: 'center',
        paddingLeft: spacing.unit / 2
    },
    tagLocation: {
        fontSize: '0.75em',
        color: palette.text.secondary
    },
    tagBalance: {
        fontSize: '1.2em',
        paddingRight: 8,
        alignSelf: 'center'
    },
    cardLine: {
        flex: '1 0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 30,
        paddingLeft: 2,
        backgroundColor: palette.common.white,
        borderBottom: '1px solid ' + palette.divider,
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    },
    nodeContent: {
        display: 'flex',
        overflow: 'hidden'
    },
    spacer: {
        backgroundColor: palette.divider,
        width: 4
    },
    selectedCardLine: {
        backgroundColor: palette.grey['200']
    },
    pendingCardLine: {
        fontWeight: 'bold',
        color: 'darkslategray'
    },
    cardLineIcon: {
        marginTop: spacing.unit,
        fontSize: 26
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
        paddingLeft: spacing.unit * 2,
        borderBottom: '1px solid ' + palette.divider,
    },
    content: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        overflow: 'hidden',
        marginLeft: -4,
        backgroundColor: palette.background.default,
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%'
        },
    },
    cardView: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1',
        overflow: 'hidden',
        [breakpoints.up('sm')]: {
            minWidth: 330
        },
    },
    container: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1',
        width: '100%',
        alignSelf: 'center',
        overflow: 'hidden',
        [breakpoints.up('sm')]: {
            flexFlow: 'row'
        },
    },
    commandButtons: {
        flex: 'none',
        overflow: 'auto',
        [breakpoints.down('xs')]: {
            maxHeight: '40%'
        },
        [breakpoints.up('sm')]: {
            flex: 1,
        },
        [breakpoints.up('md')]: {
            flex: 1.6
        },
        [breakpoints.up('lg')]: {
            flex: 2
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
    icon: {
        fontSize: '1.1rem', marginRight: 2,
        opacity: 0.8,
        height: 'auto', verticalAlign: 'bottom',
    }
}));