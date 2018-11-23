import {Component} from "react";
import React from "react";
import Login from "./Login";
import Prestamo from "./Prestamo";
import Recojo from "./Recojo";
import NuevoCliente from "./NuevoCliente";
import {
    Row,
    Col,
    Button,
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Modal,ModalHeader,ModalBody, ModalFooter,
    Input, FormFeedback
} from 'reactstrap';
import Select from 'react-select';
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

class MainRecogedor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idClienteBuscado: "",
            apellidoPaternoBuscado:"",
            apellidoMaternoBuscado:"",
            idClienteSeleccionado: "",
            apellidoPaternoSeleccionado:"",
            apellidoMaternoSeleccionado:"",

            dniPasaporteBuscar: null,
            selectUsuarioPrestar:"Seleccione tipo de Usuario",

            montoActual: "500.00",

            showModalPrestarOption: false,
            showModalRecogerOption: false,
            validate: {
                dniPasaporteBuscar: null,
            },

            redirectLogin:false,
            redirectNuevoUsuario:false,
            redirectPrestamo:false,
            redirectRecojo:false,
            usuarioEncontrado:false,

            visibleNuevo:"hidden",

            options:[]
        };
    }
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

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

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

    nuevoCliente = () => {
        this.setState({
            redirectNuevoUsuario: true
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
        const { 
            montoActual, 
            redirectLogin, 
            redirectNuevoUsuario, redirectPrestamo, redirectRecojo, 
            dniPasaporteBuscar, apellidoPaternoBuscado, apellidoMaternoBuscado, 
            validate,
            options
         } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "70px"
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
        if(redirectNuevoUsuario){
            return (
                <NuevoCliente username={this.props.username}  rol = {"prestamista"}/>
            );
        }
        if(redirectPrestamo){
            return (
                <Prestamo
                    username={this.props.username}
                    saldo = {this.state.montoActual}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"prestamista"}
                />
            );
        }
        if(redirectRecojo){
            return (
                <Recojo
                    username={this.props.username}
                    saldo = {this.state.montoActual}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"prestamista"}
                />
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
                    <div className="container" style={panelVendedor}>
                        <Row >
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <br/><br/>
                                <h1 className="display-6">Monto Actual en mano</h1>
                                <h1 className="display-4">S/. {montoActual}</h1>
                                <br/>
                                <div>
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
                                        RECOGER
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        size="lg"
                                        style={buttonSize}
                                    >
                                        VER DÍA
                                    </Button>
                                    <span> </span>
                                    <br/><br/><br/>
                                </div>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
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

export default MainRecogedor;