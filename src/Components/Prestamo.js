import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input,FormFeedback, Label,
    Row, Col
} from 'reactstrap';
import { Button } from "react-bootstrap";
import Login from "./Login";
import MainVendedor from "./MainRecogedor";
class Prestamo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMain:false,

            montoPorPrestar: 0,
            montoACobrar: 0,

            montoActual: [this.props.saldo],

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
        this.setState({
            redirectMain: true,
        });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    prestarDinero = () => {
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

    render() {
        const { redirectLogin, redirectMain, montoActual, montoPorPrestar, validate, montoACobrar } = this.state;
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
                                    bsSize="large"
                                    onClick={this.prestarDinero}
                                    bsStyle="success"
                                >
                                    PRESTAR
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
                            <Col md={3}>
                            </Col>
                        </Row>

                    </div>
                </div>
            </div>
        )
    }
}

export default Prestamo;
