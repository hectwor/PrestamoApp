import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input, FormFeedback, FormGroup,
    Label,
    Row, Col
} from 'reactstrap';
import {Button, ControlLabel} from "react-bootstrap";
import Login from "./Login";
import MainVendedor from "./MainRecogedor";
import MainAdmin from "./MainAdmin";
const axios = require('axios');
class NuevoCliente extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin: false,
            redirectMainPrestamista: false,
            redirectMainAdmin: false,

            apellidoPaterno: "",
            apellidoMaterno:"",
            nombres:"",
            dniPasaporte:"",
            telefono:"",
            telefonoReferencia:"",
            direccionDomicilio:"",
            direccionTrabajo:"",
            validate: {
                apellidoPaterno: null,
                apellidoMaterno:null,
                nombres:null,
                dniPasaporte:null,
                telefono:null,
                telefonoReferencia:null,
                direccionDomicilio:null,
                direccionTrabajo:null
            },
        }
    }

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    regresarMenu = ()=>{
        if(this.props.rol === "admin"){
            this.setState({
                redirectMainAdmin: true,
            });
        }
        if(this.props.rol === "prestamista"){
            this.setState({
                redirectMainPrestamista: true,
            });
        }
    };

    checkboxHandler = () => {

    };

    registrarCliente = ()=>{
        const contVal = this.validar();
        const { apellidoPaterno, apellidoMaterno, nombres, dniPasaporte, telefono, direccionDomicilio, telefonoReferencia, direccionTrabajo } = this.state;
        const { rol } = this.props;
        var self = this;
        if(contVal === 0){
            axios.post('https://edutafur.com/sgp/public/clientes/agregar', {
                nombre: nombres,
                apePat: apellidoPaterno,
                apeMat: apellidoMaterno,
                telefonoPersonal: telefono,
                telefonoReferencia:telefonoReferencia,
                direccion:direccionDomicilio,
                direccionTrabajo:direccionTrabajo,
                nroDoc:dniPasaporte
              })
              .then(function (response) {
                  if(response.status === 200){
                    alert("Nuevo cliente Registrado");
                    if(rol === "admin"){
                        self.setState({
                            redirectMainAdmin: true,
                        });
                    }
                    if(rol === "prestamista"){
                        self.setState({
                            redirectMainPrestamista: true,
                        });
                    }
                  }
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    };

    validar = () => {
        const {validate, apellidoPaterno, apellidoMaterno, nombres, dniPasaporte, telefono, direccionDomicilio, telefonoReferencia, direccionTrabajo } = this.state;
        let contVal = 0;
        if(apellidoPaterno==="" || apellidoPaterno === null){
            validate.apellidoPaterno = "has-danger";
            contVal++;
        }else
            validate.apellidoPaterno = "has-success";
        if(apellidoMaterno==="" || apellidoMaterno === null){
            validate.apellidoMaterno = "has-danger";
            contVal++;
        }else
            validate.apellidoMaterno = "has-success";
        if(nombres==="" || nombres === null){
            validate.nombres = "has-danger";
            contVal++;
        }else
            validate.nombres = "has-success";
        if(dniPasaporte==="" || dniPasaporte === null){
            validate.dniPasaporte = "has-danger";
            contVal++;
        }else
            validate.dniPasaporte = "has-success";
        if(telefono==="" || telefono === null){
            validate.telefono = "has-danger";
            contVal++;
        }else
            validate.telefono = "has-success";
        if(direccionDomicilio==="" || direccionDomicilio === null){
            validate.direccionDomicilio = "has-danger";
            contVal++;
        }else
            validate.direccionDomicilio = "has-success";
        if(telefonoReferencia==="" || telefonoReferencia === null){
            validate.telefonoReferencia = "has-danger";
            contVal++;
        }else
            validate.telefonoReferencia = "has-success";
        if(direccionTrabajo==="" || direccionTrabajo === null){
            validate.direccionTrabajo = "has-danger";
            contVal++;
        }else
            validate.direccionTrabajo = "has-success";
        this.setState({
            validate:validate
        });
        return contVal;
    };

    render() {
        const { redirectLogin, redirectMainPrestamista, redirectMainAdmin, apellidoPaterno, apellidoMaterno, nombres, dniPasaporte, telefono,telefonoReferencia, direccionDomicilio, direccionTrabajo, validate } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "70px"
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectMainPrestamista) {
            return (
                <MainVendedor id_trabajador={this.props.id_trabajador}  username={this.props.username} />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador}  username={this.props.username} />
            );
        }
        return (
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
                    <div className="container text-center" style={panelVendedor}>
                        <h1 className="display-4">Nuevo Cliente</h1>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Apellido Paterno</ControlLabel>
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
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Apellido Materno</ControlLabel>
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
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Nombres</ControlLabel>
                                                <Input
                                                    name="nombres"
                                                    id="nombresInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nombres}
                                                    invalid={validate.nombres === "has-danger"}
                                                    valid={validate.nombres === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    value="option1"
                                                                    name="checkRadio"
                                                                    checked={true}
                                                                    onChange={ this.checkboxHandler }
                                                                />{' '}
                                                                DNI
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" value="option2" name="checkRadio" />{' '}
                                                                Pasaporte
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <h1> </h1>
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
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Teléfono</ControlLabel>
                                                <Input
                                                    name="telefono"
                                                    id="telefonoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefono}
                                                    invalid={validate.telefono === "has-danger"}
                                                    valid={validate.telefono === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={8}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Dirección domicilio</ControlLabel>
                                                <Input
                                                    name="direccionDomicilio"
                                                    id="direccionDomicilioInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={direccionDomicilio}
                                                    invalid={validate.direccionDomicilio === "has-danger"}
                                                    valid={validate.direccionDomicilio === "has-success"}
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
                                                <ControlLabel>Teléfono Referencia</ControlLabel>
                                                <Input
                                                    name="telefonoReferencia"
                                                    id="telefonoReferenciaInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefonoReferencia}
                                                    invalid={validate.telefonoReferencia === "has-danger"}
                                                    valid={validate.telefonoReferencia === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={8}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Dirección trabajo</ControlLabel>
                                                <Input
                                                    name="direccionTrabajo"
                                                    id="direccionTrabajoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={direccionTrabajo}
                                                    invalid={validate.direccionTrabajo === "has-danger"}
                                                    valid={validate.direccionTrabajo === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button
                                    block
                                    bsSize="large"
                                    onClick={this.registrarCliente}
                                    bsStyle="success"
                                >
                                    REGISTRAR
                                </Button>
                                < br/>
                                <Button
                                    block
                                    bsSize="large"
                                    bsStyle="danger"
                                    onClick={this.regresarMenu}
                                >
                                    Regresar
                                </Button>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>

                        < br/>
                    </div>
                </div>
                < br/>
            </div>
        )
    }
}

export default NuevoCliente;