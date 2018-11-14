import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button
} from 'reactstrap';
import Login from "./login";

class MainAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false
        }
    }
    openMovimientos = () =>{

    };

    openClientes = () => {

    };

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    render() {
        const { redirectLogin} = this.state;
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
                        <Row>
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <br/>
                                <h1 className="display-6">Menú</h1>
                                <br/><br/>
                                <div>
                                        <Button
                                            size="lg"
                                            onClick={this.openMovimientos}
                                        >
                                            MOVIMIENTOS
                                        </Button>
                                    <span> </span>
                                        <Button
                                            size="lg"
                                            onClick={this.openClientes}
                                        >
                                            CLIENTES
                                        </Button>
                                </div>
                                <br/>
                                <div>
                                    <Button
                                        size="lg"
                                        onClick={this.openMovimientos}
                                    >
                                        CREAR USUARIO
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openClientes}
                                    >
                                        ANULAR USUARIO
                                    </Button>
                                </div>
                                <br/>
                                <div>
                                    <Button
                                        size="lg"
                                        onClick={this.openMovimientos}
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openClientes}
                                    >
                                        COBRAR
                                    </Button>
                                </div>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                        <br/> <br/>
                    </div>
                </div>
                <br/><br/><br/> <br/> <br/> <br/>
            </div>
        )
    }
}
export default MainAdmin;