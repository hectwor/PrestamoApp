import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label,
    Table
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";

class ListarClientes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado : "",
            listaDeDnis : null,
            redirectLogin:false,
            redirectMainAdmin:false
        }
    }
    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    regresarMenu = ()=>{
        this.setState({
            redirectMainAdmin: true,
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, dniPasaporteApellidoBuscado } = this.state;
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
        if (redirectMainAdmin) {
            return (
                <MainAdmin  username={this.props.username} password={this.props.password} />
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
                    <div className="container text-center" style={panelAdmin}>
                        <br/>
                        <h1 className="display-6">Lista de Clientes</h1>
                        <br/>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>DNI / Pasaporte / Apellidos</Label>
                                    <Input
                                        type="text"
                                        name="dniPasaporteApellidoBuscado"
                                        id="dniPasaporteApellidoBuscadoInput"
                                        value={dniPasaporteApellidoBuscado}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>DNI/Pasaporte</th>
                                        <th>Apellidos</th>
                                        <th>Nombres</th>
                                        <th>Fecha de Préstamo</th>
                                        <th>Fecha de Último Pago</th>
                                        <th>Monto Prestado</th>
                                        <th>Monto Abonado</th>
                                        <th>Monto Faltante</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">77777777</th>
                                        <td>Mark</td>
                                        <td>Préstamo</td>
                                        <td>S/. 100.00</td>
                                        <td>Juan</td>
                                        <td>S/. 200.00</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">77777777</th>
                                        <td>Jacob</td>
                                        <td>Préstamo</td>
                                        <td>S/. 100.00</td>
                                        <td>Tolomeo</td>
                                        <td>S/. 300.00</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">77777777</th>
                                        <td>Larry</td>
                                        <td>Recojo</td>
                                        <td>S/. 100.00</td>
                                        <td>Timoteo</td>
                                        <td>S/. 200.00</td>
                                    </tr>
                                    </tbody>
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
                        <br/><br/>
                    </div>
                </div>
            </div>
        )
    }
}
export default ListarClientes;