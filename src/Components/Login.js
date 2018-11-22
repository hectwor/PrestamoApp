import React, { Component } from 'react';
import {Form,
    Row,
    Col,
    Input, FormFeedback, FormGroup,
    Button
    } from 'reactstrap';
import { ControlLabel, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import iconLogin from "../img/logo.png";
import MainRecogedor from "./MainRecogedor";
import MainAdmin from "./MainAdmin";
const axios = require('axios');

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModalLogin: false,
            loading: false,
            error: null,
            username: "",
            password: "",
            validate: {
                username: null,
                password: null
            },
            redirectVendedor: false,
            redirectAdmin: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    handleSubmit = event => {
        const { username, password, validate } = this.state;
        //consultar username, password
        //responder usernameBoolean, passwordBoolean, rol
        let usernameBoolean;
        let passwordBoolean;
        let id_rol;
        var self = this;
        axios.get('https://edutafur.com/sgp/public/login', {
            params: {
                username: username,
                password: password
            }
          })
          .then(function (response) {
            usernameBoolean = response.data[0].usuario;
            passwordBoolean = response.data[0].clave;
            id_rol = response.data[0].id_rol;
          })
          .catch(function (error) {
            console.log(error);
            usernameBoolean = "Error";
            passwordBoolean = "Error";
            id_rol = "0";
          })
          .then(function () {
            if(usernameBoolean === true){
                validate.username = "has-success";
                if(passwordBoolean === true){
                    validate.password = "has-success";
                    if(id_rol === "1" || id_rol === 1)
                        self.setState({ redirectAdmin: true });
                    if(id_rol === "2" || id_rol === 2)
                        self.setState({ redirectVendedor: true });
                }else{
                    validate.password = "has-danger";
                }
            }else{
                validate.username = "has-danger";
            }
            self.setState({
                validate
            });
          });
    };

    validateForm = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    };

    handleKeyPress = event => {
        if (event.key === "Enter") {
            this.handleSubmit();
        }
    };

    render() {
        const { username, password, redirectVendedor, redirectAdmin, validate } = this.state;
        const login = {
            backgroundColor: "#f1f1f1",
            borderRadius: "30px",
            marginTop: "80px"
        };
        const buttonSize = {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
            borderRadius: '8px'
        };
        if (redirectVendedor) {
            return (
                <MainRecogedor username={this.state.username} password={this.state.password} />
            );
        }
        if (redirectAdmin) {
            return (
                <MainAdmin username={this.state.username} password={this.state.password} />
            );
        }
        return (
            <div className="container">
                <header className="Logo text-left">
                </header>
                <div className="container" style={login}>
                    <Row form>
                        <Col md={4}>
                        </Col>
                        <Col md={4}>
                            <br/>
                            <div className="container">
                                <Image src={iconLogin} />
                            </div>
                            <Form>
                                <FormGroup>
                                    <div className="text-left">
                                        <ControlLabel>Usuario</ControlLabel>
                                        <Input
                                            name="username"
                                            id="usuarioInput"
                                            placeholder="Nombre de Usuario"
                                            value={username}
                                            valid={validate.username === "has-success"}
                                            invalid={validate.username === "has-danger"}
                                            onChange={this.handleChange}
                                            autoFocus
                                            onKeyPress={this.handleKeyPress}
                                        />
                                        <FormFeedback invalid>Usuario Incorrecto</FormFeedback>
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <div className="text-left">
                                        <ControlLabel>Contraseña</ControlLabel>
                                        <Input
                                            name="password"
                                            id="contraseñaInput"
                                            placeholder="***********"
                                            type="password"
                                            value={password}
                                            valid={validate.password === "has-success"}
                                            invalid={validate.password === "has-danger"}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress}
                                        />
                                        <FormFeedback invalid>Contraseña incorrecta</FormFeedback>
                                    </div>
                                </FormGroup>
                                <Button
                                    block
                                    size="lg"
                                    disabled={!this.validateForm()}
                                    onClick={this.handleSubmit}
                                    style={buttonSize}
                                    color="primary"
                                >
                                    Ingresar
                                </Button>
                                <br/><br/><br/>
                            </Form>
                        </Col>
                        <Col md={4}>

                        </Col>
                    </Row>
                </div>
            </div>

        );
    }
}

export default Login;
