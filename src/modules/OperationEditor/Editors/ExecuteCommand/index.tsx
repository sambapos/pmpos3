import * as React from 'react';
import { TextField, Button, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import * as shortid from 'shortid';
import IEditorProperties from '../editorProperties';

interface IEditorState {
    name: string;
    parameters: string;
}

export default class ExecuteCommand extends React.Component<IEditorProperties<{}>, IEditorState> {
    public state = { name: '', parameters: '' };

    public render() {
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
                                                const parts = p.split(',');
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