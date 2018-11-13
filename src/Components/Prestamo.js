import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav
} from 'reactstrap';
import { Button } from "react-bootstrap";
import Login from "./login";
import MainVendedor from "./mainVendedor";
class Prestamo extends Component{
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMain:false,

            montoActual: [this.props.saldo]
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

    render() {
        const { redirectLogin, redirectMain, montoActual } = this.state;
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
                        <h1 className="display-4">Préstamo</h1>
                        <h1 className="display-6">Saldo : S/ {montoActual}</h1>
                        <Button
                            block
                            bsSize="large"
                            onClick={this.regresarMenu}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Prestamo;
