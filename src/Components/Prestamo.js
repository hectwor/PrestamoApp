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
class Prestamo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMainPrestamista:false,
            redirectMainAdmin:false,

            montoPorPrestar: 0,
            montoACobrar: 0,
            montoTotalPrestado: 0,

            montoActual: [this.props.saldo],
            fechaPrestamo : moment().format('DD-MM-YYYY'),

            validate:{
                montoPorPrestar:null
            },

            showModalConfirmation:false
        }
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
        this.setState(change)
    };

    confirmarPrestarDinero = () => {
        const { montoPorPrestar, montoActual, validate } = this.state;
        if(parseFloat(montoPorPrestar) > parseFloat(montoActual)){
            validate.montoPorPrestar = "has-danger";
            this.setState({validate});
        }else{
            if(montoPorPrestar === "" ||  parseFloat(montoPorPrestar) === 0){
                alert("Indicar monto");
            }else{
                validate.montoPorPrestar = "has-success";
                this.setState({
                    validate:validate,
                    showModalConfirmation:true
                });
            }
        }
    };

    enviarDatosPrestamo = () => {

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
            montoTotalPrestado
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
                <MainVendedor username={this.props.username} password={this.props.password}  />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin username={this.props.username} password={this.props.password}  />
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
                                <div className="text-left">
                                    <Label>Monto a cobrar</Label>
                                    <Input
                                        name="montoACobrar"
                                        id="montoACobrarInput"
                                        value={montoACobrar}
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
                                    <Label>Monto a prestar :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Label>{montoPorPrestar}</Label>
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
