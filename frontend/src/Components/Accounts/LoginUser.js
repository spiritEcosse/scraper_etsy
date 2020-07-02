import React, {Component} from 'react'
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    CssBaseline,
    Typography,
    Container
}  from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Alert} from "@material-ui/lab";

const base_url = "http://127.0.0.1:8003/";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            username: '',
            errors: "",
            alert: "",
        }

        this.response = ""
    }
    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    handleUsernameChange = (e) => {
        this.setState({
            username : e.target.value
        })
    }

    handleLogin = (e, data) => {
        e.preventDefault();
        fetch(base_url + 'api/token/', {
            crossDomain : true,
            withCredentials : true,
            async : true,
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })
            .then(response => {
                this.response = response
                return response.json();
            })
            .then(json => {
                    this.setState({errors: "" });
                    if (! this.response.ok ) {
                        switch (this.response.status) {
                            case 401:
                                this.setState({ alert: json.detail });
                                break;
                            case 400:
                                this.setState({errors: json });
                                break;
                        }
                    } else {
                        localStorage.setItem('token', json.token);
                        this.setState({
                            logged_in : true,
                            // username : json_.user.username
                        })
                    }
                }
            )
            .catch(error => {
                console.log(error)
            })
        this.setState({
            displayed_form : ''
        })
    }
    resolved(result) {
        return result;
    }
    rejected(result) {
        this.setState( { errors : result} );
    }
    render() {
        const { classes } = this.props;

        const alert = (
            <Alert variant="filled" onClose={() => {  }} severity="warning">
                { this.state.alert }
            </Alert>
        );

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                    { alert }
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate
                          onSubmit={e => this.handleLogin(e, {
                              username : this.state.username,
                              password : this.state.password
                          })}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={this.props.username}
                            helperText={this.state.errors.username ? this.state.errors.username : ""}
                            error={!!this.state.errors.username}
                            onChange={this.handleUsernameChange}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            onChange={this.handlePasswordChange}
                            value={this.props.password}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            helperText={this.state.errors.password ? this.state.errors.password : ""}
                            error={!!this.state.errors.password}
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </Container>
        )
    }
}

// export default LoginUser
export default withStyles(styles, { withTheme: true })(LoginUser);
