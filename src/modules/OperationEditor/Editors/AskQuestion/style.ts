import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    container: any;
    suggestionsContainerOpen: any;
    suggestion: any;
    suggestionsList: any;
    textField: any;
    buttonContainer: any;
    selectionButton: any;
    contentRoot: any;
    contentTitle: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    buttonContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    selectionButton: {
        flexGrow: 1,
        minWidth: '22%',
        textTransform: 'unset',
        margin: spacing.unit / 2
    },
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
    contentRoot: {
        display: 'flex',
        flexFlow: 'column',
        overflow: 'auto',
        [breakpoints.down('xs')]: {
            '&:first-child': {
                paddingTop: spacing.unit
            },
            paddingTop: 0,
            paddingLeft: spacing.unit,
            paddingRight: spacing.unit,
            paddingBottom: spacing.unit,
        },
    },
    contentTitle: {
        [breakpoints.down('xs')]: {
            padding: spacing.unit
        },
    }
}));