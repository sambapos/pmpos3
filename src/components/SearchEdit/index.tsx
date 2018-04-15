import * as React from 'react';
import * as _ from 'lodash';
import { FormControl, InputLabel, Input, InputAdornment, IconButton, Icon } from 'material-ui';
import { WithStyles } from 'material-ui/styles/withStyles';
import decorate, { Style } from './style';

interface SearchEditProps {
    value: string;
    debounce?: number;
    onChange: (value: string) => void;
}

interface SearchEditState {
    value: string;
}

class SearchEdit extends React.Component<SearchEditProps & WithStyles<keyof Style>, SearchEditState> {
    private debouncedChange;
    private input;

    constructor(props: SearchEditProps & WithStyles<keyof Style>) {
        super(props);
        this.state = { value: props.value };
    }
    componentWillMount() {
        this.debouncedChange = _.debounce(this.props.onChange, this.props.debounce || 200);
    }
    componentWillReceiveProps(nextProps: SearchEditProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }
    render() {
        return <div className={this.props.classes.containter}>
            <FormControl className={this.props.classes.editor}>
                <InputLabel>Search</InputLabel>
                <Input
                    fullWidth
                    value={this.state.value}
                    inputRef={r => this.input = r}
                    onChange={e => {
                        this.setState({ value: e.target.value });
                        this.debouncedChange(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            {this.props.value && <IconButton
                                aria-label="Clear search text"
                                onClick={() => {
                                    this.setState({ value: '' });
                                    this.props.onChange('');
                                    this.input.blur();
                                }}
                                onMouseDown={e => e.preventDefault()}
                            >
                                <Icon>close</Icon>
                            </IconButton>}
                        </InputAdornment >
                    }
                />
            </FormControl>
        </div>;
    }
}

export default decorate(SearchEdit);