import React, {Component} from "react";
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.4.0";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import SnackbarContent from "../components/Snackbar/SnackbarContent";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameFocus: false,
      passwordFocus: false,
      username: "",
      password: "",
      errors: {},
      alert: {},
    }
    if (localStorage.getItem('token')) {
      this.props.history.push('/')
    }
  }

  componentDidMount() {
    document.body.classList.add("login-page");
  }

  setUserNameFocus = (e, state) => {
    this.setState({
      userNameFocus : state
    })
  }

  setPasswordFocus = (e, state) => {
    this.setState({
      passwordFocus : state
    })
  }

  handleLogin = (e, data) => {
    e.preventDefault();
    let response;

    fetch(process.env.REACT_APP_BASE_URL + 'api/token/', {
      crossDomain : true,
      withCredentials : true,
      async : true,
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
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
                    this.setState({ alert: {message: json.detail, type: "warning"} });
                    break;
                  case 400:
                    this.setState({errors: json });
                    break;
                  default:
                    break;
                }
              } else {
                localStorage.setItem('token', json.access)
                this.props.history.push('/')
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

  render() {
    const alert = (
        <SnackbarContent
            message={this.state.alert.message ? this.state.alert.message : ""}
            color={this.state.alert.type}
            close
        />
    );

    return (
        <>
        <div className="page-header clear-filter" filter-color="blue">
          <div className="page-header-image" style={{
            backgroundImage: "url(" + require("assets/img/login.jpg") + ")",
          }}
          ></div>
          <div className="content">
            <Container>
              <Col className="ml-auto mr-auto" md="4">
                <Card className="card-login card-plain">
                  <Form className="form" onSubmit={e => this.handleLogin(e, {
                    username : this.state.username,
                    password : this.state.password,
                  })}>
                  <CardHeader className="text-center">
                    <div className="logo-container">
                      <img alt="..." src={require("assets/img/now-logo.png")}/>
                    </div>
                  </CardHeader>
                  <CardBody>
                    { this.state.alert.type ? alert : null }

                    <InputGroup
                        className={
                          "no-border input-lg" +
                          (this.state.userNameFocus ? " input-group-focus" : "")
                        }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          placeholder="Username"
                          type="text"
                          name="username"
                          invalid={ !!this.state.errors.username }
                          onFocus={e => this.setUserNameFocus(e,true)}
                          onChange={ this.handleChange }
                          onBlur={e => this.setUserNameFocus(e,false)}
                          autoFocus
                      />
                    </InputGroup>
                    <InputGroup
                        className={
                          "no-border input-lg" +
                          (this.state.passwordFocus ? " input-group-focus" : "")
                        }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons text_caps-small"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          placeholder="Password"
                          type="password"
                          name="password"
                          invalid={ !!this.state.errors.password }
                          onChange={ this.handleChange }
                          onFocus={e => this.setPasswordFocus(e,true)}
                          onBlur={e => this.setPasswordFocus(e,false)}
                      />
                    </InputGroup>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                        block
                        className="btn-round"
                        color="info"
                        size="lg"
                    >
                      Login
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
        </div>
  </>
  );
  }
}

export default Login;
