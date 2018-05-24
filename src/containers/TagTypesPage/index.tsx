import * as React from 'react';
import { connect } from 'react-redux';
import * as ConfigStore from '../../store/Config';
import { RouteComponentProps } from 'react-router';
import { WithStyles, List, ListItem, Paper, Divider, ListItemText } from '@material-ui/core';
import decorate, { IStyle } from './style';
import { IApplicationState } from '../../store/index';
import { Map as IMap } from 'immutable';
import TopBar from '../TopBar';
import { TagTypeRecord } from 'pmpos-core';

type PageProps =
    { tagTypes: IMap<string, TagTypeRecord> }
    & WithStyles<keyof IStyle>
    & typeof ConfigStore.actionCreators
    & RouteComponentProps<{}>;

class TagTypesPage extends React.Component<PageProps, {}> {

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Tag Types"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <Paper className={this.props.classes.content}>
                    <List>
                        {this.renderTags(this.props.tagTypes.valueSeq().toArray())}
                    </List>
                </Paper>
            </div>
        );
    }

    private getSecondaryCommands() {
        const result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push(process.env.PUBLIC_URL + '/tagType');
                    this.props.addTagType();
                }
            }
        ];
        return result;
    }

    private renderTags(tagTypes: TagTypeRecord[]) {
        return tagTypes.sort((x, y) => x.name > y.name ? 1 : -1).map(tagType => {
            return tagType && (
                <div key={tagType.id}>
                    <ListItem
                        button
                        onClick={(e) => {
                            this.props.history.push(process.env.PUBLIC_URL + '/tagType');
                            this.props.loadTagType(tagType.id);
                            e.preventDefault();
                        }}
                    >
                        <ListItemText
                            primary={tagType.name}
                            secondary={tagType.id}
                        />
                    </ListItem>
                    <Divider />
                </div>
            );
        });
    }
}

const mapStateToProps = (state: IApplicationState) => ({
    tagTypes: state.config.tagTypes,
});

export default decorate(connect(
    mapStateToProps,
    ConfigStore.actionCreators
)(TagTypesPage));