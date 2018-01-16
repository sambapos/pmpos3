import * as React from 'react';
import DashboardPage from './containers/DashboardPage';
import NavPage from './containers/NavPage';
import AboutPage from './containers/AboutPage';
import TasksPage from './containers/TasksPage';
import ChatPage from './containers/ChatPage';
import LoginPage from './containers/LoginPage';
import CardsPage from './containers/CardsPage';
import CardPage from './containers/CardPage';
import CardTypesPage from './containers/CardTypesPage';
import CardTypePage from './containers/CardTypePage';
import RulesPage from './containers/RulesPage';
import RulePage from './containers/RulePage';
import ReportPage from './containers/ReportPage';
import { Route } from 'react-router-dom';

export const routes = (
    <Route path="/" component={NavPage} />
);

export const subRoutes = (
    <div style={{ height: '100%', display: 'flex' }}>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={DashboardPage} />
        <Route exact path={process.env.PUBLIC_URL + '/index.html'} component={DashboardPage} />
        <Route exact path={process.env.PUBLIC_URL + '/tasks'} component={TasksPage} />
        <Route exact path={process.env.PUBLIC_URL + '/chat'} component={ChatPage} />
        <Route exact path={process.env.PUBLIC_URL + '/about'} component={AboutPage} />
        <Route exact path={process.env.PUBLIC_URL + '/login'} component={LoginPage} />
        <Route exact path={process.env.PUBLIC_URL + '/cardTypes'} component={CardTypesPage} />
        <Route exact path={process.env.PUBLIC_URL + '/cardType'} component={CardTypePage} />
        <Route exact path={process.env.PUBLIC_URL + '/rules'} component={RulesPage} />
        <Route exact path={process.env.PUBLIC_URL + '/rule'} component={RulePage} />
        <Route exact path={process.env.PUBLIC_URL + '/cards'} component={CardsPage} />
        <Route exact path={process.env.PUBLIC_URL + '/card/:id?'} component={CardPage} />
        <Route exact path={process.env.PUBLIC_URL + '/report'} component={ReportPage} />
    </div>
);