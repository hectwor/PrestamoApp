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
            ultimpoPagoBuscado:"",
            prestamistaSeleccionado:"",
            deudaRestanteSeleccionado:"",

            dniPasaporteBuscar: null,
            dniPasaporteBuscado: null,
            selectUsuarioPrestar:"Seleccione tipo de Usuario",

            descripcionGasto:"",
            montoGasto:0,

            montoActual: 0,

            showModalPrestarOption: false,
            showModalRecogerOption: false,
            showModalAgregarGastos: false,
            validate: {
                dniPasaporteBuscar: null,
                descripcionGasto: null,
                montoGasto: null
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

    componentWillMount() {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/trabajador/recaudado-mano', {
            params: {
                idTrabajador: this.props.id_trabajador
            }
          })
            .then(function (response) {
                self.setState({
                    montoActual: response.data[0].total_recaudado_mano
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    handleChangeSelect = (dniPasaporteBuscar) => {
        this.setState({ 
            dniPasaporteBuscar :  dniPasaporteBuscar,
            usuarioEncontrado: false,
            apellidoPaternoSeleccionado : "",
                    apellidoMaternoSeleccionado : "",
                    prestamistaSeleccionado : "",
                    deudaRestanteSeleccionado : "",
                    ultimpoPagoBuscado: "",
                    idClienteSeleccionado : "",
                    dniPasaporteBuscado: ""
        });
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar',{
            params: {
                dniPasaporteApellidoBuscado : dniPasaporteBuscar.value
            }
        })
          .then(function (response) {
              if(Object.keys(response.data).length === 0){
                  const apep= (dniPasaporteBuscar.label).split(" ")[(dniPasaporteBuscar.label).split(" ").length - 2];
                  const apem= (dniPasaporteBuscar.label).split(" ")[(dniPasaporteBuscar.label).split(" ").length - 1];
                self.setState({
                    apellidoPaternoBuscado : apep,
                    apellidoMaternoBuscado : apem,
                    idClienteSeleccionado : dniPasaporteBuscar.id,
                    dniPasaporteBuscado: dniPasaporteBuscar.value,
                    redirectPrestamo: true
                });
              }else{
                self.setState({
                    apellidoPaternoSeleccionado : response.data[0].ape_pat,
                    apellidoMaternoSeleccionado : response.data[0].ape_mat,
                    prestamistaSeleccionado : response.data[0].prestamista,
                    deudaRestanteSeleccionado : response.data[0].monto_deuda_restante,
                    ultimpoPagoBuscado: response.data[0].fecha_ultimo_pago,
                    idClienteSeleccionado : response.data[0].id_cliente,
                    dniPasaporteBuscado: response.data[0].nro_doc
                });
              }
                
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
        if(this.state.idClienteSeleccionado === ""){
            alert('Ha ocurrido un problema, vuelva a seleccionar');
        }else{
            if(parseFloat(this.state.deudaRestanteSeleccionado) > 0){
                alert('Tiene deuda pendiente');
            }else{
                this.setState({
                    redirectPrestamo: true
                });
            }
        }
    };

    recoger = () => {
        if(this.state.idClienteSeleccionado === ""){
            alert('Ha ocurrido un problema, vuelva a seleccionar');
        }else{
            this.setState({
                redirectRecojo: true
            });
        }
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
                    client['id']= n.id;
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
        axios.get('https://edutafur.com/sgp/public/clientes/buscar',{
            params: {
                idTrabajador: this.props.id_trabajador
            }
        })
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

    openModalAgregarGastos = () => {
        this.setState({
            showModalAgregarGastos: true,
        });
    };

    enviarGasto = () => {
        const { id_trabajador, descripcionGasto, montoGasto, validate } = this.state;
        let contVal = 0;
        let self = this;
        if(descripcionGasto==="" || descripcionGasto === null){
            validate.descripcionGasto = "has-danger";
            contVal++;
        }else
            validate.descripcionGasto = "has-success";
        if(montoGasto==="" || montoGasto === null || montoGasto === 0){
            validate.montoGasto = "has-danger";
            contVal++;
        }else
            validate.montoGasto = "has-success";
        this.setState({
            validate:validate
        });
        if(contVal === 0){
            axios.post('https://edutafur.com/sgp/public/gastos/agregar', {
                idTrabajador: id_trabajador,
                conceptoGasto: descripcionGasto,
                montoGasto: montoGasto
              })
              .then(function (response) {
                  if(response.status === 200){
                      alert(`Gasto de ${descripcionGasto} guardado con monto de S/. ${montoGasto}`);
                      self.closeModal();
                  }
              })
              .catch(function (error) {
                console.log(error);
              });
        }
    };

    closeModal = () => {
        this.setState({
            dniPasaporteBuscar:null,
            idClienteSeleccionado:"",
            montoGasto:0,
            descripcionGasto:"",
            usuarioEncontrado:false,
            showModalPrestarOption: false,
            showModalRecogerOption: false,
            showModalAgregarGastos: false
        });
    };

    render() {
        const { 
            montoActual, 
            redirectLogin, 
            redirectNuevoUsuario, redirectPrestamo, redirectRecojo, 
            dniPasaporteBuscar, apellidoPaternoBuscado, apellidoMaternoBuscado,
            descripcionGasto, montoGasto, ultimpoPagoBuscado, deudaRestanteSeleccionado, prestamistaSeleccionado,
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
                <NuevoCliente id_trabajador={this.props.id_trabajador}  username={this.props.username}  rol = {"prestamista"}/>
            );
        }
        if(redirectPrestamo){
            return (
                <Prestamo
                    id_trabajador={this.props.id_trabajador}
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
                    id_trabajador={this.props.id_trabajador}
                    username={this.props.username}
                    saldo = {this.state.montoActual}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    dniPasaporteBuscado = {this.state.dniPasaporteBuscado}
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
                                        onClick={this.openModalAgregarGastos}
                                        style={buttonSize}
                                    >
                                        AGREGAR GASTOS
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
                                <Col md={4}>
                                    <span>Deuda con prestamista</span>
                                    <Input
                                            name="prestamistaSeleccionado"
                                            id="prestamistaSeleccionadoInput"
                                            value={prestamistaSeleccionado}
                                            readOnly
                                    />
                                </Col>
                                <Col md={4}>
                                    <span>Monto pendiente de pago</span>
                                    <Input
                                            name="deudaRestanteSeleccionado"
                                            id="deudaRestanteSeleccionadoInput"
                                            value={deudaRestanteSeleccionado}
                                            readOnly
                                    />
                                </Col>
                                <Col md={4}>
                                    <span>Fecha Último Pago</span>
                                    <Input
                                            name="ultimpoPagoBuscado"
                                            id="ultimpoPagoBuscadoInput"
                                            value={ultimpoPagoBuscado}
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
                                        valid={validate.dniPasaporteBuscar === "has-success"}
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
                <Modal isOpen={this.state.showModalAgregarGastos} style={customStyles} centered size = "lg">
                    <ModalHeader toggle={this.closeModal}>
                        REPORTAR GASTOS
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={12}>
                                    <Row>
                                        <Col md={6}>
                                            <span>Indicar Gasto</span>
                                            <Input
                                                name="descripcionGasto"
                                                id="descripcionGastoInput"
                                                placeholder=""
                                                value={descripcionGasto}
                                                onChange={this.handleChange}
                                                invalid={validate.descripcionGasto === "has-danger"}
                                                valid={validate.descripcionGasto === "has-success"}
                                            />
                                            <FormFeedback invalid>Indicar descripción de gasto</FormFeedback>
                                        </Col>
                                        <Col md={3}>
                                            <span>Monto de Gasto (S/.)</span>
                                            <Input
                                                name="montoGasto"
                                                id="montoGastoInput"
                                                placeholder=""
                                                type="number"
                                                value={montoGasto}
                                                onChange={this.handleChange}
                                                invalid={validate.montoGasto === "has-danger"}
                                                valid={validate.montoGasto === "has-success"}
                                            />
                                            <FormFeedback invalid>Indicar el monto del gasto</FormFeedback>
                                        </Col>
                                        <Col md={3}>
                                            <br />
                                            <Button
                                                onClick= {this.enviarGasto}
                                            >
                                                Guardar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
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