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
        const buttonSize = {
            height: '60px',
            width: '230px',
            marginBottom: '20px',
            marginRight: '10px',
            marginLeft: '10px'
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
                               
                                <br/>
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
                                <br/>
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
                <br/><br/><br/> <br/> <br/> <br/>
            </div>
        )
    }
}
export default MainAdmin;