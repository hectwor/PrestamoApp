import {Component} from "react";
import React from "react";
import Login from "./login";
import Prestamo from "./Prestamo";
import NuevoUsuario from "./NuevoUsuario";
import {
    Row,
    Col,
    Button,
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Modal,ModalHeader,ModalBody, ModalFooter,
    Input, FormFeedback
} from 'reactstrap';

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

class Mainvendedor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            apellidoPaternoBuscado:"",
            apellidoMaternoBuscado:"",

            dniPasaporteBuscar: "",
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
            usuarioEncontrado:false,

            visibleNuevo:"hidden"
        };
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

    buscarDNIPasaporte = () => {
        const { dniPasaporteBuscar, validate } = this.state;

        if(dniPasaporteBuscar === "123"){
            validate.dniPasaporteBuscar = "has-success";
            this.setState({
                usuarioEncontrado: true,
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

    nuevoCliente = () => {
        this.setState({
            redirectNuevoUsuario: true
        });
    };

    openModalPrestar = () => {
        this.setState({
            showModalPrestarOption: true
        });
    };

    openModalCobrar = () => {
        this.setState({
            showModalRecogerOption: true,
        });
    };

    closeModal = () => {
        this.setState({
            showModalPrestarOption: false,
            showModalRecogerOption: false
        });
    };

    render() {
        const { montoActual, redirectLogin, redirectNuevoUsuario, redirectPrestamo, dniPasaporteBuscar, apellidoPaternoBuscado, apellidoMaternoBuscado, validate } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if(redirectNuevoUsuario){
            return (
                <NuevoUsuario   username={this.props.username} />
            );
        }
        if(redirectPrestamo){
            return (
                <Prestamo  username={this.props.username} saldo = {this.state.montoActual}/>
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
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalCobrar}
                                    >
                                        RECOGER
                                    </Button>
                                    <br/><br/>
                                </div>
                                <div>
                                    <Button
                                        size="lg"
                                    >
                                        VER INFORMACIÓN DEL DÍA
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
                                            <span>Indicar DNI o Préstamo</span>
                                            <Input
                                                name="dniPasaporteBuscar"
                                                id="dniPasaporteBuscarInput"
                                                placeholder="DNI o Pasaporte"
                                                value={dniPasaporteBuscar}
                                                onChange={this.handleChange}
                                                invalid={validate.dniPasaporteBuscar === "has-danger"}
                                                valid={validate.username === "has-success"}
                                            />
                                            <FormFeedback invalid>Cliente no encontrado</FormFeedback>
                                        </Col>
                                        <Col md={3}>
                                            <br />
                                            <Button
                                                onClick= {this.buscarDNIPasaporte}
                                            >
                                                Buscar
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
                            <br />
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
                        <br/>
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

                <Modal  isOpen={this.state.showModalRecogerOption} style={customStyles} centered    >
                    <ModalHeader toggle={this.closeModal}>
                        Recoger
                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Mainvendedor;