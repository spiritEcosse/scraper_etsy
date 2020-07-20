import React, {Component} from "react";
import classNames from "classnames";
import {withStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";


class AdminNavbarLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openNotification: null,
            openProfile: null,
        }
    }

    logout = () => {
        localStorage.removeItem('token')
        this.props.history.push('/login')
    }

    handleClickNotification = event => {
        if (this.state.openNotification && this.state.openNotification.contains(event.target)) {
            this.setState( { openNotification: null });
        } else {
            this.setState( { openNotification: event.currentTarget });
        }
    }

    handleCloseNotification = () => {
        this.setState( { openNotification: null });
    }

    handleClickProfile = event => {
        if (this.state.openProfile && this.state.openProfile.contains(event.target)) {
            this.setState( { openProfile: null });
        } else {
            this.setState( { openProfile: event.currentTarget });
        }
    }

    handleCloseProfile = () => {
        this.setState( { openProfile: null });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <div className={classes.searchWrapper}>
                    <CustomInput
                        formControlProps={{
                            className: classes.margin + " " + classes.search
                        }}
                        inputProps={{
                            placeholder: "Search",
                            inputProps: {
                                "aria-label": "Search"
                            }
                        }}
                    />
                    <Button color="white" aria-label="edit" justIcon round>
                        <Search/>
                    </Button>
                </div>
                <Button
                    color={window.innerWidth > 959 ? "transparent" : "white"}
                    justIcon={window.innerWidth > 959}
                    simple={!(window.innerWidth > 959)}
                    aria-label="Dashboard"
                    className={classes.buttonLink}
                >
                    <Dashboard className={classes.icons}/>
                    <Hidden mdUp implementation="css">
                        <p className={classes.linkText}>Dashboard</p>
                    </Hidden>
                </Button>
                <div className={classes.manager}>
                    <Button
                        color={window.innerWidth > 959 ? "transparent" : "white"}
                        justIcon={window.innerWidth > 959}
                        simple={!(window.innerWidth > 959)}
                        aria-owns={this.state.openNotification ? "notification-menu-list-grow" : null}
                        aria-haspopup="true"
                        onClick={this.handleClickNotification}
                        className={classes.buttonLink}
                    >
                        <Notifications className={classes.icons}/>
                        <span className={classes.notifications}>5</span>
                        <Hidden mdUp implementation="css">
                            <p onClick={this.handleCloseNotification} className={classes.linkText}>
                                Notification
                            </p>
                        </Hidden>
                    </Button>
                    <Poppers
                        open={Boolean(this.openNotification)}
                        anchorEl={this.state.openNotification}
                        transition
                        disablePortal
                        className={
                            classNames({[classes.popperClose]: !this.state.openNotification}) +
                            " " +
                            classes.popperNav
                        }
                    >
                        {({TransitionProps, placement}) => (
                            <Grow
                                {...TransitionProps}
                                id="notification-menu-list-grow"
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom"
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={this.handleCloseNotification}>
                                        <MenuList role="menu">
                                            <MenuItem
                                                onClick={this.handleCloseNotification}
                                                className={classes.dropdownItem}
                                            >
                                                Mike John responded to your email
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleCloseNotification}
                                                className={classes.dropdownItem}
                                            >
                                                You have 5 new tasks
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleCloseNotification}
                                                className={classes.dropdownItem}
                                            >
                                                You{"'"}re now friend with Andrew
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleCloseNotification}
                                                className={classes.dropdownItem}
                                            >
                                                Another Notification
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleCloseNotification}
                                                className={classes.dropdownItem}
                                            >
                                                Another One
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Poppers>
                </div>
                <div className={classes.manager}>
                    <Button
                        color={window.innerWidth > 959 ? "transparent" : "white"}
                        justIcon={window.innerWidth > 959}
                        simple={!(window.innerWidth > 959)}
                        aria-owns={this.state.openProfile ? "profile-menu-list-grow" : null}
                        aria-haspopup="true"
                        onClick={this.handleClickProfile}
                        className={classes.buttonLink}
                    >
                        <Person className={classes.icons}/>
                        <Hidden mdUp implementation="css">
                            <p className={classes.linkText}>Profile</p>
                        </Hidden>
                    </Button>
                    <Poppers
                        open={Boolean(this.state.openProfile)}
                        anchorEl={this.state.openProfile}
                        transition
                        disablePortal
                        className={
                            classNames({[classes.popperClose]: !this.state.openProfile}) +
                            " " +
                            classes.popperNav
                        }
                    >
                        {({TransitionProps, placement}) => (
                            <Grow
                                {...TransitionProps}
                                id="profile-menu-list-grow"
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom"
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={this.handleCloseProfile}>
                                        <MenuList role="menu">
                                            <MenuItem
                                                onClick={this.handleCloseProfile}
                                                className={classes.dropdownItem}
                                            >
                                                Profile
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleCloseProfile}
                                                className={classes.dropdownItem}
                                            >
                                                Settings
                                            </MenuItem>
                                            <Divider light/>
                                            <MenuItem
                                                onClick={this.logout}
                                                className={classes.dropdownItem}
                                            >
                                                Logout
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Poppers>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AdminNavbarLinks);
