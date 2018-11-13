import React, { Component } from 'react';
import {Form,
    Row,
    Col,
    Input, FormFeedback, FormGroup
    } from 'reactstrap';
import { Button, ControlLabel, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import iconLogin from "../img/loginUser.png";
import Mainvendedor from "./mainVendedor";
import mainadmin from "./mainAdmin";

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
        //responder su nivel
        const nivel = 2;

        if(nivel === 2){
            if(username === "12"){
                validate.username = "has-success";
                if(password === "12"){
                    validate.password = "has-success";
                    this.setState({ redirectVendedor: true });
                }else{
                    validate.password = "has-danger";
                }
            }else{
                validate.username = "has-danger";
            }
        }
        this.setState({
            validate
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
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectVendedor) {
            return (
                <Mainvendedor username={this.state.username} password={this.state.password} />
            );
        }
        if (redirectAdmin) {
            return (
                <mainadmin username={this.state.username} password={this.state.password} />
            );
        }
        return (
            <div className="container">
                <header className="Logo text-left">
                    <br />
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
                            <br/>
                            <Form>
                                <FormGroup>
                                    <div className="text-left">
                                        <ControlLabel>Usuario</ControlLabel>
                                        <Input
                                            name="username"
                                            id="usuarioInput"
                                            placeholder="Nombre de Usuario"
                                            value={username}
                                            invalid={validate.username === "has-danger"}
                                            valid={validate.username === "has-success"}
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
                                            invalid={validate.password === "has-danger"}
                                            valid={validate.username === "has-success"}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress}
                                        />
                                        <FormFeedback invalid>Contraseña incorrecta</FormFeedback>
                                    </div>
                                </FormGroup>
                                <Button
                                    block
                                    bsSize="large"
                                    disabled={!this.validateForm()}
                                    onClick={this.handleSubmit}
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
