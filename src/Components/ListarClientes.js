import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Label,
    ModalFooter, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import Select from 'react-select';
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
            nombresCliente:null,
            redirectLogin:false,
            redirectMainAdmin:false,
            infoPagoUltimo: "",

            showModalInformation:false,
            showModalInfoPagos: false,

            clienteSeleccionado:[],
            infoPagosCliente:[],
            montoPrestamoVer: 0,
            fechaPrestamoVer: null,

            clients:[],
            options:[],
            columnsTable :
                {
                    "dni": "DNI",
                    "cliente": 'Cliente',
                    "prestamista": "Prestamista",
                    "montoD": "Monto Prestado",
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
              let optionsAllClients = [
                ];
              let optionsClients = clients.map((n) => {
                  if(n.cancelado !== 'S'){
                      let client = {};
                      let clientOption = {};
                      client['id_cliente'] = n.id_cliente;
                      client['dni'] = n.nro_doc;
                      client['cliente'] = n.cliente;
                      client['prestamista'] = n.prestamista;
                      client['montoP'] = n.monto_prestamo;
                      client['montoD'] = n.monto_deuda;
                      client['fechaP'] = n.fecha_prestamo;
                      client['fechaV'] = n.fecha_vencimiento;
                      client['fechaUP'] = n.fecha_ultimo_pago;
                      client['montoTRecaudado'] = n.monto_total_recaudado;
                      client['montoDR'] = n.monto_deuda_restante;
                      client['cancelado'] = n.cancelado;
                      clientOption['value']= n.nro_doc;
                      clientOption['label']= n.cliente;
                      optionsAllClients.push(clientOption);
                      return client;
                  }
              });
              optionsClients.sort(function(a, b){
                a = new Date(a.fechaUP);
                b = new Date(b.fechaUP);
                return a>b ? -1 : a<b ? 1 : 0;
                });
              console.log(optionsClients)
              self.setState({
                  clients: optionsClients,
                  options: optionsAllClients
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

    handleClickTr = (id_cliente) => {
      let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamos/clientes', {
        params: {
                idCliente: id_cliente
        }
        })
        .then(function (response) {
            self.setState({
                clienteSeleccionado:response.data,
                showModalInformation: true
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    handleClickInfoPagos = (id_prestamo) => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/consultarPagos', {
            params: {
                idPrestamo: id_prestamo
            }
        })
            .then(function (response) {
                self.setState({
                    infoPagosCliente: response.data,
                    montoPrestamoVer: response.data[0].monto_prestamo,
                    fechaPrestamoVer: response.data[0].fecha_prestamo,
                    showModalInfoPagos: true
                });
            });
    }

    handleChangeSelect = (nombresCliente) => {
        let nombreC = nombresCliente.label.trim();
        let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamos/clientes/buscar',{
            params : {
                dniPasaporteApellidoBuscado: nombreC
            }
        })
        .then(function (response) {
              const clients = response.data;
              let optionsClients = clients.map((n) => {
                  if(n.cancelado !== 'S'){
                      let client = {};
                      client['id_cliente'] = n.id_cliente;
                      client['dni'] = n.nro_doc;
                      client['cliente'] = n.cliente;
                      client['prestamista'] = n.prestamista;
                      client['montoP'] = n.monto_prestamo;
                      client['montoD'] = n.monto_deuda;
                      client['fechaP'] = n.fecha_prestamo;
                      client['fechaV'] = n.fecha_vencimiento;
                      client['fechaUP'] = n.fecha_ultimo_pago;
                      client['montoTRecaudado'] = n.monto_total_recaudado;
                      client['montoDR'] = n.monto_deuda_restante;
                      client['cancelado'] = n.cancelado;
                      return client;
                  }
              });
              optionsClients.sort(function(a, b){
                a = new Date(a.fechaUP);
                b = new Date(b.fechaUP);
                return a>b ? -1 : a<b ? 1 : 0;
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

    closeModal = () => {
        this.setState({
            showModalInformation: false
        });
    };

    regresar = () => {
        this.setState({
            showModalInfoPagos: false
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, clients, 
            columnsTable, clienteSeleccionado, infoPagosCliente,
            nombresCliente,options
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
        const cuadro = {
            height: "300px",
            overflowY: "scroll"
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
        const cuadroCliente = {
            height: "400px",
            overflowY: "scroll"
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
                            <Col  md={3}>
                            </Col>
                            <Col  md={6}>
                                <Select
                                    name="nombresCliente"
                                    id="nombresClienteInput"
                                    value={nombresCliente}
                                    onChange={this.handleChangeSelect}
                                    options={options}
                                />
                                <br/>
                            </Col>
                            <Col  md={3}>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                            <div style={cuadroCliente}>
                                <Table style={fontSize}>
                                    <Thead>
                                        <Tr>
                                            <Th>{columnsTable.dni}</Th>
                                            <Th>{columnsTable.cliente}</Th>
                                            <Th>{columnsTable.montoD}</Th>
                                            <Th>{columnsTable.fechaP}</Th>
                                            <Th>Información</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                    {clients.map(function(item, key) {
                                        if(item !== undefined){
                                            if (moment(item.fechaUP).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                                                return (
                                                    <Tr key={key} style={{ cursor: 'pointer' }} onClick={() => { self.handleClickTr(item.id_cliente) }} >
                                                        <Td >{item.dni}</Td>
                                                        <Td >{item.cliente}</Td>
                                                        <Td>s/. {item.montoD}</Td>
                                                        <Td>{item.fechaP}</Td>
                                                        <Td><Label style={{ color: '#0040FF' }}>Pagó hoy</Label></Td>
                                                    </Tr>
                                                )
                                            } else {
                                                return (
                                                    <Tr key={key} style={{ cursor: 'pointer' }} onClick={() => { self.handleClickTr(item.id_cliente) }} >
                                                        <Td >{item.dni}</Td>
                                                        <Td >{item.cliente}</Td>
                                                        <Td>s/. {item.montoD}</Td>
                                                        <Td>{item.fechaP}</Td>
                                                        <Td><Label style={{ color: '#B40404' }}>No pagó hoy</Label></Td>
                                                    </Tr>
                                                )
                                            }
                                        }else{
                                            return (<Tr></Tr>)
                                        }
                                    })}
                                    </Tbody>
                                </Table>
                            </div>
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
                <Modal isOpen={this.state.showModalInformation} style={customStyles} centered size = "lg">
                    <ModalHeader  toggle={this.closeModal}>
                        Información préstamos de Cliente
                    </ModalHeader>
                    <ModalBody>
                        <Table style={fontSize}>
                            <Thead>
                                <Tr className="text-center">
                                    <Th><b>Estado</b></Th>
                                    <Th><b>Monto Préstamo</b></Th>
                                    <Th><b>Cuotas</b></Th>
                                    <Th><b>Préstamo</b></Th>
                                    <Th><b>Recaudado</b></Th>
                                    <Th><b>Faltante</b></Th>
                                    <Th><b>Vencimiento</b></Th>
                                    <Th><b>Último pago</b></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {clienteSeleccionado.map(function (item, key) {
                                    return (
                                        <Tr key={key} className="text-center" style={{ cursor: 'pointer' }} onClick={() => { self.handleClickInfoPagos(item.id_prestamo) }} >
                                            <Td>{item.estado}</Td>
                                            <Td>s/. {item.monto_deuda}</Td>
                                            <Td>{item.nro_cuotas}</Td>
                                            <Td>{item.fecha_prestamo}</Td>
                                            <Td>s/. {item.monto_total_recaudado}</Td>
                                            <Td>s/. {item.monto_deuda_restante}</Td>
                                            <Td>{item.fecha_vencimiento}</Td>
                                            <Td>{item.fecha_ultimo_pago}_</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
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
                <Modal isOpen={this.state.showModalInfoPagos} centered size="mg">
                    <ModalHeader toggle={this.regresar}>
                        Pagos de préstamo seleccionado
                    </ModalHeader>
                    <ModalBody>
                        <Label><b>Monto Préstamo</b>: s/. {this.state.montoPrestamoVer}</Label><br />
                        <Label><b>Fecha Préstamo</b>: {this.state.fechaPrestamoVer}</Label>
                        <div style={cuadro}>
                            <Table style={fontSize}>
                                <Thead>
                                    <Tr className="text-center">
                                        <Th><b>Pago</b></Th>
                                        <Th><b>Faltante</b></Th>
                                        <Th><b>Fecha</b></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {infoPagosCliente.map(function (item, key) {
                                        return (
                                            <Tr key={key} className="text-center">
                                                <Td>s/. {item.pago}</Td>
                                                <Td>s/. {item.monto_deuda_restante}</Td>
                                                <Td>{item.fecha_pago}</Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={this.regresar}
                            color="danger"
                        >
                            Regresar
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default ListarClientes;