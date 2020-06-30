import React, {Component} from 'react'
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    CssBaseline,
    Typography,
    Container
}  from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

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
            password : ''
        }
    }
    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    render() {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate
                          onSubmit={e => this.props.handleLogin(e, {
                              username : this.props.username,
                              password : this.state.password
                          })}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
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
            //     <div>
            //         <form onSubmit={e => this.props.handleLogin(e, {
            //             username : this.props.username,
            //             password : this.state.password
            //         })} >
            //             <Row>
            //                 <label htmlFor="username" >Username</label>
            //                 <input type="text"
            //                 onChange={this.props.handleLoginChange}
            //                 value={this.props.username}
            //                 name="username"
            //                 id="username"
            //                 placeholder="Username" />
            //             </Row>
            //             <Row>
            //                 <label htmlFor="password" >Password</label>
            //                 <input type="password"
            //                 onChange={this.handlePasswordChange}
            //                 value={this.state.password}
            //                 name="password"
            //                 id="password"
            //                 placeholder="Password" />
            //             </Row>
            //             <button type='submit'>Login</button>
            //         </form>
            //     </div>
        )
    }
}

// export default LoginUser
export default withStyles(styles, { withTheme: true })(LoginUser);
