import withStyles from 'material-ui/styles/withStyles';

export interface IStyle {
    content: any;
    paper: any;
    root: any;
    fixedEdit: any;
    subHeader: any;
    dynamicRow: any;
    fixedRow: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    subHeader: {
        flex: 1,
        overflow: 'auto',
        marginTop: spacing.unit,
        padding: spacing.unit
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        padding: spacing.unit,
        marginTop: spacing.unit,
        [breakpoints.up('sm')]: {
            maxWidth: 600,
            width: '100%',
            alignSelf: 'center',
            padding: spacing.unit * 3,
            marginTop: spacing.unit * 3
        },
    },
    dynamicRow: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1',
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
        [breakpoints.down('xs')]: {
            fontSize: '0.9em'
        },
        [breakpoints.up('sm')]: {
            flexFlow: 'row',
            padding: spacing.unit * 3
        },
    },
    fixedRow: {
        display: 'flex',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: 600,
            flexFlow: 'row',
            width: '100%',
            alignSelf: 'center',
        },
    },
    paper: {
        display: 'flex',
        flexFlow: 'column',
        padding: spacing.unit,
        [breakpoints.up('sm')]: {
            padding: spacing.unit * 3,
        },
        width: '100%'
    },
    fixedEdit: {
        fontFamily: `Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Courier New, monospace`
    }
}));