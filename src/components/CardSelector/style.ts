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
        paddingTop: 2
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em'
    },
    highlightedButton: {
        color: palette.primary.contrastText,
        backgroundColor: 'darkorange'
    }
}));