/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {makeStyles} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Sidebar(props) {
    const classes = useStyles();

    // verifies if routeName is the one active (in browser input)
    function activeRoute(routeName) {
        return window.location.href.indexOf(routeName) > -1 ? true : false;
    }
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const { color, logo, image, logoText, routes } = props;
    var links = (
        <List className={classes.list}>
            {routes.map((prop, key) => {
                var activePro = " ";
                var listItemClasses;
                if (prop.path === "/upgrade-to-pro") {
                    activePro = classes.activePro + " ";
                    listItemClasses = classNames({
                        [" " + classes[color]]: true
                    });
                } else {
                    listItemClasses = classNames({
                        [" " + classes[color]]: activeRoute(prop.layout + prop.path)
                    });
                }
                const whiteFontClasses = classNames({
                    [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
                });
                return (
                    <NavLink
                        to={prop.layout + prop.path}
                        className={activePro + classes.item}
                        activeClassName="active"
                        key={key}
                    >
                        <ListItem button className={classes.itemLink + listItemClasses}>
                            {typeof prop.icon === "string" ? (
                                <Icon
                                    className={classNames(classes.itemIcon, whiteFontClasses, {
                                        [classes.itemIconRTL]: props.rtlActive
                                    })}
                                >
                                    {prop.icon}
                                </Icon>
                            ) : (
                                <prop.icon
                                    className={classNames(classes.itemIcon, whiteFontClasses, {
                                        [classes.itemIconRTL]: props.rtlActive
                                    })}
                                />
                            )}
                            <ListItemText
                                primary={props.rtlActive ? prop.rtlName : prop.name}
                                className={classNames(classes.itemText, whiteFontClasses, {
                                    [classes.itemTextRTL]: props.rtlActive
                                })}
                                disableTypography={true}
                            />
                        </ListItem>
                    </NavLink>
                );
            })}
        </List>
    );
    var brand = (
        <div className={classes.logo}>
            <a
                className={classNames(classes.logoLink, {
                    [classes.logoLinkRTL]: props.rtlActive
                })}
                target="_blank"
            >
                <div className={classes.logoImage}>
                    <img src={logo} alt="logo" className={classes.img} />
                </div>
                {logoText}
            </a>
        </div>
    );
    return (
        <div>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Dashboard
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Hidden mdUp implementation="css">
                <Drawer
                    anchor={props.rtlActive ? "left" : "right"}
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                    // classes={{
                    //     paper: classNames(classes.drawerPaper, {
                    //         [classes.drawerPaperRTL]: props.rtlActive
                    //     })
                    // }}
                    onClose={props.handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                >
                    {brand}
                    <div className={classes.sidebarWrapper}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Divider />
                        {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
                        {links}
                    </div>
                    {image !== undefined ? (
                        <div
                            className={classes.background}
                            style={{ backgroundImage: "url(" + image + ")" }}
                        />
                    ) : null}
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    anchor={props.rtlActive ? "right" : "left"}
                    variant="permanent"
                    open
                    classes={{
                        paper: classNames(classes.drawerPaper, {
                            [classes.drawerPaperRTL]: props.rtlActive
                        })
                    }}
                >
                    {brand}
                    <div className={classes.sidebarWrapper}>{links}</div>
                    {image !== undefined ? (
                        <div
                            className={classes.background}
                            style={{ backgroundImage: "url(" + image + ")" }}
                        />
                    ) : null}
                </Drawer>
            </Hidden>
        </div>
    );
}

Sidebar.propTypes = {
    rtlActive: PropTypes.bool,
    handleDrawerToggle: PropTypes.func,
    bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
    logo: PropTypes.string,
    image: PropTypes.string,
    logoText: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    open: PropTypes.bool
};
