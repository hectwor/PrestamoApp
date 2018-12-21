import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input, Label,Button,Form,
    Row, Col
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

            ButtonRefinanciarHidden:{},

            id_prestamo: null,
            dniPasaporteBuscado : this.props.dniPasaporteBuscado,
            montoPorRecoger: {},
            ButtonmontoRecoger:{},
            saldoFaltante: 0,
            montoPrestado: 0,
            fechaRecojo:   moment().format('DD-MM-YYYY'),

            montoActual: [this.props.saldo],

            validate:{
                montoPorRecoger:null
            },

            showModalConfirmation:false,
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
                montosPagar2['monto_por_pagar'] = Math.round((parseFloat(n.monto_deuda)*0.24) * 100) / 100;
                let ButtonColor2={};
                let ButtonHidden2 = {}
                ButtonColor2['id_prestamo'] = n.id_prestamo;
                ButtonHidden2['id_prestamo'] = n.id_prestamo;
                if(moment(n.fecha_ultimo_pago).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')){ 
                    ButtonColor2['color'] = 'success';
                }else{
                    ButtonColor2['color'] = 'danger';
                }
                if(moment(n.fecha_vencimiento).format('DD-MM-YYYY') < moment().format('DD-MM-YYYY')){ 
                    ButtonHidden2['hidden'] = true;
                }else{
                    ButtonHidden2['hidden'] = false;
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
        console.log(monto_pagar)
        console.log(id_prestamo)
        console.log(cliente)
        if(monto_pagar === '0' || monto_pagar === null || monto_pagar === ""){
            alert('Monto 0 o vacío');
        }else{
            let self = this;
            var r = window.confirm(`Confirma el recojo?\n\nCliente: ${cliente}\nMonto a recoger: s/. ${monto_pagar}`);
            if (r === true) {
                console.log({idPrestamo: id_prestamo,
                    montoRecaudado: monto_pagar})
                axios.post('https://edutafur.com/sgp/public/pagos/agregar', {
                    idPrestamo: id_prestamo,
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

    refinanciar = () => {

    }

    closeModal = () => {
        this.setState({
            showModalConfirmation: false
        });
    };

    render() {
        const { redirectLogin,
            redirectMainPrestamista,
            redirectMainAdmin,
            montoActual,
            montoPorRecoger,
            ButtonRefinanciarHidden,
            clientes,
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
                            <Table  style={fontSize}>
                                <Thead>
                                    <Tr>
                                        <Th><b>Nombre Cliente</b></Th>
                                        <Th><b>Prestado</b></Th>
                                        <Th><b>Faltante</b></Th>
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
                                                        >
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        id={"ButtonRefinanciar"+montoPorRecoger[key]['id_prestamo']}
                                                        name={"ButtonRefinanciar"+montoPorRecoger[key]['id_prestamo']}
                                                        size="sm"
                                                        color="warning"
                                                        hidden={ButtonRefinanciarHidden[key]['hidden']}
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
            </div>
        )
    }
}

export default Recojo;
