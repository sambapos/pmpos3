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
import TagsPage from './containers/TagsPage';
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
        <Route exact path="/cardTypes" component={CardTypesPage} />
        <Route exact path="/cardType" component={CardTypePage} />
        <Route exact path="/cards" component={CardsPage} />
        <Route exact path="/card/:id?" component={CardPage} />
        <Route exact path="/tags" component={TagsPage} />
    </div>
);