import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label,
    FormFeedback, FormGroup
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
const axios = require('axios');

class ModificarTrabajador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectLogin:false,
            redirectMainAdmin:false,

            nombresCompletos:"",
            apellidoPaterno:"",
            apellidoMaterno:"",
            dniPasaporte:"",
            telefono:"",
            validate:{
                nombresCompletos:null,
                apellidoPaterno:null,
                apellidoMaterno:null,
                dniPasaporte:null,
                telefono:null
            }
        }
    }
    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };
    handleCheck = event => {
        let change = {};
        change[event.target.name] = event.target.checked;
        this.setState(change)
    };

    regresarMenu = ()=>{
        this.setState({
            redirectMainAdmin: true,
        });
    };
    render(){
        const { redirectLogin, redirectMainAdmin, validate,
            apellidoPaterno, apellidoMaterno, nombresCompletos, dniPasaporte, telefono
        } = this.state;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador}   username={this.props.username} password={this.props.password} />
            );
        }
        return(
            <div className="container-fluid">
                <br />
                <Navbar  color="light" light expand="md">
                    <NavbarBrand >Bienvenido {this.props.username}</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink onClick={this.Logout} style={{ cursor: "pointer" }}>Salir</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container">
                    <div className="container text-center" style={panelAdmin}>
                        <br/>
                        <h1 className="display-6">Modificación de Trabajador</h1>
                        <br />
                        <Row>
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Apellido Paterno</Label>
                                                <Input
                                                    name="apellidoPaterno"
                                                    id="apellidoPaternoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidoPaterno}
                                                    invalid={validate.apellidoPaterno === "has-danger"}
                                                    valid={validate.apellidoPaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Apellido Materno</Label>
                                                <Input
                                                    name="apellidoMaterno"
                                                    id="apellidoMaternoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidoMaterno}
                                                    invalid={validate.apellidoMaterno === "has-danger"}
                                                    valid={validate.apellidoMaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Nombres</Label>
                                                <Input
                                                    name="nombresCompletos"
                                                    id="nombresCompletosInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nombresCompletos}
                                                    invalid={validate.nombresCompletos === "has-danger"}
                                                    valid={validate.nombresCompletos === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>DNI / Pasaporte</Label>
                                                <Input
                                                    name="dniPasaporte"
                                                    id="dniPasaporteInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={dniPasaporte}
                                                    invalid={validate.dniPasaporte === "has-danger"}
                                                    valid={validate.dniPasaporte === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Teléfono</Label>
                                                <Input
                                                    name="telefono"
                                                    id="telefonoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefono}
                                                    invalid={validate.apellidoMaterno === "has-danger"}
                                                    valid={validate.apellidoMaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Fecha de Nacimiento</Label>
                                                <Input
                                                    name="nombresCompletos"
                                                    id="nombresCompletosInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nombresCompletos}
                                                    invalid={validate.nombresCompletos === "has-danger"}
                                                    valid={validate.nombresCompletos === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button
                                    block
                                    onClick={this.registrarUsuario}
                                    color="success"
                                >
                                    ACTUALIZAR
                                </Button>
                                < br />
                                <Button
                                    block
                                    color="danger"
                                    onClick={this.regresarMenu}
                                >
                                    Regresar
                                </Button>
                                <br />
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModificarTrabajador;