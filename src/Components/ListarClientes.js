import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button, Input, Label,
    Table
} from 'reactstrap';
import Login from "./Login";
import MainAdmin from "./MainAdmin";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
const axios = require('axios');
class ListarClientes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado : "",
            listaDeDnis : null,
            redirectLogin:false,
            redirectMainAdmin:false,

            clients:[]
        }
    }

    componentWillMount () {
        let self = this;

        axios.get('https://edutafur.com/sgp/public/clientes/buscar')
        .then(function (response) {
              const clients = response.data;
              let optionsClients = [
              ];
              optionsClients = clients.map((n) => {
                  let client = {};
                  client['dni']= n.nro_doc;
                  client['apellidos']= n.ape_pat + ' ' + n.ape_mat;
                  client['nombres']= n.nombre;
                  return client;
              })
              self.setState({
                  clients: optionsClients
              });
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
        });
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
        const { redirectLogin, redirectMainAdmin, dniPasaporteApellidoBuscado, clients } = this.state;
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
                            <Col md={1}>
                            </Col>
                            <Col md={10}>
                            <BootstrapTable 
                                data={clients} 
                                version='4'
                                search
                                pagination
                            >
                                <TableHeaderColumn isKey dataField='dni'>DNI/Pasaporte</TableHeaderColumn>
                                <TableHeaderColumn dataField='apellidos'>Apellidos</TableHeaderColumn>
                                <TableHeaderColumn dataField='nombres'>Nombres</TableHeaderColumn>
                            </BootstrapTable>
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