import * as React from 'react';
import DashboardPage from './containers/DashboardPage';
import NavPage from './containers/NavPage';
import AboutPage from './containers/AboutPage';
import TasksPage from './containers/TasksPage';
import ChatPage from './containers/ChatPage';
import LoginPage from './containers/LoginPage';
import CardsPage from './containers/CardsPage';
import CardPage from './containers/CardPage';
import { Route } from 'react-router-dom';

export const routes = (
    <Route path="/" component={NavPage} />
);

export const subRoutes = (
    <div style={{ height: '100%', display: 'flex' }}>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/index.html" component={DashboardPage} />
        <Route exact path="/tasks" component={TasksPage} />
        <Route exact path="/chat" component={ChatPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/cards/:id?" component={CardsPage} />
        <Route exact path="/card/:id?/:id2?" component={CardPage} />
    </div>
);