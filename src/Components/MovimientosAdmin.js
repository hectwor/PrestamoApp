import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label,
    Table
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
import moment from "moment";

class MovimientosAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {

            montoActualDiaTotal: 0,
            fechaInicioBusqueda:  moment().format('YYYY-MM-DD'),
            fechaFinBusqueda:  moment().format('YYYY-MM-DD'),

            redirectLogin:false,
            redirectMainAdmin:false
        }
    }

    componentWillMount (){
        //SOLICITAR INFO
        this.setState({
            montoActualDiaTotal: "10000.00"
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

    buscarMovimientos =() =>{

    };

    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    render() {
        const { redirectLogin, redirectMainAdmin, montoActualDiaTotal, fechaInicioBusqueda, fechaFinBusqueda } = this.state;
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
                <MainAdmin  />
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
                                    <Col md={5}>
                                        <div className="text-left">
                                            <Label>Fecha Inicio de Búsqueda</Label>
                                            <Input
                                                type="date"
                                                name="fechaInicioBusqueda"
                                                id="fechaInicioBusquedaInput"
                                                value={fechaInicioBusqueda}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className="text-left">
                                            <Label>Fecha Fin de Búsqueda</Label>
                                            <Input
                                                type="date"
                                                name="fechaFinBusqueda"
                                                id="fechaFinBusqueda"
                                                value={fechaFinBusqueda}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="text-left">
                                            <br/>
                                            <Button
                                            onClick={this.buscarMovimientos}
                                            color="info"
                                            >
                                            Buscar
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Prestamista</th>
                                            <th>Movimiento</th>
                                            <th>Monto</th>
                                            <th>Cliente</th>
                                            <th>Monto Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">10-10-2018</th>
                                            <td>Mark</td>
                                            <td>Préstamo</td>
                                            <td>S/. 100.00</td>
                                            <td>Juan</td>
                                            <td>S/. 200.00</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">10-10-2018</th>
                                            <td>Jacob</td>
                                            <td>Préstamo</td>
                                            <td>S/. 100.00</td>
                                            <td>Tolomeo</td>
                                            <td>S/. 300.00</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">10-10-2018</th>
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

export default MovimientosAdmin;