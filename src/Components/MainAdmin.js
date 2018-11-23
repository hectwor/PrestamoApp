import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button,
    FormFeedback,
    ModalFooter, Input, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import Select from 'react-select';
import Login from "./Login";
import MovimientosAdmin from "./MovimientosAdmin";
import ListarClientes from "./ListarClientes";
import CrearUsuario from "./CrearUsuario";
import Prestamo from "./Prestamo";
import Recojo from "./Recojo";
import NuevoCliente from "./NuevoCliente";
const axios = require('axios');

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
};

class MainAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMovimientosAdmin:false,
            redirectOpenClientes:false,
            redirectCrearUsuario:false,
            redirectPrestamo:false,
            redirectRecojo:false,
            redirectNuevoCliente:false,

            usuarioEncontrado:false,

            dniPasaporteBuscar:null,
            idClienteSeleccionado: "",
            apellidoPaternoSeleccionado:"",
            apellidoMaternoSeleccionado:"",
            idClienteBuscado: "",
            apellidoPaternoBuscado:"",
            apellidoMaternoBuscado:"",

            validate: {
                dniPasaporteBuscar:null,
            },

            showModalRecogerOption:false,
            showModalPrestarOption:false,

            visibleNuevo:"hidden",

            options:[]
        }
    }
    openMovimientos = () =>{
        this.setState({
            redirectMovimientosAdmin: true,
        });
    };

    openClientes = () => {
        this.setState({
            redirectOpenClientes: true,
        });
    };
    crearUsuario = () => {
        this.setState({
            redirectCrearUsuario: true,
        });
    };
    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    openPrestar = () => {
        this.setState({
            redirectPrestamo: true,
        });
    };

    openCobrar = () => {
        this.setState({
            redirectRecojo: true,
        });
    };

    nuevoCliente = () => {
        this.setState({
            redirectNuevoCliente: true
        });
    };

    openModalPrestar = () => {
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar')
          .then(function (response) {
                const clients = response.data;
                let optionsClients = [
                ];
                optionsClients = clients.map((n) => {
                    let client = {};
                    client['value']= n.nro_doc;
                    client['label']= n.nombre + ' ' + n.ape_pat + ' ' + n.ape_mat;
                    return client;
                })
                self.setState({
                    options: optionsClients
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
            self.setState({
                showModalPrestarOption: true
            });
          });
    };

    onkeyPressInput = () => {

    };

    openModalCobrar = () => {
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar')
          .then(function (response) {
                const clients = response.data;
                let optionsClients = [
                ];
                optionsClients = clients.map((n) => {
                    let client = {};
                    client['value']= n.nro_doc;
                    client['label']= n.nombre + ' ' + n.ape_pat + ' ' + n.ape_mat;
                    return client;
                })
                self.setState({
                    options: optionsClients
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
            self.setState({
                showModalRecogerOption: true,
            });
          });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    handleChangeSelect = (dniPasaporteBuscar) => {
        this.setState({ 
            dniPasaporteBuscar :  dniPasaporteBuscar
        });
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar',{
            params: {
                dniPasaporteApellidoBuscado : dniPasaporteBuscar.value
            }
        })
          .then(function (response) {
                self.setState({
                    apellidoPaternoSeleccionado : response.data[0].ape_pat,
                    apellidoMaternoSeleccionado : response.data[0].ape_mat,
                    idClienteSeleccionado : response.data[0].id
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
          });
      }

    seleccionarDNIPasaporte = () => {
        const { dniPasaporteBuscar, validate, apellidoPaternoSeleccionado, apellidoMaternoSeleccionado, idClienteSeleccionado } = this.state;
        if(dniPasaporteBuscar !== null || idClienteSeleccionado !== ""){
            validate.dniPasaporteBuscar = "has-success";
            this.setState({
                usuarioEncontrado: true,
                apellidoPaternoBuscado: apellidoPaternoSeleccionado,
                apellidoMaternoBuscado: apellidoMaternoSeleccionado,
                idClienteBuscado: idClienteSeleccionado,
                validate:validate
            });
        }else{
            validate.dniPasaporteBuscar = "has-danger";
            this.setState({
                usuarioEncontrado: false,
                validate:validate
            });
        }
    };

    prestamo = () => {
        this.setState({
            redirectPrestamo: true
        });
    };

    recoger = () => {
        this.setState({
            redirectRecojo: true
        });
    };

    closeModal = () => {
        this.setState({
            dniPasaporteBuscar:null,
            idClienteSeleccionado:"",
            usuarioEncontrado:false,
            showModalPrestarOption: false,
            showModalRecogerOption: false
        });
    };

    render() {
        const { redirectLogin, redirectMovimientosAdmin,
            redirectNuevoCliente,
            redirectOpenClientes, redirectCrearUsuario,
            redirectPrestamo, redirectRecojo, dniPasaporteBuscar,
            validate,apellidoPaternoBuscado, apellidoMaternoBuscado,
            options
        } = this.state;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        const buttonSize = {
            height: '60px',
            width: '230px',
            marginBottom: '20px',
            marginRight: '6px',
            marginLeft: '6px'
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectOpenClientes) {
            return (
                <ListarClientes   username={this.props.username} password={this.props.password} />
            );
        }
        if (redirectCrearUsuario) {
            return (
                <CrearUsuario   username={this.props.username} password={this.props.password} />
            );
        }
        if (redirectMovimientosAdmin) {
            return (
                <MovimientosAdmin   username={this.props.username} password={this.props.password} />
            );
        }
        if (redirectNuevoCliente) {
            return (
                <NuevoCliente   username={this.props.username} password={this.props.password} rol = {"admin"}/>
            );
        }
        if (redirectPrestamo) {
            return (
                <Prestamo
                    id_trabajador = {this.props.id_trabajador} 
                    username={this.props.username}
                    saldo = {this.state.montoActual}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"admin"}
                />
            );
        }
        if (redirectRecojo) {
            return (
                <Recojo
                    id_trabajador = {this.props.id_trabajador} 
                    username={this.props.username}
                    password={this.props.password}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"admin"} />
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
                        <Row>
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <br/>
                                <h1 className="display-6">Menú Administrador</h1>
                                    <br/><br/>
                                        <Button
                                            size="lg"
                                            onClick={this.openMovimientos}
                                            style={buttonSize}
                                        >
                                            MOVIMIENTOS
                                        </Button>
                                    <span> </span>
                                        <Button
                                            size="lg"
                                            onClick={this.openClientes}
                                            style={buttonSize}
                                        >
                                            CLIENTES
                                        </Button>
                                    <Button
                                        size="lg"
                                        onClick={this.crearUsuario}
                                        style={buttonSize}
                                    >
                                        CREAR USUARIO
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.modificarUsuario}
                                        style={buttonSize}
                                    >
                                        MODIFICAR USUARIO
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalPrestar}
                                        style={buttonSize}
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalCobrar}
                                        style={buttonSize}
                                    >
                                        COBRAR
                                    </Button>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                        <br/> <br/>
                    </div>
                </div>
                <Modal  isOpen={this.state.showModalPrestarOption} style={customStyles} centered size = "lg" >
                    <ModalHeader toggle={this.closeModal}>
                        Cliente a prestar
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <Row>
                                        <Col md={9}>
                                            <span>Indicar Apellidos o Nombres</span>
                                            <Select
                                                name="dniPasaporteBuscar"
                                                id="dniPasaporteBuscarInput"
                                                placeholder=""
                                                value={dniPasaporteBuscar}
                                                onChange={this.handleChangeSelect}
                                                invalid={validate.dniPasaporteBuscar === "has-danger"}
                                                valid={validate.username === "has-success"}
                                                options={options}
                                            />
                                            <FormFeedback invalid>Cliente no encontrado</FormFeedback>
                                        </Col>
                                        <Col md={3}>
                                            <br />
                                            <Button
                                                onClick= {this.seleccionarDNIPasaporte}
                                            >
                                                Seleccionar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick= {this.nuevoCliente}
                                    >
                                        Nuevo Cliente
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={(this.state.usuarioEncontrado===true) ? null :{visibility: [this.state.visibleNuevo]}}>
                            <Row>
                                <Col md={6}>
                                    <span>Apellido Paterno</span>
                                    <Input
                                        name="apellidoPaternoBuscado"
                                        id="apellidoPaternoBuscadoInput"
                                        value={apellidoPaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Apellido Materno</span>
                                    <Input
                                        name="apellidoMaternoBuscado"
                                        id="apellidoMaternoBuscadoInput"
                                        value={apellidoMaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <br />
                            <div className = "text-center">
                                <Button
                                    size="lg"
                                    onClick= {this.prestamo}
                                    color="primary"
                                >
                                    Prestar
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal  isOpen={this.state.showModalRecogerOption} style={customStyles} centered size = "lg">
                    <ModalHeader toggle={this.closeModal}>
                        Recoger
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <span>Indicar Apellidos o Nombres</span>
                                    <Select
                                        name="dniPasaporteBuscar"
                                        id="dniPasaporteBuscarInput"
                                        placeholder=""
                                        value={dniPasaporteBuscar}
                                        onChange={this.handleChangeSelect}
                                        invalid={validate.dniPasaporteBuscar === "has-danger"}
                                        valid={validate.username === "has-success"}
                                        options={options}
                                    />
                                    <FormFeedback invalid>Cliente no encontrado</FormFeedback>
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick= {this.seleccionarDNIPasaporte}
                                    >
                                        Seleccionar
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={(this.state.usuarioEncontrado===true) ? null :{visibility: [this.state.visibleNuevo]}}>
                            <Row>
                                <Col md={6}>
                                    <span>Apellido Paterno</span>
                                    <Input
                                        name="apellidoPaternoBuscado"
                                        id="apellidoPaternoBuscadoInput"
                                        value={apellidoPaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Apellido Materno</span>
                                    <Input
                                        name="apellidoMaternoBuscado"
                                        id="apellidoMaternoBuscadoInput"
                                        value={apellidoMaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <br />
                            <div className = "text-center">
                                <Button
                                    size="lg"
                                    onClick= {this.recoger}
                                    color="primary"
                                >
                                    RECOGER
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default MainAdmin;