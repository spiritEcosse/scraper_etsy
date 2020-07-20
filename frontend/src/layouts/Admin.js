import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {makeStyles} from "@material-ui/core/styles";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";

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

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown ");
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  return (
      localStorage.getItem('token') ?
          <div className={classes.wrapper}>
            <Sidebar
                image={image}
                switchRoutes={switchRoutes}
                {...rest}
            />
            <div className={classes.mainPanel} ref={mainPanel}>
              {/*<Navbar*/}
              {/*    routes={routes}*/}
              {/*    handleDrawerToggle={handleDrawerToggle}*/}
              {/*    {...rest}*/}
              {/*/>*/}
              <FixedPlugin
                  handleImageClick={handleImageClick}
                  handleColorClick={handleColorClick}
                  bgColor={color}
                  bgImage={image}
                  handleFixedClick={handleFixedClick}
                  fixedClasses={fixedClasses}
              />
            </div>
          </div> : <Redirect to="/login" />
  );
}
