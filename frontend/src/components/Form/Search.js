import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import FormHelperText from '@material-ui/core/FormHelperText';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from '@material-ui/core/TextField';
import SnackbarContent from "../Snackbar/SnackbarContent";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
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
});

class SearchForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            countries: [],
            filter: {
                limit: "",
                count_tags: "",
                sales: "",
                year_store_base: "",
                countries: [],
            },
            helper: {
                countries: []
            },
            errors: {},
            alert: {},
        }
    }

    componentDidMount() {
        let response;
        fetch(process.env.REACT_APP_BASE_URL + 'api/filter/', {
            method : 'GET',
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                response = res
                return res.json();
            })
            .then(res => {
                if (! response.ok ) {
                    switch (response.status) {
                        case 401:
                            localStorage.removeItem('token')
                            this.props.history.push('/login')
                            break;
                        default:
                            break;
                    }
                } else {
                    this.setState({ countries : res.countries })
                    this.setState({
                        filter: res.filter
                    });
                    this.setState({
                        helper: res.filter
                    });
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ alert: {message: "Server has error.", type: "danger"} });
            });
        this.setState({alert: {} });
    }

    handleSearch = (e, data) => {
        e.preventDefault();

        data.filter = Object.fromEntries(
            Object.entries(this.state.filter).map(
                ([key, value]) => [key, value ? value : this.state.helper[key]]
            )
        );
        if (!data.filter.countries.length) {
            data.filter.countries = this.state.helper.countries
        }

        let response;

        fetch(process.env.REACT_APP_BASE_URL + 'api/items/', {
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
            .then(res => {
                response = res
                return res.json();
            })
            .then(json => {
                    if (! response.ok ) {
                        switch (response.status) {
                            case 401:
                                localStorage.removeItem('token')
                                this.props.history.push('/login')
                                break;
                            case 400:
                                this.setState({errors: json });
                                break;
                            default:
                                break;
                        }
                    } else {
                        this.props.setRequests(json)
                        this.setState({ alert: {message: "You created new request.", type: "success"} });
                    }
                }
            )
            .catch(error => {
                console.log(error)
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

    handleFilterChange = (e) => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.name]: e.target.value
            }
        });
    }

    render() {
        const { classes } = this.props;

        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;

        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };

        const alert = (
            <SnackbarContent
                message={this.state.alert.message ? this.state.alert.message : ""}
                color={this.state.alert.type}
                close
            />
        );
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <form className={classes.form}
                                  onSubmit={e => this.handleSearch(e, {
                                      search : this.state.search,
                                      filter: this.state.filter
                                  })}>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>Search form</h4>
                                    <p className={classes.cardCategoryWhite}>runner scraper</p>
                                </CardHeader>
                                <CardBody>
                                    { this.state.alert.type ? alert : null }

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="search"
                                        label="Search phrase"
                                        name="search"
                                        value={ this.state.search }
                                        helperText={ this.state.errors.search ? this.state.errors.search : null }
                                        error={ !!this.state.errors.search }
                                        onChange={ this.handleChange }
                                        autoFocus
                                    />
                                    <GridContainer>
                                        <GridItem xs={12} sm={5} md={2}>
                                            <TextField
                                                margin="normal"
                                                id="limit"
                                                label="Limit of items"
                                                name="limit"
                                                value={ this.state.filter.limit }
                                                helperText={ this.state.errors.filter && this.state.errors.filter.limit ? this.state.errors.filter.limit : null }
                                                error={ this.state.errors.filter && !!this.state.errors.filter.limit }
                                                onChange={ this.handleFilterChange }
                                            />
                                            <FormHelperText>Default : { this.state.helper.limit }</FormHelperText>
                                        </GridItem>
                                        <GridItem xs={12} sm={5} md={2}>
                                            <TextField
                                                margin="normal"
                                                id="count_tags"
                                                label="Count of tags"
                                                name="count_tags"
                                                value={ this.state.filter.count_tags }
                                                helperText={ this.state.errors.filter && this.state.errors.filter.count_tags ? this.state.errors.filter.count_tags : null }
                                                error={ this.state.errors.filter && !!this.state.errors.filter.count_tags }
                                                onChange={ this.handleFilterChange }
                                            />
                                            <FormHelperText>Default : { this.state.helper.count_tags }</FormHelperText>
                                        </GridItem>
                                        <GridItem xs={12} sm={5} md={2}>
                                            <TextField
                                                margin="normal"
                                                id="sales"
                                                label="Count of sales"
                                                name="sales"
                                                value={ this.state.filter.sales }
                                                helperText={ this.state.errors.filter && this.state.errors.filter.sales ? this.state.errors.filter.sales : null }
                                                error={ this.state.errors.filter && !!this.state.errors.filter.sales }
                                                onChange={ this.handleFilterChange }
                                            />
                                            <FormHelperText>Default : { this.state.helper.sales }</FormHelperText>
                                        </GridItem>
                                        <GridItem xs={12} sm={5} md={2}>
                                            <TextField
                                                margin="normal"
                                                id="year_store_base"
                                                label="Year store base"
                                                name="year_store_base"
                                                value={ this.state.filter.year_store_base }
                                                helperText={ this.state.errors.filter && this.state.errors.filter.year_store_base ? this.state.errors.filter.year_store_base : null}
                                                error={ this.state.errors.filter && !!this.state.errors.filter.year_store_base }
                                                onChange={ this.handleFilterChange }
                                            />
                                            <FormHelperText>Default : { this.state.helper.year_store_base }</FormHelperText>
                                        </GridItem>
                                        <FormControl
                                            margin="normal"
                                            className={classes.formControl}>
                                            <InputLabel id="mutiple-countries-label">Countries</InputLabel>
                                            <Select
                                                labelId="mutiple-countries-label"
                                                id="mutiple-countries"
                                                error={ this.state.errors.filter && !!this.state.errors.filter.countries }
                                                multiple
                                                name="countries"
                                                value={this.state.filter.countries}
                                                onChange={this.handleFilterChange}
                                                input={<Input />}
                                                renderValue={(selected) => selected.join(', ')}
                                                MenuProps={MenuProps}
                                            >
                                                {this.state.countries.map((country) => (
                                                    <MenuItem key={country.code} value={country.name}>
                                                        <Checkbox checked={
                                                            this.state.filter.countries.indexOf(country.name) > -1}
                                                        />
                                                        <ListItemText primary={country.name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{this.state.errors.filter && this.state.errors.filter.countries ? this.state.errors.filter.countries : null}</FormHelperText>
                                            <FormHelperText>Default : {this.state.helper.countries.join(', ')}</FormHelperText>
                                        </FormControl>
                                    </GridContainer>
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
