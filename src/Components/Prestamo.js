import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input,FormFeedback, Label,Button,
    Row, Col,
    ModalFooter, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import Login from "./Login";
import MainVendedor from "./MainRecogedor";
import MainAdmin from "./MainAdmin";
import moment from "moment";
const axios = require('axios');
class Prestamo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            idCliente:this.props.idClienteBuscado,
            idTrabajador: this.props.id_trabajador,

            redirectLogin:false,
            redirectMainPrestamista:false,
            redirectMainAdmin:false,

            montoPorPrestar: 0,
            montoACobrar: 0,
            montoTotalPrestado: 0,
            nro_cuotas: 24,
            fechaUltimoPago:"",

            montoActual: [this.props.saldo],
            fechaPrestamo : moment().format('DD-MM-YYYY'),

            validate:{
                montoPorPrestar:null,
                nro_cuotas: null
            },

            showModalConfirmation:false
        }
    }

    componentWillMount() {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamo/fechaVencimiento',{
            params: {
                nroCuota : this.state.nro_cuotas
            }
        })
          .then(function (response) {
              self.setState({
                fechaUltimoPago : response.data
              })
            
          });
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
        if(event.target.name === 'nro_cuotas'){
            let change = {};
            let self = this;
            change[event.target.name] = event.target.value;
            this.setState(
                change
            );
            axios.get('https://edutafur.com/sgp/public/prestamo/fechaVencimiento',{
                params: {
                    nroCuota : event.target.value
                }
            })
              .then(function (response) {
                  self.setState({
                    fechaUltimoPago : response.data
                  })
                
              });
        }else{
            let change = {};
            change[event.target.name] = event.target.value;
            const montoACobrar = Math.round((parseFloat(event.target.value)*1.2) * 100) / 100;
            this.setState(
                change
            );
            this.setState({
                montoACobrar : montoACobrar
            }
            );
        }
        
    };

    confirmarPrestarDinero = () => {
        const { montoPorPrestar, montoActual, validate, nro_cuotas } = this.state;
        if(parseFloat(montoPorPrestar) > parseFloat(montoActual)){
            alert("El monto de préstamo excede a su saldo actual, va a usar dinero extra")
        }
            if(montoPorPrestar === "" ||  parseFloat(montoPorPrestar) === 0){
                alert("Indicar monto");
            }else{
                validate.montoPorPrestar = "has-success";
                if(nro_cuotas === "" ){
                    validate.nro_cuotas = "has-danger";
                }else{
                    validate.nro_cuotas = "has-success";
                    this.setState({
                        validate:validate,
                        showModalConfirmation:true
                    });
                }
                
            }
        
    };

    enviarDatosPrestamo = () => {
        const { idCliente, idTrabajador, montoPorPrestar, nro_cuotas } = this.state;
        let self = this;
        axios.post('https://edutafur.com/sgp/public/prestamos/agregar', {
            idTrabajador: idTrabajador,
            idCliente: idCliente,
            montoPrestamo: montoPorPrestar,
            nroCuota: nro_cuotas
          })
          .then(function (response) {
              if(response.status === 200){
                  alert(response.data.mensaje);
                  if (response.data.mensaje !== "No se puede registrar el prestamo porque actualmente cuenta con una deuda actual"){
                      if (self.props.rol === "admin"){
                          self.setState({
                                redirectMainAdmin: true,
                            });
                        }
                        if(self.props.rol === "prestamista"){
                            self.setState({
                                redirectMainPrestamista: true,
                            });
                        }
                    }
              }
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    closeModal = () => {
        this.setState({
            showModalConfirmation: false
        });
    };

    render() {
        const {
            redirectLogin,
            redirectMainPrestamista,
            redirectMainAdmin,
            montoActual,
            montoPorPrestar,
            validate,
            montoACobrar,
            fechaPrestamo,
            montoTotalPrestado,
            nro_cuotas,
            fechaUltimoPago
        } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
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
                <MainVendedor id_trabajador={this.props.id_trabajador}  username={this.props.username} password={this.props.password}  />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador = {this.props.id_trabajador}  username={this.props.username} password={this.props.password}  />
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
                    <div className="container text-center" style={panelVendedor}>
                        <h1 className="display-6">Saldo : S/ {montoActual}</h1>
                        <h1 className="display-4">Cliente a prestar</h1>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Apellidos</Label>
                                            <Input
                                                name="apellidoPaternoBuscado"
                                                id="apellidoPaternoBuscadoInput"
                                                value={this.props.apellidoPaternoBuscado +" "+ this.props.apellidoMaternoBuscado}
                                            readOnly
                                        />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Nombre</Label>
                                            <Input
                                                name="apellidoMaternoBuscado"
                                                id="apellidoMaternoBuscado"
                                                value={this.props.nombreBuscado}
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Moneda</Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="selectDinero">
                                                <option>SOLES ( S/.)</option>
                                            </Input>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Monto a prestar</Label>
                                            <Input
                                                name="montoPorPrestar"
                                                id="montoPorPrestarInput"
                                                value={montoPorPrestar}
                                                placeholder=""
                                                type="number"
                                                invalid={validate.montoPorPrestar === "has-danger"}
                                                valid={validate.montoPorPrestar === "has-success"}
                                                onChange={this.handleChange}
                                                autoFocus
                                            />
                                            <FormFeedback invalid>Supera el saldo actual</FormFeedback>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-left">
                                        <Label>Número de cuotas</Label>
                                        <Input
                                            name="nro_cuotas"
                                            id="nro_cuotasInput"
                                            value={nro_cuotas}
                                            type="number"
                                            onChange={this.handleChange}
                                        />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-left">
                                        <Label>Monto a cobrar</Label>
                                        <Input
                                            name="montoACobrar"
                                            id="montoACobrarInput"
                                            value={montoACobrar}
                                            readOnly
                                        />
                                        </div>
                                    </Col>
                                </Row>
                                    <div className="text-left">
                                        <Label>Última fecha a pagar</Label>
                                        <Input
                                            name="fechaUltimoPago"
                                            id="fechaUltimoPagoInput"
                                            value={fechaUltimoPago}
                                            readOnly
                                        />
                                        </div>
                                <br/>
                                <Button
                                    block
                                    onClick={this.confirmarPrestarDinero}
                                    color="info"
                                >
                                    PRESTAR
                                </Button>
                                <Button
                                    block
                                    onClick={this.regresarMenu}
                                    color="danger"
                                >
                                    Regresar
                                </Button>
                                <br/>
                            </Col>
                            <Col md={3}>
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
                                    <Label>{fechaPrestamo}</Label>
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
                                    <Label><b>Monto a prestar :</b></Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label><b>{montoACobrar}</b></Label>
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
                                    <Label>{montoTotalPrestado}</Label>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.enviarDatosPrestamo}
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

export default Prestamo;
