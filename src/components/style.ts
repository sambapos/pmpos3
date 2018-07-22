import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    list: any;
    draggableList: any;
    sectionList: any;
    bigButton: any;
    smallButton: any;
    button: any;
    primaryButton: any;
    secondaryButton: any;
    errorButton: any;
    validationIssue: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    list: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit
    },
    draggableList: {
        flex: 1,
        overflow: 'auto',
        backgroundColor: palette.background.paper
    },
    sectionList: {
        padding: 0,
        backgroundColor: palette.background.paper
    },
    bigButton: {
        fontSize: '1.4em',
    },
    smallButton: {
        fontSize: '1em',
    },
    button: {
        flex: '1 1 auto',
        margin: 2,
        maxWidth: 'calc(50% - 4px)',
        maxHeight: 'calc(50% - 8px)',
        minWidth: 90,
        boxShadow: 'none',
        border: '1px solid #ccc',
        [breakpoints.up('sm')]: {
            margin: 4,
            minWidth: 'calc(20% - 8px)',
            maxWidth: 'calc(50% - 8px)',
        },
    },
    primaryButton: {
        background: palette.primary.main,
        color: palette.primary.contrastText,
        '&:hover': {
            background: palette.primary.dark
        }
    },
    secondaryButton: {
        background: palette.secondary.main,
        color: palette.secondary.contrastText,
        '&:hover': {
            background: palette.secondary.dark
        }
    },
    errorButton: {
        background: palette.error.main,
        color: palette.error.contrastText,
        '&:hover': {
            background: palette.error.dark
        }
    },
    validationIssue: {
        marginLeft: spacing.unit,
        marginRight: spacing.unit,
        marginBottom: spacing.unit,
        padding: spacing.unit,
        background: palette.error.main,
        color: palette.error.contrastText,
        fontSize: '0.9em',
        border: '1px solid',
        borderColor: palette.error.main,
        borderRadius: 4
    }
}));