import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    list: any;
    draggableList: any;
    sectionList: any;
    button: any;
    bigButton: any;
    smallButton: any;
    highlightedButton: any;
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
        boxShadow: 'none',
        border: '1px solid #ccc',
        [breakpoints.up('sm')]: {
            margin: 4,
            minWidth: 'calc(20% - 8px)',
            maxWidth: 'calc(50% - 8px)',
        },
    },
    highlightedButton: {

    }
}));