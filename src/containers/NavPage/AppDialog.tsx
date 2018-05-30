import * as React from "react";
import { Dialog } from "@material-ui/core";
import withMobileDialog from '@material-ui/core/withMobileDialog';

export interface IAppDialogProps {
    fullScreen?: boolean;
    modalOpen: boolean;
    modalComponent: any;
}

class AppDialog extends React.Component<IAppDialogProps>{
    public render() {
        return (
            <Dialog
                fullScreen={this.props.fullScreen}
                PaperProps={{ style: { flex: 1, overflow: 'unset', margin: 0 } }}
                disableBackdropClick={true}
                open={this.props.modalOpen}
                transitionDuration={{ exit: 0 }}
            >
                {this.props.modalComponent}
            </Dialog>)
    }
}

export default withMobileDialog<IAppDialogProps>({ breakpoint: 'xs' })(AppDialog);