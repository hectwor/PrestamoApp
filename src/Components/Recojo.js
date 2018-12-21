import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input,FormFeedback, Label,Button,Form,
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

            ButtonRefinanciarHidden:true,

            id_prestamo: null,
            dniPasaporteBuscado : this.props.dniPasaporteBuscado,
            montoPorRecoger: {},
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
            let ListClientesMontosPagar = clientes.map((n) => {
                let montosPagar2 = {}
                montosPagar2['id_prestamo'] = n.id_prestamo;
                montosPagar2['monto_por_pagar'] = Math.round((parseFloat(n.monto_deuda)*0.24) * 100) / 100;
                return montosPagar2;
            });
            self.setState({
                clientes : clientes,
                montoPorRecoger : ListClientesMontosPagar
            });
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    jsonConcat = (o1, o2) => {
        for (var key in o2) {
         o1[key] = o2[key];
        }
        return o1;
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

    handleListChange(index, event){
        console.log(index)
        console.log(event)
        var montoPorRecoger = this.state.montoPorRecoger.slice(); // Make a copy of the emails first.
        montoPorRecoger[index] = event.target.value; // Update it with the modified email.
        this.setState({montoPorRecoger: montoPorRecoger}); // Update the state.
    }

    confirmarRecogerDinero = (index, event) => {
        console.log(index)
        console.log(event)
    };

    enviarDatosRecojo = () => {
        const { montoPorRecoger, id_prestamo } = this.state;
        let self = this;
        axios.post('https://edutafur.com/sgp/public/prestamos/pagos/agregar', {
            idPrestamo: id_prestamo,
            montoRecaudado: montoPorRecoger
          })
          .then(function (response) {
              if(response.status === 200){
                  alert(`Recojo de valor S/. ${montoPorRecoger} guardado`);
                  self.regresarMenu();
              }
          })
          .catch(function (error) {
            console.log(error);
          });
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
            validate,
            saldoFaltante,
            montoPrestado,
            fechaRecojo,
            ButtonRefinanciarHidden,
            clientes, montoRecoger
        } = this.state;
        const panelVendedor = {
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
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
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
                                                        value={montoPorRecoger[key]['monto_por_pagar']}
                                                        onChange={() => {self.handleListChange.bind(this, item.id_prestamo)}}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => { self.confirmarRecogerDinero(montoPorRecoger[key]['monto_por_pagar'], item.id_prestamo)}}
                                                    >
                                                        Recoger
                                                    </Button>
                                                        <span> </span>
                                                        <Button
                                                            size="sm"
                                                            hidden
                                                        >
                                                        Ver
                                                    </Button>
                                                </Form>
                                                
                                            </Td>
                                        </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal isOpen={this.state.showModalConfirmation} style={customStyles} centered size = "mg">
                    <ModalHeader  toggle={this.closeModal}>
                        Confirmación de Datos
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Nombre de Prestamista :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{this.props.username}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Fecha :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{fechaRecojo}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Nombre de Cliente :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{this.props.apellidoPaternoBuscado} {this.props.apellidoMaternoBuscado}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto a recoger :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{montoPorRecoger}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto total prestado :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{montoPrestado}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label>Monto faltante :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{saldoFaltante}</Label>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.enviarDatosRecojo}
                            color="info"
                        >
                            Aceptar
                        </Button>
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

export default Recojo;
