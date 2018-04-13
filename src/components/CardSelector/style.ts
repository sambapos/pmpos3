import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    container: any;
    button: any;
    highlightedButton: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    container: {
        flex: 1,
        flexWrap: 'wrap',
        display: 'flex',
        paddingTop: 2,
        overflow: 'auto',
        backgroundColor: palette.background.paper,
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            padding: spacing.unit / 2,
            alignSelf: 'center'
        },
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em',
        [breakpoints.up('sm')]: {
            margin: 4
        },
    },
    highlightedButton: {

    }
}));