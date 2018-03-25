import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    container: any;
    suggestionsContainerOpen: any;
    suggestion: any;
    suggestionsList: any;
    textField: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: spacing.unit,
        marginBottom: spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    },
    textField: {
        width: '100%',
    },
}));