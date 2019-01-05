import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input, Label,Button,Form,
    Row, Col,
    ModalFooter, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Login from "./Login";
import MainVendedor from "./MainRecogedor";
import MainAdmin from "./MainAdmin";
import moment from "moment";
const axios = require('axios');

class Recojo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMainPrestamista:false,
            redirectMainAdmin:false,

            clientes:[],
            infoCliente:[],
            infoPagosCliente:[],

            ButtonRefinanciarHidden:{},

            id_prestamo: null,
            dniPasaporteBuscado : this.props.dniPasaporteBuscado,
            montoPorRecoger: {},
            ButtonmontoRecoger:{},
            saldoFaltante: 0,
            montoPrestado: 0,
            montoPrestamoVer:0,
            fechaPrestamoVer:null,
            fechaRecojo:   moment().format('DD-MM-YYYY'),

            montoActual: [this.props.saldo],

            validate:{
                montoPorRecoger:null
            },

            showModalClienteInfo:false,
            showModalPagosInfo:false
        }
        this.handleListChange = this.handleListChange.bind(this);
    }

    componentWillMount (){
        let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamos/clientes',{
            params: {
                idTrabajador : this.props.id_trabajador
            }
        })
          .then(function (response) {
            const clientes = response.data;
            let ButtonColor=[];
            let ButtonHidden=[];
            let ListClientesMontosPagar = clientes.map((n) => {
                let montosPagar2 = {}
                montosPagar2['id_prestamo'] = n.id_prestamo;
                montosPagar2['monto_por_pagar'] = Math.round((parseFloat(n.monto_deuda)/24) * 100) / 100;
                let ButtonColor2={};
                let ButtonHidden2 = {}
                ButtonColor2['id_prestamo'] = n.id_prestamo;
                ButtonHidden2['id_prestamo'] = n.id_prestamo;
                if(moment(n.fecha_ultimo_pago).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')){ 
                    ButtonColor2['color'] = 'success';
                }else{
                    ButtonColor2['color'] = 'danger';
                }
                if(moment(n.fecha_vencimiento) < moment()){ 
                    ButtonHidden2['hidden'] = false;
                }else{
                    ButtonHidden2['hidden'] = true;
                }
                ButtonColor = ButtonColor.concat(ButtonColor2);
                ButtonHidden = ButtonHidden.concat(ButtonHidden2);
                return montosPagar2;
            });
            self.setState({
                clientes : clientes,
                montoPorRecoger : ListClientesMontosPagar,
                ButtonmontoRecoger: ButtonColor,
                ButtonRefinanciarHidden: ButtonHidden
            });
          })
          .catch(function (error) {
            console.log(error);
          });

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
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    regresarMenu = ()=>{
        if(this.props.rol === "admin"){
            this.setState({
                redirectMainAdmin: true,
            });
        }
        if(this.props.rol === "prestamista"){
            this.setState({
                redirectMainPrestamista: true,
            });
        }
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        if(event.target.name === "montoPorRecoger"){
            change[event.target.name] = parseFloat(event.target.value);
        }
        this.setState(change)
    };

    handleListChange(event, index){
        var montoPorRecoger = this.state.montoPorRecoger.slice();
        montoPorRecoger[index]['monto_por_pagar'] = event.target.value;
        this.setState({montoPorRecoger: montoPorRecoger});
    }

    confirmarRecogerDinero = (monto_pagar, id_prestamo, cliente) => {
        if(monto_pagar === '0' || monto_pagar === null || monto_pagar === ""){
            alert('Monto 0 o vacío');
        }else{
            let self = this;
            var r = window.confirm(`Confirma el recojo?\n\nCliente: ${cliente}\nMonto a recoger: s/. ${monto_pagar}`);
            if (r === true) {
                axios.post('https://edutafur.com/sgp/public/pagos/agregar', {
                    idPrestamo: id_prestamo,
                    idTrabajador: this.props.id_trabajador,
                    montoRecaudado: monto_pagar
                  })
                  .then(function (response) {
                      
                      if(response.status === 200){
                        alert(`Recojo de valor S/. ${monto_pagar} realizado`);
                        self.componentWillMount();
                      }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        }
    };

    verInfoCliente = (id_cliente, prestado, faltante) => {
        if(prestado === faltante){
            alert("No registra ningún pago")
        }else{
            let self = this;
            axios.get('https://edutafur.com/sgp/public/prestamos/clientes', {
                params: {
                    idCliente: id_cliente
                }
            })
                .then(function (response) {
                    const prestamos = response.data;
                    let idprestamoActivo;
                    for (let i = 0; i < Object.keys(prestamos).length; i++) {
                        if (prestamos[i].cancelado === 'N') {
                            idprestamoActivo = prestamos[i].id_prestamo;
                        }
                    }
                    axios.get('https://edutafur.com/sgp/public/consultarPagos', {
                        params: {
                            idPrestamo: idprestamoActivo
                        }
                    })
                        .then(function (response) {
                            self.setState({
                                infoPagosCliente: response.data,
                                montoPrestamoVer: response.data[0].monto_prestamo,
                                fechaPrestamoVer: response.data[0].fecha_prestamo,
                                showModalPagosInfo: true
                            });
                        });
                });
        }
    };

    refinanciar = (id_prestamo, cliente) => {
        let self = this;
        console.log(id_prestamo)
        axios.get('https://edutafur.com/sgp/public/consultarRefinanciamiento',{
            params: {
                idPrestamo: id_prestamo
            }
        }).then(function (response){
            console.log(response.data);
            var r = window.confirm(`Confirma el refinamiento?\n\nCliente: ${cliente}\nMonto a refinanciar: s/. ${response.data.monto_refinanciado}\nMonto a cobrar: s/. ${response.data.monto_total_cobrar}\nFecha vencimiento: ${response.data.fecha_vencimiento}`);
            if (r === true) {
                axios.post('https://edutafur.com/sgp/public/realizarRefinanciamiento', {
                    idPrestamo: id_prestamo
                })
                    .then(function (response) {
                        console.log(response)
                        if (response.status === 200) {
                            alert(response.data.mensaje);
                            self.componentWillMount();
                        }
                    })
                    .catch(function (error) {
                        alert(error.status);
                    });
            }
        }).catch(function(error){
            alert(error.status);
        })
    }

    handleClickTr = (id_prestamo) => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/consultarPagos', {
            params: {
                idPrestamo: id_prestamo
            }
        })
            .then(function (response) {
                self.setState({
                    infoPagosCliente: response.data,
                    showModalPagosInfo: true
                });
            });
    }

    closeModal = () => {
        this.setState({
            showModalClienteInfo: false
        });
    };
    regresar = () => {
        this.setState({
            showModalPagosInfo: false
        });
    };

    render() {
        const { redirectLogin,
            redirectMainPrestamista,
            redirectMainAdmin,
            montoActual,
            montoPorRecoger,
            ButtonRefinanciarHidden,
            clientes, infoCliente, infoPagosCliente,
            ButtonmontoRecoger
        } = this.state;
        const panelVendedor = {
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
        const cuadroCliente = {
            height: "400px",
            overflowY: "scroll"
        };
        const inputStyle = {
            width: 100
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectMainPrestamista) {
            return (
                <MainVendedor  id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password} />
            );
        }

        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador}  username={this.props.username} password={this.props.password} />
            );
        }
        let self = this;
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
                    <div className="container text-center" style={panelVendedor}>
                        <h1 className="display-6">Saldo : S/ {montoActual}</h1>
                        <h1 className="display-4">Clientes por recoger</h1>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                            <br/>
                                <div style={cuadroCliente}>
                            <Table  style={fontSize}>
                                <Thead>
                                    <Tr>
                                        <Th><b>Nombre Cliente</b></Th>
                                        <Th><b>Prestado</b></Th>
                                        <Th><b>Faltante</b></Th>
                                        <Th><b>Fecha Vencimiento</b></Th>
                                        <Th><b>Cobro</b></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                {clientes.map(function(item, key) {
                                    return (
                                        <Tr key = {key}>
                                            <Td >{item.cliente}</Td>
                                            <Td >s/. {item.monto_deuda}</Td>
                                            <Td>s/. {item.monto_deuda_restante}</Td>
                                            <Td>{moment(item.fecha_vencimiento).format('DD-MM-YYYY')}</Td>
                                            <Td>
                                                <Form inline>
                                                    <Label>s/. </Label>
                                                    <Input
                                                        type="number"
                                                        id={"montoPorRecoger"+montoPorRecoger[key]['id_prestamo']}
                                                        name={"montoPorRecoger"+montoPorRecoger[key]['id_prestamo']}
                                                        value={montoPorRecoger[key]['monto_por_pagar']}
                                                        style={inputStyle}
                                                        onChange={(e) => {self.handleListChange(e, key)}}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        id={"ButtonmontoPorRecoger"+montoPorRecoger[key]['id_prestamo']}
                                                        name={"ButtonmontoPorRecoger"+montoPorRecoger[key]['id_prestamo']}
                                                        color={ButtonmontoRecoger[key]['color']}
                                                        onClick={() => { self.confirmarRecogerDinero(montoPorRecoger[key]['monto_por_pagar'], item.id_prestamo, item.cliente)}}
                                                    >
                                                        Recoger
                                                    </Button>
                                                        <span> </span>
                                                    <Button
                                                        size="sm"
                                                        id={"ButtonVerCliente" + montoPorRecoger[key]['id_prestamo']}
                                                        name={"ButtonVerCliente" + montoPorRecoger[key]['id_prestamo']}
                                                        onClick={() => { self.verInfoCliente(item.id_cliente, item.monto_deuda, item.monto_deuda_restante) }}
                                                    >
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        id={"ButtonRefinanciar"+montoPorRecoger[key]['id_prestamo']}
                                                        name={"ButtonRefinanciar"+montoPorRecoger[key]['id_prestamo']}
                                                        size="sm"
                                                        color="warning"
                                                        disabled={ButtonRefinanciarHidden[key]['hidden']}
                                                        onClick={() => { self.refinanciar(item.id_prestamo, item.cliente)}}
                                                    >
                                                    Refinanciar
                                                    </Button>
                                                </Form>
                                            </Td>
                                        </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                                </div>
                            <br/>
                            <Button
                                    block
                                    onClick={this.regresarMenu}
                                    color="danger"
                                >
                                    Regresar
                                </Button>
                                <br/>
                            </Col>
                            <Col md={1}>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal isOpen={this.state.showModalClienteInfo} centered size="lg">
                    <ModalHeader toggle={this.closeModal}>
                        Información préstamos de Cliente
                    </ModalHeader>
                    <ModalBody>
                        <Table style={fontSize}>
                            <Thead>
                                <Tr className="text-center">
                                    <Th><b>Cancelado</b></Th>
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
                                {infoCliente.map(function(item, key){
                                    return(
                                        <Tr key={key} className="text-center" style={{ cursor: 'pointer' }} onClick={() => { self.handleClickTr(item.id_prestamo) }} >
                                            <Td>{item.cancelado}</Td>
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
                            onClick={this.closeModal}
                            color="danger"
                        >
                            Salir
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.showModalPagosInfo} centered size="mg">
                    <ModalHeader toggle={this.regresar}>
                        Pagos de préstamo seleccionado
                    </ModalHeader>
                    <ModalBody>
                        <Label><b>Monto Préstamo</b>: s/. {this.state.montoPrestamoVer}</Label><br/>
                        <Label><b>Fecha Préstamo</b>: {this.state.fechaPrestamoVer}</Label>
                        <div style={cuadro}>
                            <Table style={fontSize}>
                                <Thead>
                                    <Tr className="text-center">
                                        <Th><b>Pago</b></Th>
                                        <Th><b>Faltante</b></Th>
                                        <Th><b>Fecha Pago</b></Th>
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

export default Recojo;
