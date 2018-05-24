import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    container: any;
    suggestionsContainerOpen: any;
    suggestion: any;
    suggestionsList: any;
    textField: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'fixed',
        marginTop: spacing.unit,
        marginBottom: spacing.unit * 3,
        // left: 0,
        // right: 0,
        overflow: 'auto',
        maxHeight: 200
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