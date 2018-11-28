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

class CrearUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMainAdmin:false,

            selectRol:2,
            check:true,
            apellidosCompletos:"",
            nombreCompletos:"",
            telefono:"",
            nroDoc:"",
            nuevoNombreUsuario:"",
            nuevaContrasena:"",

            validate: {
                nombreCompletos:null,
                apellidosCompletos:null,
                nuevoNombreUsuario:null,
                nuevaContrasena:null,
                nroDoc:null,
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
    registrarUsuario = () => {
        const contVal = this.validar();
        let self = this;
        const { apellidosCompletos, nombreCompletos, nuevoNombreUsuario, nuevaContrasena, selectRol, check, telefono, nroDoc } = this.state;
        if(contVal === 0){
            let checkI;
            if(check === true)
                checkI = 1;
            else
                checkI = 0;
            axios.post('https://edutafur.com/sgp/public/usuario/agregar', {
                nombre: nombreCompletos,
                apePat: apellidosCompletos,
                usuario:nuevoNombreUsuario,
                telefono:telefono,
                nroDoc:nroDoc,
                clave:nuevaContrasena,
                estado:checkI,
                idRol: selectRol
            }).then(function (response) {
                if(response.status === 200){
                    alert("Nuevo Usuario Registrado");
                    self.setState({
                        redirectMainAdmin: true,
                    });
                }
            })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    validar = () => {
        const {validate, apellidosCompletos, nombreCompletos, nuevoNombreUsuario, nuevaContrasena, telefono, nroDoc } = this.state;
        let contVal = 0;
        if(apellidosCompletos==="" || apellidosCompletos === null){
            validate.apellidosCompletos = "has-danger";
            contVal++;
        }else
            validate.apellidosCompletos = "has-success";
        if(nombreCompletos==="" || nombreCompletos === null){
            validate.nombreCompletos = "has-danger";
            contVal++;
        }else
            validate.nombreCompletos = "has-success";
        if(telefono==="" || telefono === null){
            validate.telefono = "has-danger";
            contVal++;
        }else
            validate.telefono = "has-success";
        if(nroDoc==="" || nroDoc === null){
            validate.nroDoc = "has-danger";
            contVal++;
        }else
            validate.nroDoc = "has-success";
        if(nuevoNombreUsuario==="" || nuevoNombreUsuario === null){
            validate.nuevoNombreUsuario = "has-danger";
            contVal++;
        }else
            validate.nuevoNombreUsuario = "has-success";
        if(nuevaContrasena==="" || nuevaContrasena === null){
            validate.nuevaContrasena = "has-danger";
            contVal++;
        }else
            validate.nuevaContrasena = "has-success";
        this.setState({
            validate:validate
        });
        return contVal;
    };

    render(){
        const { redirectLogin, redirectMainAdmin, validate, apellidosCompletos, nombreCompletos, telefono, nroDoc,
            nuevoNombreUsuario, nuevaContrasena, selectRol, check } = this.state;
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
                        <h1 className="display-6">Creación de Usuarios</h1>
                        <br/>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Apellidos</Label>
                                                <Input
                                                    name="apellidosCompletos"
                                                    id="apellidosCompletosInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidosCompletos}
                                                    invalid={validate.apellidosCompletos === "has-danger"}
                                                    valid={validate.apellidosCompletos === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Nombres</Label>
                                                <Input
                                                    name="nombreCompletos"
                                                    id="nombreCompletosInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nombreCompletos}
                                                    invalid={validate.nombreCompletos === "has-danger"}
                                                    valid={validate.nombreCompletos === "has-success"}
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
                                                <Label>Número Documento DNI/Pasaporte</Label>
                                                <Input
                                                    name="nroDoc"
                                                    id="nroDocInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nroDoc}
                                                    invalid={validate.nroDoc === "has-danger"}
                                                    valid={validate.nroDoc === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <br/>
                                                <Label>Teléfono</Label>
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
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label><b>Nombre de Usuario</b></Label>
                                                <Input
                                                    name="nuevoNombreUsuario"
                                                    id="nuevoNombreUsuarioInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nuevoNombreUsuario}
                                                    invalid={validate.nuevoNombreUsuario === "has-danger"}
                                                    valid={validate.nuevoNombreUsuario === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label><b>Contraseña</b></Label>
                                                <Input
                                                    name="nuevaContrasena"
                                                    id="nuevaContraseñaInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={nuevaContrasena}
                                                    invalid={validate.nuevaContrasena === "has-danger"}
                                                    valid={validate.nuevaContrasena === "has-success"}
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
                                                <Label>Rol de Usuario</Label>
                                                <Input
                                                    type="select"
                                                    name="selectRol"
                                                    value = {selectRol}
                                                    id="selectRolInput"
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="2">COBRADOR/PRESTADOR</option>
                                                    <option value="1">ADMIN</option>
                                                </Input>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup check>
                                            <div className="text-left">
                                                <br/>
                                                <Input
                                                    type="checkbox"
                                                    name="check"
                                                    checked={check}
                                                    id="exampleCheck"
                                                    onChange={this.handleCheck}
                                                >
                                                </Input>
                                                <Label>Activo</Label>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button
                                    block
                                    onClick={this.registrarUsuario}
                                    color="success"
                                >
                                    REGISTRAR
                                </Button>
                                < br/>
                                <Button
                                    block
                                    color="danger"
                                    onClick={this.regresarMenu}
                                >
                                    Regresar
                                </Button>
                                <br/>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
}
}

export default CrearUsuario;