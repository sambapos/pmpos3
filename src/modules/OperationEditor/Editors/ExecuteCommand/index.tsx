import * as React from 'react';
import { TextField, Button } from 'material-ui';
import * as shortid from 'shortid';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import EditorProperties from '../editorProperties';

interface EditorState {
    name: string;
    parameters: string;
}

export default class ExecuteCommand extends React.Component<EditorProperties<{}>, EditorState> {
    state = { name: '', parameters: '' };

    render() {
        return (
            <div>
                <DialogTitle>Execute Command</DialogTitle>
                <DialogContent>
                    {<TextField
                        label="Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />}
                    <TextField
                        label="Parameters"
                        value={this.state.parameters}
                        onChange={e => this.setState({ parameters: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => this.props.cancel()}>Cancel</Button> */}
                    <Button
                        onClick={(e) => {
                            this.props.success(
                                this.props.actionName,
                                {
                                    id: shortid.generate(),
                                    name: this.state.name,
                                    parameters: this.state.parameters.split(',')
                                        .reduce(
                                            (r, p) => {
                                                let parts = p.split(',');
                                                r[parts[0]] = parts[1];
                                                return r;
                                            },
                                            {})
                                });
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </div>
        );
    }
}