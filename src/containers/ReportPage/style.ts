import withStyles from 'material-ui/styles/withStyles';

export interface IStyle {
    card: any;
    content: any;
    footer: any;
    root: any;
    table: any;
    tableRow: any;
    tableCell: any;
    tableCellNumber: any;
    tableSecondary: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    card: {
        minWidth: 275,
        marginTop: spacing.unit
    },
    tableSecondary: {
        fontSize: '0.8em',
        color: palette.text.secondary
    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableRow: {
        width: '100%',
    },
    tableCell: {
        borderTop: '1px solid ' + palette.grey.A200,
        padding: spacing.unit,
    },
    tableCellNumber: {
        paddingRight: spacing.unit,
        textAlign: 'right',
        borderLeft: '1px solid ' + palette.grey.A200,
        borderTop: '1px solid ' + palette.grey.A200,
        minWidth: '40px'
    },
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        flexFlow: 'column',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
        },
        [breakpoints.down('xs')]: {
            fontSize: '0.85em',
        }
    },
    footer: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            alignSelf: 'center',
        },
        width: '100%',
        flex: 'none',
        display: 'flex',
        flexFlow: 'column'
    }
}));