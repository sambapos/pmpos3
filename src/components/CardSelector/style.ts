import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    content: any;
    container: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    content: {
        flex: '1',
        display: 'flex',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            padding: spacing.unit / 2,
            alignSelf: 'center'
        },
    },
    container: {
        flex: 1,
        flexWrap: 'wrap',
        display: 'flex',
        paddingTop: 2,
        overflow: 'auto',
        backgroundColor: palette.background.paper
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em',
        maxWidth: '48.5%',
        maxHeight: '50%',
        [breakpoints.up('sm')]: {
            margin: 4
        },
    },
    highlightedButton: {

    }
}));