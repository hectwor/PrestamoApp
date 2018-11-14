import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Input, FormFeedback, FormGroup,
    Label,
    Row, Col
} from 'reactstrap';
import {Button, ControlLabel} from "react-bootstrap";
import Login from "./login";
import MainVendedor from "./mainVendedor";
class NuevoUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin: false,
            redirectMain: false,

            apellidoPaterno: "",
            apellidoMaterno:"",
            dniPasaporte:"",
            telefono:"",
            telefonoReferencia:"",
            direccionDomicilio:"",
            direccionTrabajo:"",
            validate: {
                apellidoPaterno: null,
                apellidoMaterno:null,
                dniPasaporte:null,
                telefono:null,
                telefonoReferencia:null,
                direccionDomicilio:null,
                direccionTrabajo:null
            },
        }
    }

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

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
        const { redirectLogin, redirectMain, apellidoPaterno, apellidoMaterno, dniPasaporte, telefono,telefonoReferencia, direccionDomicilio, direccionTrabajo, validate } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "70px"
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
                        <h1 className="display-4">Nuevo Usuario</h1>
                        <Row>
                            <Col md={3}>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Apellido Paterno</ControlLabel>
                                                <Input
                                                    name="apellidoPaterno"
                                                    id="apellidoPaternoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidoPaterno}
                                                    invalid={validate.apellidoPaterno === "has-danger"}
                                                    valid={validate.apellidoPaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Apellido Materno</ControlLabel>
                                                <Input
                                                    name="apellidoMaterno"
                                                    id="apellidoMaternoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidoMaterno}
                                                    invalid={validate.apellidoMaterno === "has-danger"}
                                                    valid={validate.apellidoMaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Nombres</ControlLabel>
                                                <Input
                                                    name="apellidoPaterno"
                                                    id="apellidoPaternoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={apellidoPaterno}
                                                    invalid={validate.apellidoPaterno === "has-danger"}
                                                    valid={validate.apellidoPaterno === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" value="option1" name="checkRadio" />{' '}
                                                                DNI
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" value="option2" name="checkRadio" />{' '}
                                                                Pasaporte
                                                            </Label>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <h1> </h1>
                                                <Input
                                                    name="dniPasaporte"
                                                    id="dniPasaporteInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={dniPasaporte}
                                                    invalid={validate.dniPasaporte === "has-danger"}
                                                    valid={validate.dniPasaporte === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Teléfono</ControlLabel>
                                                <Input
                                                    name="telefono"
                                                    id="telefonoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefono}
                                                    invalid={validate.telefono === "has-danger"}
                                                    valid={validate.telefono === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={8}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Dirección domicilio</ControlLabel>
                                                <Input
                                                    name="direccionDomicilio"
                                                    id="direccionDomicilioInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={direccionDomicilio}
                                                    invalid={validate.direccionDomicilio === "has-danger"}
                                                    valid={validate.direccionDomicilio === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Teléfono Referencia</ControlLabel>
                                                <Input
                                                    name="telefonoReferencia"
                                                    id="telefonoReferenciaInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={telefonoReferencia}
                                                    invalid={validate.telefonoReferencia === "has-danger"}
                                                    valid={validate.telefonoReferencia === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={8}>
                                        <FormGroup>
                                            <div className="text-left">
                                                <ControlLabel>Dirección trabajo</ControlLabel>
                                                <Input
                                                    name="direccionTrabajo"
                                                    id="direccionTrabajoInput"
                                                    placeholder=""
                                                    type="text"
                                                    value={direccionTrabajo}
                                                    invalid={validate.direccionTrabajo === "has-danger"}
                                                    valid={validate.direccionTrabajo === "has-success"}
                                                    onChange={this.handleChange}
                                                />
                                                <FormFeedback invalid>Campo Obligatorio</FormFeedback>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                            </Col>
                        </Row>
                        <Button
                            block
                            bsSize="large"
                            onClick={this.regresarMenu}
                        >
                            Regresar
                        </Button>
                        < br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default NuevoUsuario;