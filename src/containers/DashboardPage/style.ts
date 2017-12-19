import { withStyles } from 'material-ui';

export interface Style {
    root: any;
    content: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): Style => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
    },
    content: {
        overflowY: 'auto'
    }
}));