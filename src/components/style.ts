import withStyles from 'material-ui/styles/withStyles';

export interface Style {
    list: any;
    draggableList: any;
    sectionList: any;
}

export default withStyles(({ palette, spacing, breakpoints }): Style => ({
    list: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit
    },
    draggableList: {
        overflow: 'auto',
        backgroundColor: palette.background.paper
    },
    sectionList: {
        padding: 0,
        backgroundColor: palette.background.paper
    },
}));