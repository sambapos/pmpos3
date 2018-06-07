import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store';
import { WithStyles, Card, CardContent, CardHeader } from '@material-ui/core';
import decorate, { IStyle } from './style';
import TopBar from '../TopBar';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Legend, Tooltip } from 'recharts';
import { RuleManager, Widget } from 'pmpos-core';
import { RouteComponentProps } from 'react-router';

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
        console.log('widgets', this.state.widgets);

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
                    {this.state.widgets.map(x => this.getWidgetContent(x))}
                </div>
            </div>
        );
    }

    private getWidgetContent(widget: Widget) {
        return (<Card key={widget.key} className={this.props.classes.card}>
            <CardHeader title={widget.title} />
            {widget.data && <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={widget.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis width={30} />
                        {widget.legends.map(l => (
                            <Line key={l.name} type='monotone'
                                dot={false}
                                dataKey={l.name}
                                stroke={l.color}
                                strokeWidth={l.thickness} />
                        ))}
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>}
        </Card>)
    }
}


const mapStateToProps = (state: IApplicationState) => ({
    lastCommitTime: state.cards.lastCommitTime,
    lastConfigUpdateTime: state.config.lastUpdateTime
});

export default decorate(connect(
    mapStateToProps
)(DashboardPage));