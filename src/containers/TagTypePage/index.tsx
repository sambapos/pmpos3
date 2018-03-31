import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField, Paper } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { TagTypeRecord } from '../../models/TagType';

type PageProps =
    {
        isLoading: boolean
        tagType: TagTypeRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

interface PageState {
    name: string;
}

export class TagTypePage extends React.Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            name: '',
        };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({
                name: props.tagType.name
            });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.tagType) {
            this.setState({
                name: this.props.tagType.name
            });
        }
    }

    getTitle() {
        return this.props.tagType.name ? `Tag Type (${this.props.tagType.name})` : 'New Tag Type';
    }

    public render() {
        if (this.props.isLoading || !this.props.tagType) { return <div>Loading</div>; }
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'delete',
                            menuItems: [{
                                icon: 'Confirm',
                                onClick: () => {
                                    this.props.deleteTagType(this.props.tagType.id);
                                    this.props.history.goBack();
                                }
                            }]
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveTagType(new TagTypeRecord({
                                    id: this.props.tagType.id,
                                    name: this.state.name,
                                }));
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <Paper className={this.props.classes.content}>
                    <TextField
                        label="Tag Type Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({
                            name: e.target.value
                        })}
                    />
                </Paper >
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    tagType: state.config.currentTagType,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(TagTypePage));