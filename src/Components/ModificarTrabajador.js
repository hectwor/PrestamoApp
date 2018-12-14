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

            id_trabajador: "",
            nombresCompletos:"",
            apellidoPaterno:"",
            apellidoMaterno:"",
            dniPasaporte:"",
            telefono:"",
            fechaNacimiento:"",
            sexo: "",
            pais:"",
            correoElectronico:"",
            direccion:"",
            validate:{
                nombresCompletos:null,
                apellidoPaterno:null,
                apellidoMaterno:null,
                dniPasaporte:null,
                telefono:null,
                fechaNacimiento:null,
                sexo:null,
                pais:null,
                correoElectronico:null,
                direccion:null
            }
        }
    }
    componentWillMount() {
        console.log(this.props.id_trabajador_modificar);
        let self = this;
        axios.get('https://edutafur.com/sgp/public/trabajador/buscar', {
            params: {
                nroDoc: this.props.id_trabajador_modificar
            }
        }).then(function (response) {
            console.log(response);
            self.setState({
                id_trabajador: response.data[0].id_trabajador,
                apellidoPaterno: response.data[0].ape_pat,
                apellidoMaterno: response.data[0].ape_mat,
                nombresCompletos: response.data[0].nombre,
                telefono: response.data[0].telefono,
                fechaNacimiento: response.data[0].fecha_nac,
                dniPasaporte: response.data[0].nro_doc,
                correoElectronico: response.data[0].correo,
                direccion: response.data[0].direccion,
                sexo: response.data[0].sexo,
                pais: response.data[0].pais
            });
        })
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

    modificarTrabajador = () => {
        let self = this;
        if(this.validar() === 0){
            axios.post('https://edutafur.com/sgp/public/trabajador/actualizar', {
                nombre: this.state.nombresCompletos,
                apePat: this.state.apellidoPaterno,
                apeMat: this.state.apellidoMaterno,
                telefono: this.state.telefono,
                nroDoc: this.state.dniPasaporte,
                direccion: this.state.direccion,
                fechaNac: this.state.fechaNacimiento,
                sexo: this.state.sexo,
                pais: this.state.pais,
                tipoDoc: 'DNI',
                correo: this.state.correoElectronico,
                idTrabajador: this.state.id_trabajador,
            })
                .then(function (response) {
                    alert(response.data.mensaje);
                    if (response.data.mensaje === "Trabajador Actualizado"){
                        self.regresarMenu();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    validar = () => {
        const { 
            validate, 
            nombresCompletos, 
            apellidoPaterno, 
            apellidoMaterno,
            dniPasaporte
         } = this.state;
        let contVal = 0;
        if (nombresCompletos === "" || nombresCompletos === null) {
            validate.nombresCompletos = "has-danger";
            contVal++;
        } else
            validate.nombresCompletos = "has-success";
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
        if (dniPasaporte === "" || dniPasaporte === null) {
            validate.dniPasaporte = "has-danger";
            contVal++;
        } else
            validate.dniPasaporte = "has-success";
        this.setState({
            validate: validate
        });
        return contVal;
    }

    regresarMenu = ()=>{
        this.setState({
            redirectMainAdmin: true,
        });
    };
    render(){
        const { redirectLogin, redirectMainAdmin, validate,
            apellidoPaterno, apellidoMaterno, nombresCompletos, dniPasaporte, telefono, fechaNacimiento,
            sexo, pais, correoElectronico, direccion
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
                                                    invalid={validate.telefono === "has-danger"}
                                                    valid={validate.telefono === "has-success"}
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
                                </Row>
                                <Row>
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
                                                <Label>País</Label>
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
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Label>Dirección</Label>
                                                <Input
                                                    name="direccion"
                                                    id="direccionInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={direccion}
                                                    invalid={validate.direccion === "has-danger"}
                                                    valid={validate.direccion === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button
                                    block
                                    onClick={this.modificarTrabajador}
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