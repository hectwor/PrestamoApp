import React, { Component } from "react";
import {
    Navbar, NavbarBrand, NavItem, NavLink, Nav,
    Row, Col,
    Button,
    ModalFooter, ModalBody, ModalHeader, Modal, Label,
    Input
} from 'reactstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from "moment";
import Login from "./Login";
import MainAdmin from "./MainAdmin";
const axios = require('axios');
class ListarTrabajadores extends Component {
    constructor(props){
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado: "",
            id_trabajadorBuscado:"",
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            movAnte:"",
            AvisoDisplay: 'none',
            redirectLogin: false,
            redirectMainAdmin: false,
            pagoDia:0,

            showModalInformation:null,

            trabajadores: [],
            movimientos: [],
            columnsTable:
            {
                "dni": "DNI",
                "nombreCompleto": 'Nombre del Trabajador',
                "telefono": "Telefono",
                "verDatos": "Ver / Liquidar"
            }
        }
    }

    componentWillMount () {
        let self = this;

        axios.get('https://edutafur.com/sgp/public/trabajadores')
        .then(function (response) {
              const trabajadores = response.data;

              let optionsTrabajadores = trabajadores.map((n) => {
                  let trabajador = {};
                  trabajador['id_trabajador']= n.id_trabajador;
                  trabajador['dni']= n.nro_doc;
                  trabajador['nombreCompleto']= n.ape_pat+ ' '+n.ape_mat+' '+n.nombre;
                  trabajador['telefono']= n.telefono;
                  return trabajador;
              });
              self.setState({
                  trabajadores: optionsTrabajadores
              });
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
        });
    }

    llenarModal = (id_trabajador) => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/movimientos/trabajador/', {
            params: {
                idTrabajador: id_trabajador
            }
        }).then(function (response) {
            const movimientos = response.data;
            let pagoDia= 0;
            let movAnte = "";
            let optionsMv = movimientos.map((n) => {
                let mov = {};
                if(n.flag_liquidado === 'S' && moment(n.fecha_movimiento) < moment(self.state.fechaBusqueda)){
                    self.setState({
                        AvisoDisplay: 'block'
                    });
                }
                if(moment(n.fecha_movimiento).format('YYYY-MM-DD') === moment(self.state.fechaBusqueda).format('YYYY-MM-DD')){
                    mov['id_pago'] = n.id_movimiento;
                    mov['tipo_movimiento'] = n.tipo_movimiento;
                    mov['cliente'] = n.cliente_descripcion_gasto;
                    mov['pago'] = n.monto;
                    mov['flag_liquidado'] = n.flag_liquidado;
                    pagoDia = parseFloat(pagoDia) + parseFloat(n.monto);
                }else{
                    movAnte = movAnte + ", "+moment(n.fecha_movimiento).format('YYYY-MM-DD');
                }
                return mov;
            });
            self.setState({
                movimientos: optionsMv,
                pagoDia:pagoDia,
                movAnte:movAnte
            });
        }).catch(function (error) {
          console.log(error);
        })
        .then(function () {
            self.setState({
                id_trabajadorBuscado : id_trabajador
            });
        })
    };

    abrirModalInfo = (id_trabajador) =>{
        this.setState({
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            showModalInformation: true
        });
        this.llenarModal(id_trabajador);
    };

    liquidarPago = (id_pago, tipo_movimiento) => {
        let self = this;
        let linkPost = "";
        if(tipo_movimiento === 'Pagos') linkPost = 'https://edutafur.com/sgp/public/pagos/liquidar';
        if(tipo_movimiento === 'Gastos') linkPost = 'https://edutafur.com/sgp/public/gastos/liquidar';
        if(tipo_movimiento === 'prestamos') linkPost = 'https://edutafur.com/sgp/public/prestamos/liquidar';

        axios.post(linkPost, {
            id: id_pago
          })
          .then(function (response) {
            let change = {};
            change[`ButtonLiquidar${tipo_movimiento}${id_pago}`] = "color: danger";
            self.setState(change)
            alert(response.data.mensaje);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    regresarMenu = () => {
        this.setState({
            redirectMainAdmin: true,
        });
    };
    
    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
        this.llenarModal(this.state.id_trabajadorBuscado);
    };

    closeModal = () => {
        this.setState({
            showModalInformation: false,
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            AvisoDisplay: 'none'
        });
    };

    render(){
        const { redirectLogin, redirectMainAdmin, 
            columnsTable, trabajadores, fechaBusqueda,
            AvisoDisplay, movimientos, pagoDia
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
                <Login />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password} />
            );
        }
        return(
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
                        <h1 className="display-6">Lista de Trabajadores</h1>
                        <br />
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                                <Table style={fontSize}>
                                    <Thead>
                                        <Tr>
                                            <Th>{columnsTable.dni}</Th>
                                            <Th>{columnsTable.nombreCompleto}</Th>
                                            <Th>{columnsTable.telefono}</Th>
                                            <Th>{columnsTable.verDatos}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                    {trabajadores.map(function(item, key) {
                                        return (
                                            <Tr key = {key}>
                                                <Td >{item.dni}</Td>
                                                <Td >{item.nombreCompleto}</Td>
                                                <Td>{item.telefono}</Td>
                                                <Td>
                                                    <Button
                                                        block
                                                        onClick = {() => { self.abrirModalInfo(item.id_trabajador)}}
                                                    >
                                                        VER
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
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
                        <br /><br />
                    </div>
                </div>
                <Modal isOpen={this.state.showModalInformation} style={customStyles} centered size = "lg">
                    <ModalHeader  toggle={this.closeModal}>
                        Confirmación de Datos
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right" style={{marginTop: '7px'}}>
                                    <Label>Fecha para Liquidar :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Input
                                        type="date"
                                        name="fechaBusqueda"
                                        id="fechaBusquedaInput"
                                        value={fechaBusqueda}
                                        onChange={this.handleChange}
                                        />
                                </div>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col  md={4}>
                                <div className="text-center">
                                    <Label><b>Nombre de Cliente</b></Label>
                                </div>
                            </Col>
                            <Col  md={2}>
                                <div className="text-center">
                                    <Label><b>Movimiento</b></Label>
                                </div>
                            </Col>
                            <Col  md={3}>
                                <div className="text-center">
                                    <Label><b>Monto de Cobro</b></Label>
                                </div>
                            </Col>
                            <Col  md={3}>
                                <div className="text-center">
                                    <Label><b>Liquidar</b></Label> 
                                </div>
                            </Col>
                        </Row>
                        {movimientos.map(function(item, key) {
                            if(item.cliente !== undefined){
                                let styleButton = "";
                                if(item.flag_liquidado === 'S') styleButton = 'success';
                                if(item.flag_liquidado === 'N') styleButton = 'danger';
                                return (
                                    <Row key={key}>
                                    <Col  md={4}>
                                        <div className="text-center">
                                            <Label>{item.cliente}</Label>
                                        </div>
                                    </Col>
                                    <Col  md={2}>
                                        <div className="text-center">
                                            <Label>{item.tipo_movimiento}</Label>
                                        </div>
                                    </Col>
                                    <Col  md={3}>
                                        <div className="text-center">
                                            <Label>S/. {item.pago}</Label>
                                        </div>
                                    </Col>
                                    <Col  md={3}>
                                        <Button
                                        name={`ButtonLiquidar${item.tipo_movimiento}${item.id_pago}`}
                                        block
                                        color = {styleButton}
                                        onClick= {() => { self.liquidarPago(item.id_pago, item.tipo_movimiento)}}
                                        >
                                        LIQUIDAR
                                        </Button>
                                    </Col>
                                    </Row>
                                )
                            }else{
                                return (
                                    <div></div>
                                )
                            }
                        })}
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label><b>Monto Total del día:</b></Label>
                                </div>
                            </Col>
                            <Col  md={3}>
                                <div className="text-center">
                                    <Label><b>S/. {parseFloat(pagoDia)}</b></Label>
                                </div>
                            </Col>
                        </Row>
                        <div className="text-right">
                            <Button>
                                LIQUIDAR DÍA
                            </Button>
                        </div>
                        <br/>
                        <Label style={{color: '#B40404', display: AvisoDisplay}}>Tiene días anteriores sin liquidar ({this.state.movAnte})</Label>
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

export default ListarTrabajadores;