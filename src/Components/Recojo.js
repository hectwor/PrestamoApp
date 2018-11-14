import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input,FormFeedback, Label,
    Row, Col
} from 'reactstrap';
import { Button } from "react-bootstrap";
import Login from "./login";
import MainVendedor from "./mainRecogedor";
class Recojo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMain:false,

            montoPorRecoger: 0,
            saldoFaltante: 0,
            montoPrestado: 0,

            montoActual: [this.props.saldo],

            validate:{
                montoPorRecoger:null
            },

            showModalConfirmation:false
        }
    }

    componentWillMount (){
        //SOLICITAR INFO
        this.setState({
            montoPrestado: 1000.00,
            saldoFaltante: 500.00
        });
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    regresarMenu = ()=>{
        this.setState({
            redirectMain: true,
        });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    recogerDinero = () => {
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

    render() {
        const { redirectLogin, redirectMain, montoActual, montoPorRecoger, validate, saldoFaltante, montoPrestado } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectMain) {
            return (
                <MainVendedor  username={this.props.username} />
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
                            <Col md={4}>
                            </Col>
                            <Col md={4}>
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
                                    bsSize="large"
                                    onClick={this.recogerDinero}
                                    bsStyle="success"
                                >
                                    RECOGER
                                </Button>
                                <Button
                                    block
                                    bsSize="large"
                                    onClick={this.regresarMenu}
                                    bsStyle="danger"
                                >
                                    Regresar
                                </Button>
                                <br/>
                            </Col>
                            <Col md={4}>
                            </Col>
                        </Row>

                    </div>
                </div>
                <br/><br/>
            </div>
        )
    }
}

export default Recojo;