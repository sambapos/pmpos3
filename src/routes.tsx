import * as React from 'react';
import DashboardPage from './containers/DashboardPage';
import NavPage from './containers/NavPage';
import AboutPage from './containers/AboutPage';
import DocumentsPage from './containers/DocumentsPage';
import { Route } from 'react-router-dom';

export const routes = (
    <Route path="/" component={NavPage} />
);

export const subRoutes = (
    <div>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/documents" component={DocumentsPage} />
        <Route exact path="/about" component={AboutPage} />
    </div>
);