import * as React from "react";
import { WithStyles, Card, CardContent, CardHeader, Slide } from '@material-ui/core';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Legend, Tooltip } from 'recharts';
import decorate, { IStyle } from './style';
import { Widget } from "sambadna-core";

type WidgetComponentProps = {
    title: string;
    widget: Widget;
    index: number;
}
    & WithStyles<keyof IStyle>

interface IState {
    title: string;
}

class WidgetComponent extends React.Component<WidgetComponentProps, IState> {
    constructor(props: WidgetComponentProps) {
        super(props);
        this.state = { title: props.widget.title }
    }

    public componentWillReceiveProps(nextProps: WidgetComponentProps) {
        if (this.state.title !== nextProps.title) {
            setTimeout(() => {
                this.setState({ title: nextProps.title });
            }, ((this.props.index + 1) * 150));
        }
    }
    public render() {
        return <Card className={this.props.classes.card}>
            <Slide
                direction="down"
                in={this.state.title === this.props.title}>
                <CardHeader title={this.state.title} />
            </Slide>
            {this.props.widget.data && <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={this.props.widget.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis width={30} />
                        {this.props.widget.legends.map(l => (
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
        </Card>
    }
}

export default decorate(WidgetComponent);