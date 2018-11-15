import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button
} from 'reactstrap';
import Login from "./Login";
import MovimientosAdmin from "./MovimientosAdmin";
import ListarClientes from "./ListarClientes";

class MainAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMovimientosAdmin:false,
            redirectOpenClientes:false
        }
    }
    openMovimientos = () =>{
        this.setState({
            redirectMovimientosAdmin: true,
        });
    };

    openClientes = () => {
        this.setState({
            redirectOpenClientes: true,
        });
    };

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    render() {
        const { redirectLogin, redirectMovimientosAdmin, redirectOpenClientes } = this.state;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        const buttonSize = {
            height: '60px',
            width: '230px',
            marginBottom: '20px',
            marginRight: '6px',
            marginLeft: '6px'
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectOpenClientes) {
            return (
                <ListarClientes  />
            );
        }
        if (redirectMovimientosAdmin) {
            return (
                <MovimientosAdmin  />
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
                        <Row>
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <br/>
                                <h1 className="display-6">Menú Administrador</h1>
                                    <br/><br/>
                                        <Button
                                            size="lg"
                                            onClick={this.openMovimientos}
                                            style={buttonSize}
                                        >
                                            MOVIMIENTOS
                                        </Button>
                                    <span> </span>
                                        <Button
                                            size="lg"
                                            onClick={this.openClientes}
                                            style={buttonSize}
                                        >
                                            CLIENTES
                                        </Button>
                                    <Button
                                        size="lg"
                                        onClick={this.openMovimientos}
                                        style={buttonSize}
                                    >
                                        CREAR USUARIO
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openClientes}
                                        style={buttonSize}
                                    >
                                        MODIFICAR USUARIO
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={this.openMovimientos}
                                        style={buttonSize}
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openClientes}
                                        style={buttonSize}
                                    >
                                        COBRAR
                                    </Button>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                        <br/> <br/>
                    </div>
                </div>
            </div>
        )
    }
}
export default MainAdmin;