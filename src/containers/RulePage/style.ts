import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    content: any;
    root: any;
    footer: any;
    editor: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    editor: {
        flex: 1,
        width: 'auto',
        marginTop: spacing.unit
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
        flexFlow: 'column',
        [breakpoints.up('md')]: {
            width: '900px',
            alignSelf: 'center'
        },
    },
    footer: {
        [breakpoints.up('md')]: {
            maxWidth: '900px',
            width: '100%',
            alignSelf: 'center',
        },
        flex: 'none'
    }
}));