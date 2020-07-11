import React, {Component} from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from '@material-ui/core/TextField';
import {base_url, bugs, server, website, access } from "variables/general.js";
import SnackbarContent from "../Snackbar/SnackbarContent";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

const useStyles = makeStyles(styles);

class SearchForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            errors: {},
            alert: {},
        }

        this.response = ""
    }
    handleLogin = (e, data) => {
        e.preventDefault();
        localStorage.setItem('token', access);

        fetch(base_url + 'api/items/', {
            crossDomain : true,
            withCredentials : true,
            async : true,
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type' : 'application/json',
            },
            method : 'POST',
            body : JSON.stringify(data)
        })
            .then(response => {
                this.response = response
                return response.json();
            })
            .then(json => {
                    if (! this.response.ok ) {
                        switch (this.response.status) {
                            case 400:
                                this.setState({errors: json });
                                break;
                        }
                    } else {
                        this.setState({ alert: {message: "You created new request.", type: "success"} });
                    }
                }
            )
            .catch(error => {
                this.setState({ alert: {message: "Server has error.", type: "danger"} });
            })
        this.setState({errors: {} });
        this.setState({alert: {} });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render() {
        const { classes } = this.props;

        const alert = (
            <SnackbarContent
                message={this.state.alert.message ? this.state.alert.message : ""}
                color={this.state.alert.type}
            />
        );
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <form className={classes.form} noValidate
                                  onSubmit={e => this.handleLogin(e, {
                                      search : this.state.search,
                                  })}>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Search form</h4>
                                    <p className={classes.cardCategoryWhite}>runner scraper</p>
                                </CardHeader>
                                <CardBody>
                                    { this.state.alert.type ? alert : null }

                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="search"
                                        label="Search phrase"
                                        name="search"
                                        value={ this.state.search }
                                        autoComplete="search"
                                        helperText={ this.state.errors.search ? this.state.errors.search : null }
                                        error={ !!this.state.errors.search }
                                        onChange={ this.handleChange }
                                        autoFocus
                                    />
                                </CardBody>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Run
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(SearchForm);
