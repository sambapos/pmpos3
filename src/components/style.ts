import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    list: any;
    draggableList: any;
    sectionList: any;
    button: any;
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
    button: {
        flex: '1 1 auto',
        margin: 2,
        fontSize: '1.4em',
        maxWidth: 'calc(50% - 4px)',
        maxHeight: 'calc(50% - 4px)',
        boxShadow: 'none',
        border: '1px solid #ccc',
        [breakpoints.up('sm')]: {
            margin: 4,
            minWidth: 100,
            maxWidth: 'calc(25% - 4px)'
        },
    },
    highlightedButton: {

    }
}));