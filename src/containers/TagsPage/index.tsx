import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, ListItem, Paper, List } from 'material-ui';
import decorate, { Style } from './style';
import { List as IList } from 'immutable';
import TopBar from '../TopBar';
import Divider from 'material-ui/Divider/Divider';
import { CardTagRecord } from '../../models/CardTag';
import CardList from '../../modules/CardList';
import ListItemText from 'material-ui/List/ListItemText';

type PageProps =
    WithStyles<keyof Style>
    & RouteComponentProps<{}>;

class TagsPage extends React.Component<PageProps, {}> {

    getSecondaryCommands() {
        let result = [
            {
                icon: 'add', onClick: () => {
                    this.props.history.push('/cardType');
                }
            }
        ];
        return result;
    }

    renderTags(tags: IList<CardTagRecord>) {
        return tags.map(tag => {
            return tag && (
                <div key={tag.id}>
                    <ListItem>
                        <ListItemText
                            primary={tag.display}
                            secondary={tag.locationDisplay}
                        />
                        <div className={this.props.classes.amount}>{tag.debitDisplay}</div>
                        <div className={this.props.classes.amount}>{tag.creditDisplay}</div>
                    </ListItem>
                    <Divider />
                </div>
            );
        });
    }

    public render() {
        return (
            <div className={this.props.classes.root}>
                <TopBar
                    title="Tags"
                    secondaryCommands={this.getSecondaryCommands()}
                />

                <div className={this.props.classes.content}>
                    <Paper >
                        <List>
                            {this.renderTags(CardList.getTags())}
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default decorate(TagsPage);