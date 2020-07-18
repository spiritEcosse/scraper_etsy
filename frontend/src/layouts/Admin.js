import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import clsx from 'clsx'
import "perfect-scrollbar/css/perfect-scrollbar.css";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import useMediaQuery from '@material-ui/core/useMediaQuery'

import routes from "routes.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

const useStyles = makeStyles(theme => ({
  dashboardContainer: {
    display: 'flex',
    background: '#f5f5f5',
  },
  headerContainer: {
    top: 0,
    left: 'auto',
    right: 0,
    display: 'flex',
    alignItems: 'stretch',
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sidebarContainer: {
    display: 'flex',
    alignItems: 'stretch',
    position: 'relative',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    width: theme.sidebar.width,
    flexShrink: 0,
    // [theme.breakpoints.up('md')]: {
    //   width: theme.sidebar.width,
    //   flexShrink: 0,
    // },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sidebarContainerMobile: {
    width: 0,
  },
  sidebarContainerCollapsed: {
    width: theme.sidebar.widthCollapsed,
  },
  drawer: {
    width: '100%',
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      width: theme.sidebar.width,
      flexShrink: 0,
    },
  },
  mainContainer: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    flexDirection: 'column',
    display: 'flex',
  },
  contentContainer: {
    display: 'flex',
    position: 'relative',
    flex: 1,
  },
  footerContainer: {
    position: 'relative',
  },
}))

let ps;

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
  const theme = useTheme()

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isMobile = !isDesktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown ");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)
  // const [isSidebarOpenDesktop, setIsSidebarOpenDesktop] = useState(true)
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
      localStorage.getItem('token') ?
          <div className={classes.wrapper}>
            <Sidebar
                routes={routes}
                logoText={"Creative Tim"}
                logo={logo}
                image={image}
                handleDrawerToggle={handleDrawerToggle}
                open={mobileOpen}
                color={color}
                {...rest}
            />
            <div
                className={clsx(
                    classes.sidebarContainer,
                    isMobile && classes.sidebarContainerMobile,
                    isDesktop && isSidebarCollapsed && classes.sidebarContainerCollapsed,
                )}>
              <Navbar
                  routes={routes}
                  handleDrawerToggle={handleDrawerToggle}
                  {...rest}
              />
              {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
              {getRoute() ? (
                  <div className={classes.content}>
                    <div className={classes.container}>{switchRoutes}</div>
                  </div>
              ) : (
                  <div className={classes.map}>{switchRoutes}</div>
              )}
              {getRoute() ? <Footer /> : null}
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
