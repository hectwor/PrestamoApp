import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label
} from 'reactstrap';
import Login from "./login";

class MovimientosAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {

            montoActualDiaTotal: 0,

            redirectLogin:false
        }
    }

    componentWillMount (){
        //SOLICITAR INFO
        this.setState({
            montoActualDiaTotal: "10000.00"
        });
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    render() {
        const { redirectLogin, montoActualDiaTotal } = this.state;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        if (redirectLogin) {
            return (
                <Login  />
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

export default MovimientosAdmin;