import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store';
import { WithStyles } from '@material-ui/core';
import decorate, { IStyle } from './style';
import TopBar from '../TopBar';
import { RuleManager, Widget } from 'sambadna-core';
import { RouteComponentProps } from 'react-router';
import WidgetComponent from './WidgetComponent';

export type PageProps =
    { lastCommitTime: number, lastConfigUpdateTime: number }
    & WithStyles<keyof IStyle>
    & RouteComponentProps<{}>;

interface IState {
    widgets: Widget[],
    lastCommitTime: number,
    lastConfigUpdateTime: number
}

class DashboardPage extends React.Component<PageProps, IState> {
    constructor(props: PageProps) {
        super(props);
        this.state = { widgets: new Array<Widget>(), lastCommitTime: 0, lastConfigUpdateTime: 0 };
        RuleManager.getWidgets({}).then(widgets => this.setState({ widgets }));
    }

    public componentWillReceiveProps(nextProps: PageProps) {
        if (nextProps.lastCommitTime > this.state.lastCommitTime || nextProps.lastConfigUpdateTime > this.state.lastConfigUpdateTime) {
            RuleManager.getWidgets({}).then(widgets => this.setState({ widgets, lastCommitTime: nextProps.lastCommitTime }));
        }
    }

    public render() {
        // const data = [
        //     { name: '08:00', today: 2, yesterday: 1, amt: 2400 },
        //     { name: '09:00', today: 2, yesterday: 2, amt: 2210 },
        //     { name: '10:00', today: 3, yesterday: 3, amt: 2290 },
        //     { name: '11:00', today: 3, yesterday: 5, amt: 2000 },
        //     { name: '12:00', today: 7, yesterday: 5, amt: 2181 },
        //     { name: '13:00', today: 7, yesterday: 6, amt: 2500 },
        //     { name: '14:00', today: 4, yesterday: 3, amt: 2100 },
        //     { name: '15:00', yesterday: 3, amt: 2100 },
        //     { name: '16:00', yesterday: 2, amt: 2100 },
        //     { name: '17:00', yesterday: 2, amt: 2100 },
        //     { name: '18:00', yesterday: 4, amt: 2100 },
        //     { name: '19:00', yesterday: 8, amt: 2100 },
        //     { name: '20:00', yesterday: 9, amt: 2100 },
        //     { name: '21:00', yesterday: 6, amt: 2100 },
        //     { name: '22:00', yesterday: 3, amt: 2100 },
        //     { name: '23:00', yesterday: 3, amt: 2100 },
        // ];
        return (
            <div className={this.props.classes.root}>
                <TopBar title="Dashboard" />
                <div className={this.props.classes.content}>
                    {this.state.widgets.map((widget, index) => <WidgetComponent index={index} key={widget.key} widget={widget} title={widget.title} />)}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state: IApplicationState) => ({
    lastCommitTime: state.cards.lastCommitTime,
    lastConfigUpdateTime: state.config.lastUpdateTime
});

export default decorate(connect(
    mapStateToProps
)(DashboardPage));