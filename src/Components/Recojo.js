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

class Recojo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMainPrestamista:false,
            redirectMainAdmin:false,

            id_prestamo: null,
            dniPasaporteBuscado : this.props.dniPasaporteBuscado,
            montoPorRecoger: 0,
            saldoFaltante: 0,
            montoPrestado: 0,
            fechaRecojo:   moment().format('DD-MM-YYYY'),

            montoActual: [this.props.saldo],

            validate:{
                montoPorRecoger:null
            },

            showModalConfirmation:false
        }
    }

    componentWillMount (){
        let self = this;
        axios.get('https://edutafur.com/sgp/public/prestamos/clientes/buscar', {
            params: {
                dniPasaporteApellidoBuscado: this.state.dniPasaporteBuscado
            }
          })
          .then(function (response) {
            self.setState({
                id_prestamo : response.data[0].id_prestamo,
                montoPrestado: response.data[0].monto_deuda,
                saldoFaltante: response.data[0].monto_deuda_restante
            });
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

    confirmarRecogerDinero = () => {
        const { montoPorRecoger, saldoFaltante, validate } = this.state;
        if(parseFloat(montoPorRecoger) > parseFloat(saldoFaltante)){
            validate.montoPorRecoger = "has-danger";
            this.setState({validate});
        }else{
            if(montoPorRecoger === "" ||  parseFloat(montoPorRecoger) === 0){
                alert("Indicar monto");
            }else{
                validate.montoPorRecoger = "has-success";
                this.setState({
                    validate:validate,
                    showModalConfirmation:true
                });
            }
        }
    };

    enviarDatosRecojo = () => {
        const { montoPorRecoger, id_prestamo } = this.state;
        let self = this;
        axios.post('https://edutafur.com/sgp/public/pagos/agregar', {
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
            fechaRecojo
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
                <MainVendedor  id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password} />
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
                    <div className="container text-center" style={panelVendedor}>
                        <h1 className="display-6">Saldo : S/ {montoActual}</h1>
                        <h1 className="display-4">Cliente para recoger</h1>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Apellido Paterno</Label>
                                            <Input
                                                name="apellidoPaternoBuscado"
                                                id="apellidoPaternoBuscadoInput"
                                                value={this.props.apellidoPaternoBuscado}
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Apellido Materno</Label>
                                            <Input
                                                name="apellidoMaternoBuscado"
                                                id="apellidoMaternoBuscado"
                                                value={this.props.apellidoMaternoBuscado}
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Monto Prestado</Label>
                                            <Input
                                                name="montoPrestado"
                                                id="montoPrestadoInput"
                                                value={`S/. ${montoPrestado}`}
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-left">
                                            <Label>Saldo Faltante</Label>
                                            <Input
                                                name="saldoFaltante"
                                                id="saldoFaltanteInput"
                                                value={`S/. ${saldoFaltante}`}
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
                                            <Label>Monto a recoger</Label>
                                            <Input
                                                name="montoPorRecoger"
                                                id="montoPorRecogerInput"
                                                value={montoPorRecoger}
                                                placeholder=""
                                                type="number"
                                                invalid={validate.montoPorRecoger === "has-danger"}
                                                valid={validate.montoPorRecoger === "has-success"}
                                                onChange={this.handleChange}
                                                autoFocus
                                            />
                                            <FormFeedback invalid>Supera el saldo faltante</FormFeedback>
                                        </div>
                                    </Col>
                                </Row>
                                <br/>
                                <Button
                                    block
                                    onClick={this.confirmarRecogerDinero}
                                    color="info"
                                >
                                    RECOGER
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
