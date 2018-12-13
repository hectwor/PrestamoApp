import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Label,
    ModalFooter, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import moment from "moment";
const axios = require('axios');
class ListarClientes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado : "",
            listaDeDnis : null,
            redirectLogin:false,
            redirectMainAdmin:false,
            infoPagoUltimo: "",

            showModalInformation:false,

            clienteSeleccionado:{
                dni: "",
                nombre: "",
                prestamista: "",
                montoDeuda: "",
                fechaPrestamo: "",
                fechaVencimiento: "",
                fechaUltimoPago: "",
                montoTotalRecaudado: "",
                montoDeudaRestante: "",
                cancelado: ""
            },

            clients:[],
            columnsTable :
                {
                    "dni": "DNI",
                    "cliente": 'Cliente',
                    "prestamista": "Prestamista",
                    "montoP": "Monto Prestado",
                    "montoD": "Mondo Deuda",
                    "fechaP": "Fecha Préstamo",
                    "fechaUP":"Fecha de último pago"
                }
        }
    }

    componentWillMount () {
        let self = this;

        axios.get('https://edutafur.com/sgp/public/prestamos/clientes/buscar')
        .then(function (response) {
              const clients = response.data;

              let optionsClients = clients.map((n) => {
                  let client = {};
                  client['dni']= n.nro_doc;
                  client['cliente']= n.cliente;
                  client['prestamista']= n.prestamista;
                  client['montoP']= n.monto_prestamo;
                  client['montoD']= n.monto_deuda;
                  client['fechaP']= n.fecha_prestamo;
                  client['fechaV']= n.fecha_vencimiento;
                  client['fechaUP']= n.fecha_ultimo_pago;
                  client['montoTRecaudado']= n.monto_total_recaudado;
                  client['montoDR']= n.monto_deuda_restante;
                  client['cancelado']= n.cancelado;
                  return client;
              });
              self.setState({
                  clients: optionsClients
              });
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
        });
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

    regresarMenu = ()=>{
        this.setState({
            redirectMainAdmin: true,
        });
    };

    handleClickTr = (dni) => {
      const {clienteSeleccionado} = this.state;
      let self = this;
      axios.get('https://edutafur.com/sgp/public/prestamos/clientes/buscar', {
        params: {
            dniPasaporteApellidoBuscado: dni
        }
        })
        .then(function (response) {
            clienteSeleccionado.dni =  response.data[0].nro_doc;
            clienteSeleccionado.nombre = response.data[0].cliente;
            clienteSeleccionado.prestamista = response.data[0].prestamista;
            clienteSeleccionado.montoDeuda = response.data[0].monto_deuda;
            clienteSeleccionado.fechaPrestamo = response.data[0].fecha_prestamo;
            clienteSeleccionado.fechaVencimiento = response.data[0].fecha_vencimiento;
            clienteSeleccionado.fechaUltimoPago = response.data[0].fecha_ultimo_pago;
            clienteSeleccionado.montoTotalRecaudado = response.data[0].monto_total_recaudado;
            clienteSeleccionado.montoDeudaRestante = response.data[0].monto_deuda_restante;
            clienteSeleccionado.cancelado = response.data[0].cancelado;
            if(moment(response.data[0].fecha_ultimo_pago).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
                self.setState({ 
                    clienteSeleccionado:clienteSeleccionado,
                    infoPagoUltimo: "Sí pagó hoy"
                });
            }else{
                self.setState({ 
                    clienteSeleccionado:clienteSeleccionado,
                    infoPagoUltimo: "No pagó hoy"
                });
            }
            
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
            self.setState({
                showModalInformation: true
            });
        });
    };

    closeModal = () => {
        this.setState({
            showModalInformation: false
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, clients, 
            columnsTable, clienteSeleccionado, infoPagoUltimo
         } = this.state;
        let self = this;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        const fontSize = {
            fontSize: 14
        };
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
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador}  username={this.props.username} password={this.props.password} />
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
                    <div className="container text-center" style={panelAdmin}>
                        <br/>
                        <h1 className="display-6">Lista de Clientes</h1>
                        <br/>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                                <Table style={fontSize}>
                                    <Thead>
                                        <Tr>
                                            <Th>{columnsTable.dni}</Th>
                                            <Th>{columnsTable.cliente}</Th>
                                            <Th>{columnsTable.montoP}</Th>
                                            <Th>{columnsTable.montoD}</Th>
                                            <Th>{columnsTable.fechaP}</Th>
                                            <Th>{columnsTable.fechaP}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                    {clients.map(function(item, key) {
                                        if( moment(item.fechaUP).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
                                            return (
                                                <Tr key = {key} style = {{cursor: 'pointer'}} onClick={() => {self.handleClickTr(item.dni)}} >
                                                    <Td >{item.dni}</Td>
                                                    <Td >{item.cliente}</Td>
                                                    <Td>{item.montoP}</Td>
                                                    <Td>{item.montoD}</Td>
                                                    <Td>{item.fechaP}</Td>
                                                    <Td><Label style = {{color: '#0040FF'}}>Pagó hoy</Label></Td>
                                                </Tr>
                                            )
                                        }else{
                                            return (
                                                <Tr key = {key} style = {{cursor: 'pointer'}} onClick={() => {self.handleClickTr(item.dni)}} >
                                                    <Td >{item.dni}</Td>
                                                    <Td >{item.cliente}</Td>
                                                    <Td>{item.montoP}</Td>
                                                    <Td>{item.montoD}</Td>
                                                    <Td>{item.fechaP}</Td>
                                                    <Td><Label style = {{color: '#B40404'}}>No pagó hoy</Label></Td>
                                                </Tr>
                                            )
                                        }
                                    })}
                                    </Tbody>
                                </Table>
                                <Button
                                    block
                                    onClick={this.regresarMenu}
                                    color="danger"
                                >
                                    Regresar
                                </Button>
                            </Col>
                            <Col md={1}>
                            </Col>
                        </Row>
                        <br/><br/>
                    </div>
                </div>
                <Modal isOpen={this.state.showModalInformation} style={customStyles} centered size = "mg">
                    <ModalHeader  toggle={this.closeModal}>
                        Información de Cliente
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Nombre de Cliente :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label>{clienteSeleccionado.nombre}</Label>
                                </div>  
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Fecha de Préstamo :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label>{clienteSeleccionado.fechaPrestamo}</Label>
                                </div>  
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto de Deuda :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label>S/. {clienteSeleccionado.montoDeuda}</Label>
                                </div>  
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto Total Recaudado :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label>S/. {clienteSeleccionado.montoTotalRecaudado}</Label>
                                </div>  
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto Deuda Restante :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label>S/. {clienteSeleccionado.montoDeudaRestante}</Label>
                                </div>  
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label><b>Fecha de Último Pago :</b></Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                             <div className="text-left">
                                    <Label><b>{clienteSeleccionado.fechaUltimoPago}</b></Label>
                                </div>  
                            </Col>
                        </Row>
                        <div  className="text-center">
                            <Label><b>{infoPagoUltimo}</b></Label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Salir
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default ListarClientes;