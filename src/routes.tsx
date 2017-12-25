import * as React from 'react';
import DashboardPage from './containers/DashboardPage';
import NavPage from './containers/NavPage';
import AboutPage from './containers/AboutPage';
import DocumentsPage from './containers/DocumentsPage';
import DocumentPage from './containers/DocumentPage';
import TasksPage from './containers/TasksPage';
import ChatPage from './containers/ChatPage';
import BlocksPage from './containers/BlocksPage';
import LoginPage from './containers/LoginPage';
import { Route } from 'react-router-dom';

export const routes = (
    <Route path="/" component={NavPage} />
);

export const subRoutes = (
    <div style={{ height: '100%', display: 'flex' }}>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/index.html" component={DashboardPage} />
        <Route exact path="/documents" component={DocumentsPage} />
        <Route exact path="/document/:id" component={DocumentPage} />
        <Route exact path="/tasks" component={TasksPage} />
        <Route exact path="/chat" component={ChatPage} />
        <Route exact path="/blocks" component={BlocksPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/login" component={LoginPage} />
    </div>
);