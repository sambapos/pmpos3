import { withStyles } from 'material-ui';

export interface Style {
    root: any;
    content: any;
    footer: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        flex: '1 1 auto',
        overflowY: 'auto',
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center'
        },
    },
    footer: {
        [breakpoints.up('sm')]: {
            maxWidth: '600px',
            width: '100%',
            alignSelf: 'center',
        }
    }
}));