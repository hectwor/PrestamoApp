import {Component} from "react";
import React from "react";
import {Form,
    Row,
    Col,
    Button,
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Modal,ModalHeader,ModalBody, ModalFooter,
    Input, FormFeedback, FormGroup
} from 'reactstrap';
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
};

class Mainvendedor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            montoActual: "500.00",

            showModalPrestarOption: false,
            showModalRecogerOption: false
        };
    }

    Logout = () => {

    };
    openModalPrestar = () => {
        this.setState({
            showModalPrestarOption: true,
        });
    };

    openModalCobrar = () => {
        this.setState({
            showModalRecogerOption: true,
        });
    };

    closeModal = () => {
        this.setState({
            showModalPrestarOption: false,
            showModalRecogerOption: false
        });
    };

    render() {
        const { montoActual } = this.state;
        const panelVendedor = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
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
                    <div className="container" style={panelVendedor}>
                        <Row >
                            <Col md={2}>
                            </Col>
                            <Col md={8}>
                                <br/><br/>
                                <h1 className="display-6">Monto Actual en mano</h1>
                                <h1 className="display-4">S/. {montoActual}</h1>
                                <br/>
                                <div>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalPrestar}
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalCobrar}
                                    >
                                        RECOGER
                                    </Button>
                                    <br/><br/>
                                </div>
                                <div>
                                    <Button
                                        size="lg"
                                    >
                                        VER INFORMACIÓN DEL DÍA
                                    </Button>
                                    <span> </span>
                                    <br/><br/><br/>
                                </div>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal  isOpen={this.state.showModalPrestarOption} style={customStyles} centered    >
                    <ModalHeader toggle={this.closeModal}>
                        Cliente a prestar
                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </Modal>

                <Modal  isOpen={this.state.showModalRecogerOption} style={customStyles} centered    >
                    <ModalHeader toggle={this.closeModal}>
                        Recoger
                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Mainvendedor;