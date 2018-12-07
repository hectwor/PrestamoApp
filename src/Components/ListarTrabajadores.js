import React, { Component } from "react";
import {
    Navbar, NavbarBrand, NavItem, NavLink, Nav,
    Row, Col,
    Button
} from 'reactstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Login from "./Login";
import MainAdmin from "./MainAdmin";

class ListarTrabajadores extends Component {
    constructor(props){
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado: "",
            redirectLogin: false,
            redirectMainAdmin: false,

            trabajadores: [],
            columnsTable:
            {
                "dni": "DNI",
                "cliente": 'Cliente',
                "prestamista": "Prestamista",
                "montoP": "Monto Prestado",
                "montoD": "Mondo Deuda",
                "fechaP": "Fecha Préstamo"
            }
        }
    }

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    regresarMenu = () => {
        this.setState({
            redirectMainAdmin: true,
        });
    };

    render(){
        const { redirectLogin, redirectMainAdmin } = this.state;
        let self = this;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        const fontSize = {
            fontSize: 14
        };
        if (redirectLogin) {
            return (
                <Login />
            );
        }
        if (redirectMainAdmin) {
            return (
                <MainAdmin id_trabajador={this.props.id_trabajador} username={this.props.username} password={this.props.password} />
            );
        }
        return(
            <div className="container-fluid">
                <br />
                <Navbar color="light" light expand="md">
                    <NavbarBrand >Bienvenido {this.props.username}</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink onClick={this.Logout} style={{ cursor: "pointer" }}>Salir</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container">
                    <div className="container text-center" style={panelAdmin}>
                        <br />
                        <h1 className="display-6">Lista de Trabajadores</h1>
                        <br />
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                                <Table style={fontSize}>
                                    <Thead>
                                        <Tr>

                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    </Tbody>
                                </Table>
                                <Button
                                    block
                                    onClick={this.regresarMenu}
                                    color="danger"
                                >
                                    Regresar
                                </Button>
                            </Col>
                            <Col md={1}>
                            </Col>
                        </Row>
                        <br /><br />
                    </div>
                </div>
            </div>
        )
    }
}

export default ListarTrabajadores;