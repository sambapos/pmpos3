import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, TextField } from 'material-ui';
import decorate, { Style } from './style';
import { ApplicationState } from '../../store/index';
import TopBar from '../TopBar';
import { RuleRecord } from '../../models/Rule';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/snippets/json';

type PageProps =
    {
        isLoading: boolean
        rule: RuleRecord
    }
    & WithStyles<keyof Style>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{ id?: string }>;

export class RulePage extends React.Component<PageProps, { rule: RuleRecord }> {
    constructor(props: PageProps) {
        super(props);
        this.state = { rule: new RuleRecord() };
    }

    public componentWillReceiveProps(props: PageProps) {
        if (!props.isLoading) {
            this.setState({ rule: props.rule });
        }
    }

    public componentWillMount() {
        if (!this.props.isLoading && this.props.rule) {
            this.setState({ rule: this.props.rule });
        }
    }

    getTitle() {
        return this.props.rule.name ? `Rule (${this.props.rule.name})` : 'New Rule';
    }

    public render() {
        if (this.props.isLoading || !this.props.rule) { return <div>Loading</div>; }

        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title={this.getTitle()}
                    menuCommand={{ icon: 'close', onClick: () => { this.props.history.goBack(); } }}
                    secondaryCommands={[
                        {
                            icon: 'format_line_spacing', onClick: () => {
                                this.setState({
                                    rule: new RuleRecord({
                                        id: this.state.rule.id,
                                        name: this.state.rule.name,
                                        content: JSON.stringify(JSON.parse(this.state.rule.content), null, 2)
                                    })
                                });
                            }
                        },
                        {
                            icon: 'check', onClick: () => {
                                this.props.saveRule(this.state.rule);
                                this.props.history.goBack();
                            }
                        }
                    ]}
                />
                <div className={this.props.classes.content}>
                    <TextField
                        label="Rule Name"
                        value={this.state.rule.name}
                        onChange={(e) => this.setState({
                            rule: this.state.rule.set('name', e.target.value)
                        })}
                    />

                    <AceEditor
                        mode="json"
                        theme="github"
                        name="jsonEdit"
                        height="auto"
                        width="auto"
                        className={this.props.classes.editor}
                        onChange={(e) => this.setState({
                            rule: this.state.rule.set('content', e)
                        })}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={this.state.rule.content}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                            tabSize: 2,
                        }} />
                </div >
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    rule: state.config.currentRule,
    isLoading: state.config.isLoading
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(RulePage));