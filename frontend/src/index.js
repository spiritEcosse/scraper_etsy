import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";
import * as Sentry from '@sentry/react';

import Admin from "layouts/Admin.js";
import Login from "layouts/Login";

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();

if (process.env.NODE_ENV === 'production') {
    Sentry.init({dsn: process.env.REACT_APP_SENTRY_DSN});
}

ReactDOM.render(
    <Router history={hist}>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Admin} />
        </Switch>
    </Router>,
    document.getElementById("root")
);
