import React, { Component } from "react";
import {
    Navbar, NavbarBrand, NavItem, NavLink, Nav,
    Row, Col,
    Button, Input, Label,
    FormFeedback, FormGroup
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
const axios = require('axios');

class ModificarCliente extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectLogin: false,
            redirectMainAdmin: false,

            id_cliente: "",
            nombresCompletos: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            apodo:"",
            tipoDocumento:"",
            numeroDocumento: "",
            telefonoPersonal: "",
            telefonoReferencial:"",
            direccionDomicilio:"",
            direccionTrabajo:"",
            fechaNacimiento: "",
            sexo: "",
            pais: "",
            correoElectronico: "",
            nota: "",
            validate: {
                nombresCompletos: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                apodo: "",
                tipoDocumento: "",
                numeroDocumento: "",
                telefonoPersonal: "",
                telefonoReferencial: "",
                direccionDomicilio: "",
                direccionTrabajo: "",
                fechaNacimiento: "",
                sexo: "",
                pais: "",
                correoElectronico: "",
                nota: "",
            }
        }
    }
    componentWillMount() {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar', {
            params: {
                dniPasaporteApellidoBuscado: this.props.dni_cliente_modificar
            }
        }).then(function (response) {
            if(Object.keys(response.data).length !== 0){
                self.setState({
                    id_cliente: response.data[0].id,
                    apellidoPaterno: response.data[0].ape_pat,
                    apellidoMaterno: response.data[0].ape_mat,
                    nombresCompletos: response.data[0].nombre,
                    apodo: response.data[0].apodo,
                    tipoDocumento: response.data[0].tipo_doc,
                    numeroDocumento: response.data[0].nro_doc,
                    telefonoPersonal: response.data[0].telefono_personal,
                    telefonoReferencial: response.data[0].telefono_referencia,
                    direccionDomicilio: response.data[0].direccion,
                    direccionTrabajo: response.data[0].direccion_trabajo,
                    fechaNacimiento: response.data[0].fecha_nac,
                    correoElectronico: response.data[0].correo,
                    direccion: response.data[0].direccion,
                    sexo: response.data[0].sexo,
                    pais: response.data[0].pais,
                    nota: response.data[0].nota,
                });
            }
        })
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    modificarCliente = () => {
        let self = this;
        if (this.validar() === 0) {
            axios.post('https://edutafur.com/sgp/public/actualizarCliente', {
                id: this.state.id_cliente,
                apodo: this.state.apodo,
                nombre: this.state.nombresCompletos,
                apePat: this.state.apellidoPaterno,
                apeMat: this.state.apellidoMaterno,
                telefonoPersonal: this.state.telefonoPersonal,
                telefonoReferencia: this.state.telefonoReferencial,
                direccion: this.state.direccionDomicilio,
                direccionTrabajo: this.state.direccionTrabajo,
                tipoDoc: this.state.tipoDocumento,
                nroDoc: this.state.numeroDocumento,
                nacionalidad: this.state.pais,
                fechaNac: this.state.fechaNacimiento,
                sexo: this.state.sexo,
                correo: this.state.correoElectronico,
                nota: this.state.nota
            })
                .then(function (response) {
                    alert(response.data.mensaje);
                    if (response.data.mensaje === "Cliente actualizado") {
                        self.regresarMenu();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    validar = () => {
        const {
            validate,
            nombresCompletos,
            apellidoPaterno,
            apellidoMaterno,
            telefonoPersonal, telefonoReferencia,
            numeroDocumento
        } = this.state;
        let contVal = 0;
        if (apellidoPaterno === "" || apellidoPaterno === null) {
            validate.apellidoPaterno = "has-danger";
            contVal++;
        } else
            validate.apellidoPaterno = "has-success";
        if (apellidoMaterno === "" || apellidoMaterno === null) {
            validate.apellidoMaterno = "has-danger";
            contVal++;
        } else
            validate.apellidoMaterno = "has-success";
        if (nombresCompletos === "" || nombresCompletos === null) {
            validate.nombresCompletos = "has-danger";
            contVal++;
        } else
            validate.nombresCompletos = "has-success";
        if (telefonoPersonal === "" || telefonoPersonal === null) {
            validate.telefonoPersonal = "has-danger";
            contVal++;
        } else
            validate.telefonoPersonal = "has-success";
        if (telefonoReferencia === "" || telefonoReferencia === null) {
            validate.telefonoReferencia = "has-danger";
            contVal++;
        } else
            validate.telefonoReferencia = "has-success";
        if (numeroDocumento === "" || numeroDocumento === null) {
            validate.numeroDocumento = "has-danger";
            contVal++;
        } else
            validate.numeroDocumento = "has-success";
        this.setState({
            validate: validate
        });
        return contVal;
    }
    regresarMenu = () => {
        this.setState({
            redirectMainAdmin: true,
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, validate,
            apellidoPaterno, apellidoMaterno, nombresCompletos, apodo, telefonoPersonal, 
            telefonoReferencial, direccionDomicilio, direccionTrabajo, tipoDocumento, numeroDocumento, nota, fechaNacimiento,
            sexo, pais, correoElectronico
        } = this.state;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectLogin) {
            return (
                <Login />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password} />
            );
        }
        return (
            <div className="container-fluid">
                <br />
                <Navbar color="light" light expand="md">
                    <NavbarBrand >Bienvenido {this.props.username}</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink onClick={this.Logout} style={{ cursor: "pointer" }}>Salir</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container">
                    <div className="container text-center" style={panelAdmin}>
                        <br />
                        <h1 className="display-6">Modificación de Cliente</h1>
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
                                                <Label><b>Apodo</b></Label>
                                                <Input
                                                    name="apodo"
                                                    id="apodoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apodo}
                                                    invalid={validate.apodo === "has-danger"}
                                                    valid={validate.apodo === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Teléfono Personal</Label>
                                                <Input
                                                    name="telefonoPersonal"
                                                    id="telefonoPersonalInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefonoPersonal}
                                                    invalid={validate.telefonoPersonal === "has-danger"}
                                                    valid={validate.telefonoPersonal === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Teléfono Referencial</Label>
                                                <Input
                                                    name="telefonoReferencial"
                                                    id="telefonoReferencialInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefonoReferencial}
                                                    invalid={validate.telefonoReferencial === "has-danger"}
                                                    valid={validate.telefonoReferencial === "has-success"}
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
                                                <Label>Dirección domicilio</Label>
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
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Dirección trabajo</Label>
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
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Tipo de Documento</Label>
                                                <Input
                                                    name="tipoDocumento"
                                                    id="tipoDocumentoInput"
                                                    placeholder=""
                                                    type="select"
                                                    value={tipoDocumento}
                                                    invalid={validate.tipoDocumento === "has-danger"}
                                                    valid={validate.tipoDocumento === "has-success"}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="DNI">DNI</option>
                                                    <option value="PTP">PTP</option>
                                                    <option value="PSP">PASAPORTE</option>
                                                    <option value="OTRO">OTRO</option>
                                                </Input>
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Número de Documento</Label>
                                                <Input
                                                    name="numeroDocumento"
                                                    id="numeroDocumentoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={numeroDocumento}
                                                    invalid={validate.numeroDocumento === "has-danger"}
                                                    valid={validate.numeroDocumento === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Nacionalidad</Label>
                                                <Input
                                                    name="pais"
                                                    id="paisInput"
                                                    placeholder=""
                                                    type="select"
                                                    value={pais}
                                                    invalid={validate.pais === "has-danger"}
                                                    valid={validate.pais === "has-success"}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="PER">PERÚ</option>
                                                    <option value="VEN">VENEZUELA</option>
                                                    <option value="COL">COLOMBIA</option>
                                                    <option value="OTRO">OTRO</option>
                                                </Input>
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Fecha de Nacimiento</Label>
                                                <Input
                                                    name="fechaNacimiento"
                                                    id="fechaNacimientoInput"
                                                    placeholder=""
                                                    type="date"
                                                    value={fechaNacimiento}
                                                    invalid={validate.fechaNacimiento === "has-danger"}
                                                    valid={validate.fechaNacimiento === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Sexo</Label>
                                                <Input
                                                    name="sexo"
                                                    id="sexoInput"
                                                    placeholder=""
                                                    type="select"
                                                    value={sexo}
                                                    invalid={validate.sexo === "has-danger"}
                                                    valid={validate.sexo === "has-success"}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="M">HOMBRE</option>
                                                    <option value="F">MUJER</option>
                                                </Input>
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Correo</Label>
                                                <Input
                                                    name="correoElectronico"
                                                    id="correoElectronicoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={correoElectronico}
                                                    invalid={validate.correoElectronico === "has-danger"}
                                                    valid={validate.correoElectronico === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <div className="text-left">
                                        <Label>Nota</Label>
                                        <Input
                                            name="nota"
                                            id="cnotaInput"
                                            placeholder=""
                                            type="text"
                                            value={nota}
                                            invalid={validate.nota === "has-danger"}
                                            valid={validate.nota === "has-success"}
                                            onChange={this.handleChange}
                                        />
                                        <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                    </div>
                                </FormGroup>
                                <Button
                                    block
                                    onClick={this.modificarCliente}
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
            </div >
        )
    }
}

export default ModificarCliente;