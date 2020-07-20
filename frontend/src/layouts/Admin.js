import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";


const switchRoutes = (
    <Switch>
        {routes.map((prop, key) => {
            if (prop.layout === "/") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            }
            return null;
        })}
    </Switch>
);

export default function Admin({ ...rest }) {
    return (
        localStorage.getItem('token') ?
            <Sidebar
                switchRoutes={switchRoutes}
                {...rest}
            />
            : <Redirect to="/login" />
    );
}
