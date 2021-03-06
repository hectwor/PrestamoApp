import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label,
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
import moment from "moment";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
const axios = require('axios');
class MovimientosAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {

            montoActualDiaTotal: 0,
            fechaInicioBusqueda:  moment().format('YYYY-MM-DD'),
            fechaFinBusqueda:  moment().format('YYYY-MM-DD'),

            redirectLogin:false,
            redirectMainAdmin:false,

            movimientos: [],
            columnsTable:
            {
                "Tipo_Movimiento": "Tipo",
                "prestamista": 'Prestamista',
                "cliente": "Cliente",
                "monto_deuda": "Deuda",
                "monto_movimientos": "S/. Movimiento",
                "fecha_movimiento": "Fecha Movimiento",
                "movimiento": "Detalles"
            }
        }
    }

    componentWillMount (){
        let self = this;
        const { fechaInicioBusqueda, fechaFinBusqueda } = this.state;
        let sumaMontoDia= 0;
        axios.get('https://edutafur.com/sgp/public/prestamos/movimientos/buscar', {
            params: {
                fechaInicioBusqueda: fechaInicioBusqueda,
                fechaFinBusqueda: fechaFinBusqueda
            }
        })
            .then(function (response) {
                const mov = response.data;
                let optionsMov = mov.map((n) => {
                    let movs = {};
                    movs['id_movimiento'] = n.id_movimiento;
                    movs['liquidado_movimiento'] = n.liquidado_movimiento;
                    movs['Tipo_Movimiento'] = n.Tipo_Movimiento;
                    movs['prestamista'] = n.prestamista;
                    movs['cliente'] = n.cliente;
                    movs['monto_movimientos'] = n.monto_movimientos;
                    movs['fecha_movimiento'] = n.fecha_movimiento;
                    movs['movimiento'] = n.movimiento;
                    if (n.Tipo_Movimiento === "Recojo") {
                        sumaMontoDia = sumaMontoDia + parseFloat(n.monto_movimientos);
                    }
                    if (n.Tipo_Movimiento === "Prestamo"){
                        sumaMontoDia = sumaMontoDia - parseFloat(n.monto_movimientos);
                    }
                    if (n.Tipo_Movimiento === "Gasto") {
                        sumaMontoDia = sumaMontoDia - parseFloat(n.monto_movimientos);
                    }
                    return movs;
                });
                self.setState({
                    movimientos: optionsMov,
                    montoActualDiaTotal: sumaMontoDia
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

    regresarMenu = ()=>{
        this.setState({
            redirectMainAdmin: true,
        });
    };

    buscarMovimientos =() =>{
        const { fechaInicioBusqueda, fechaFinBusqueda } = this.state;
        let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamos/movimientos/buscar', {
            params: {
                fechaInicioBusqueda: fechaInicioBusqueda,
                fechaFinBusqueda: fechaFinBusqueda
            }
        })
            .then(function (response) {
                const clients = response.data;
                let optionsClients = clients.map((n) => {
                    let client = {};
                    client['id_movimiento'] = n.id_movimiento;
                    client['liquidado_movimiento'] = n.liquidado_movimiento;
                    client['Tipo_Movimiento'] = n.Tipo_Movimiento;
                    client['prestamista'] = n.prestamista;
                    client['cliente'] = n.cliente;
                    client['monto_prestamo'] = n.monto_prestamo;
                    client['monto_movimientos'] = n.monto_movimientos;
                    client['monto_total_recaudado'] = n.monto_total_recaudado;
                    client['fecha_movimiento'] = n.fecha_movimiento;
                    return client;
                });
                self.setState({
                    movimientos: optionsClients
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
    };

    eliminarMovimiento = (id_prestamo, tipo_mov, monto, prestamista, liquidado_movimiento) => {
        if (liquidado_movimiento === 'S'){
            alert('Movimiento ya ha sido liquidado');
        }else{
            var r = window.confirm(`¿Elimina el ${tipo_mov} de s/.${monto} por ${prestamista}?`);
            let self = this;
            console.log([{
                tipo: tipo_mov,
                id: id_prestamo
            }])
            if (r === true) {
                axios.post('https://edutafur.com/sgp/public/eliminarMovimientos', [{
                    tipo: tipo_mov,
                    id: id_prestamo
                }])
                    .then(function (response) {
                        if (response.status === 200) {
                            alert(`Movimiento de ${prestamista} eliminado`);
                            self.componentWillMount();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, 
            montoActualDiaTotal, 
            fechaInicioBusqueda, fechaFinBusqueda,
            columnsTable, movimientos
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
                <MainAdmin id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password}  />
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
                        <h1 className="display-6">Monto del Día Actual</h1>
                        <h1 className="display-6">S/. {montoActualDiaTotal}</h1>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={5}>
                                        <div className="text-left">
                                            <Label>Inicio de Búsqueda</Label>
                                            <Input
                                                type="date"
                                                name="fechaInicioBusqueda"
                                                id="fechaInicioBusquedaInput"
                                                value={fechaInicioBusqueda}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className="text-left">
                                            <Label>Fin de Búsqueda</Label>
                                            <Input
                                                type="date"
                                                name="fechaFinBusqueda"
                                                id="fechaFinBusqueda"
                                                value={fechaFinBusqueda}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="text-left">
                                            <br/>
                                            <Button
                                            onClick={this.buscarMovimientos}
                                            color="info"
                                            >
                                            Buscar
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                            <div style={cuadroCliente}>
                                <Table style={fontSize}>
                                    <Thead>
                                        <Tr>
                                            <Th>{columnsTable.Tipo_Movimiento}</Th>
                                            <Th>{columnsTable.prestamista}</Th>
                                            <Th>{columnsTable.monto_movimientos}</Th>
                                            <Th>{columnsTable.fecha_movimiento}</Th>
                                            <Th>{columnsTable.cliente}</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {movimientos.map(function (item, key) {
                                            return (
                                                <Tr key={key}>
                                                    <Td >{item.Tipo_Movimiento}</Td>
                                                    <Td>{item.prestamista}</Td>
                                                    <Td>s/. {item.monto_movimientos}</Td>
                                                    <Td>{item.fecha_movimiento}</Td>
                                                    <Td>{item.cliente}.</Td>
                                                    <Td>
                                                        <Button
                                                            color="danger"
                                                            size = "sm"
                                                            onClick={() => { self.eliminarMovimiento(item.id_movimiento, item.Tipo_Movimiento, item.monto_movimientos, item.prestamista, item.liquidado_movimiento)}}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            )

                                        })}
                                    </Tbody>
                                </Table>
                                <br/>
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
            </div>
        )
    }
}

export default MovimientosAdmin;