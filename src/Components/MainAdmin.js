import React, {Component} from "react";
import {
    Navbar,NavbarBrand,NavItem, NavLink,Nav,
    Row, Col,
    Button,
    FormFeedback,
    ModalFooter, Input, ModalBody, ModalHeader, Modal
} from 'reactstrap';
import Select from 'react-select';
import Login from "./Login";
import MovimientosAdmin from "./MovimientosAdmin";
import ListarClientes from "./ListarClientes";
import CrearUsuario from "./CrearUsuario";
import Prestamo from "./Prestamo";
import Recojo from "./Recojo";
import NuevoCliente from "./NuevoCliente";
import ModificarTrabajador from "./ModificarTrabajador";
import ListarTrabajadores from "./ListarTrabajadores";
const axios = require('axios');

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

class MainAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectLogin:false,
            redirectMovimientosAdmin:false,
            redirectOpenClientes:false,
            redirectCrearUsuario:false,
            redirectPrestamo:false,
            redirectRecojo:false,
            redirectNuevoCliente:false,
            redirectModificarTrabajador:false,
            redirectOpenTrabajadores:false,

            usuarioEncontrado:false,
            userEncontrado:false,
            trabajadorEncontrado:false,

            dniPasaporteBuscar:null,
            usernameBuscar: null,
            trabajadorBuscar: null,
            dniPasaporteBuscado:null,
            idClienteSeleccionado: "",
            id_trabajador_modificar:"",
            apellidoPaternoSeleccionado:"",
            apellidoMaternoSeleccionado:"",
            idClienteBuscado: "",
            apellidoPaternoBuscado:"",
            apellidoMaternoBuscado:"",

            usuarioSeleccionado:"",
            usuarioNewSeleccionado:"",
            claveSeleccionado:"",
            estadoUsuarioSeleccionado:"",
            rolUsuarioSeleccionado:"",

            validate: {
                dniPasaporteBuscar:null,
            },

            showModalRecogerOption:false,
            showModalPrestarOption:false,
            showModalMdfUsuario: false,
            showModalMdfTrabajador : false,

            visibleNuevo:"hidden",

            options:[],
            optionsUsers: [],
            optionsTrabajador: []
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

    openTrabajadores = () =>{
        this.setState({
            redirectOpenTrabajadores: true,
        });
    }
    crearUsuario = () => {
        this.setState({
            redirectCrearUsuario: true,
        });
    };
    Logout = () => {
        this.setState({
            redirectLogin: true,
        });
    };

    openPrestar = () => {
        this.setState({
            redirectPrestamo: true,
        });
    };

    openCobrar = () => {
        this.setState({
            redirectRecojo: true,
        });
    };

    nuevoCliente = () => {
        this.setState({
            redirectNuevoCliente: true
        });
    };

    modificarTrabajador = () => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/trabajadores')
            .then(function (response) {
                const trabajadores = response.data;
                let optionsTrabajadores = [
                ];
                optionsTrabajadores = trabajadores.map((n) => {
                    let trabajador = {};
                    trabajador['value'] = n.nro_doc;
                    trabajador['label'] = n.nombre + ' ' + n.ape_pat + ' ' +n.ape_mat;
                    return trabajador;
                })
                self.setState({
                    optionTrabajador: optionsTrabajadores
                });
            })
            .catch(function (error) {
                console.log(error);
                self.setState({
                    usuarioEncontrado: false
                });
            })
            .then(function () {
                self.setState({
                    showModalMdfTrabajador: true
                });
            });
    }

    modificarUsuario = () => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/usuarios')
        .then(function (response) {
              const usuarios = response.data;
              let optionsUsuarios = [
              ];
              optionsUsuarios = usuarios.map((n) => {
                  let client = {};
                  client['value']= n.id_trabajador;
                  client['label']= n.usuario;
                  return client;
              })
              self.setState({
                  optionsUsers: optionsUsuarios
              });
        })
        .catch(function (error) {
          console.log(error);
          self.setState({
              usuarioEncontrado: false
          });
        })
        .then(function () {
          self.setState({
            showModalMdfUsuario: true
          });
        });
    }

    enviarModificacionUsuario = () => {
        axios.post('https://edutafur.com/sgp/public/usuario/actualizar', {
            usuario: this.state.usuarioSeleccionado,
            clave: this.state.claveSeleccionado,
            estado: this.state.estadoUsuarioSeleccionado,
            idRol: this.state.rolUsuarioSeleccionado,
            cambiarUsuario: this.state.usuarioNewSeleccionado
        }).then(function (response) {
            if (response.status === 200) {
                alert("Usuario Modificado");
                this.closeModal();
            }
        })
            .catch(function (error) {
                console.log(error);
            });

    }

    openModalPrestar = () => {
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar')
          .then(function (response) {
                const clients = response.data;
                let optionsClients = [
                ];
                optionsClients = clients.map((n) => {
                    let client = {};
                    client['value']= n.nro_doc;
                    client['label']= n.nombre + ' ' + n.ape_pat + ' ' + n.ape_mat;
                    return client;
                })
                self.setState({
                    options: optionsClients
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
            self.setState({
                showModalPrestarOption: true
            });
          });
    };

    onkeyPressInput = () => {

    };

    openModalCobrar = () => {
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar',)
          .then(function (response) {
                const clients = response.data;
                let optionsClients = [
                ];
                optionsClients = clients.map((n) => {
                    let client = {};
                    client['value']= n.nro_doc;
                    client['label']= n.nombre + ' ' + n.ape_pat + ' ' + n.ape_mat;
                    return client;
                })
                self.setState({
                    options: optionsClients
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
            self.setState({
                showModalRecogerOption: true,
            });
          });
    };

    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
    };

    handleChangeSelect = (dniPasaporteBuscar) => {
        this.setState({ 
            dniPasaporteBuscar :  dniPasaporteBuscar
        });
        var self = this;
        axios.get('https://edutafur.com/sgp/public/clientes/buscar',{
            params: {
                dniPasaporteApellidoBuscado : dniPasaporteBuscar.value
            }
        })
          .then(function (response) {
                self.setState({
                    apellidoPaternoSeleccionado : response.data[0].ape_pat,
                    apellidoMaternoSeleccionado : response.data[0].ape_mat,
                    idClienteSeleccionado : response.data[0].id_cliente,
                    dniPasaporteBuscado : response.data[0].nro_doc
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                usuarioEncontrado: false
            });
          })
          .then(function () {
          });
      }

    handleChangeSelectUser = (usernameBuscar) => {
        this.setState({ 
            usernameBuscar :  usernameBuscar
        });
        let self = this;
        axios.get('https://edutafur.com/sgp/public/usuarios/buscar',{
            params: {
                usuario : usernameBuscar.label
            }
        })
          .then(function (response) {
                self.setState({
                usuarioSeleccionado : response.data[0].usuario,
                usuarioNewSeleccionado: response.data[0].usuario,
                estadoUsuarioSeleccionado : response.data[0].estado,
                rolUsuarioSeleccionado:  response.data[0].id_rol
                });
          })
          .catch(function (error) {
            console.log(error);
            self.setState({
                userEncontrado: false
            });
          })
          .then(function () {
          });
    }

    handleChangeSelectTrabajador = (trabajadorBuscar) => {
        this.setState({
            trabajadorBuscar: trabajadorBuscar,
            id_trabajador_modificar: trabajadorBuscar.value
        });
    };

    seleccionarDNIPasaporte = () => {
        const { dniPasaporteBuscar, validate, apellidoPaternoSeleccionado, apellidoMaternoSeleccionado, idClienteSeleccionado } = this.state;
        if(dniPasaporteBuscar !== null || idClienteSeleccionado !== ""){
            validate.dniPasaporteBuscar = "has-success";
            this.setState({
                usuarioEncontrado: true,
                apellidoPaternoBuscado: apellidoPaternoSeleccionado,
                apellidoMaternoBuscado: apellidoMaternoSeleccionado,
                idClienteBuscado: idClienteSeleccionado,
                validate:validate
            });
        }else{
            validate.dniPasaporteBuscar = "has-danger";
            this.setState({
                usuarioEncontrado: false,
                validate:validate
            });
        }
    };

    seleccionarUser = () => {
        this.setState({
            userEncontrado: true,
        });
    };
    seleccionarTrabajador = () => {
        this.setState({
            redirectModificarTrabajador: true,
        });
    };

    prestamo = () => {
        this.setState({
            redirectPrestamo: true
        });
    };

    recoger = () => {
        this.setState({
            redirectRecojo: true
        });
    };

    closeModal = () => {
        this.setState({
            dniPasaporteBuscar:null,
            usernameBuscar:null,
            trabajadorBuscar:null,
            idClienteSeleccionado:"",
            usuarioEncontrado:false,
            userEncontrado:false,
            showModalPrestarOption: false,
            showModalRecogerOption: false,
            showModalMdfUsuario: false,
            showModalMdfTrabajador: false
        });
    };

    render() {
        const { redirectLogin, redirectMovimientosAdmin, redirectOpenTrabajadores,
            redirectNuevoCliente,
            redirectOpenClientes, redirectCrearUsuario, redirectModificarTrabajador,
            redirectPrestamo, redirectRecojo, dniPasaporteBuscar,
            validate,apellidoPaternoBuscado, apellidoMaternoBuscado,
            options,optionsUsers, optionTrabajador, usuarioSeleccionado, usuarioNewSeleccionado,
            usernameBuscar, claveSeleccionado, estadoUsuarioSeleccionado, rolUsuarioSeleccionado,
            trabajadorBuscar
        } = this.state;
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
        const  buttonSizeHidden = {
            height: '60px',
            width: '230px',
            marginBottom: '20px',
            marginRight: '6px',
            marginLeft: '6px',
            display: 'none'
        };
        if (redirectLogin) {
            return (
                <Login  />
            );
        }
        if (redirectOpenClientes) {
            return (
                <ListarClientes 
                id_trabajador={this.props.id_trabajador}  
                username={this.props.username} 
                password={this.props.password} 
                />
            );
        }
        if (redirectOpenTrabajadores) {
            return (
                <ListarTrabajadores
                    id_trabajador={this.props.id_trabajador}
                    username={this.props.username}
                    password={this.props.password}
                />
            );
        }
        if (redirectCrearUsuario) {
            return (
                <CrearUsuario  id_trabajador = {this.props.id_trabajador}  username={this.props.username} password={this.props.password} />
            );
        }
        if (redirectMovimientosAdmin) {
            return (
                <MovimientosAdmin id_trabajador={this.props.id_trabajador}   username={this.props.username} password={this.props.password} />
            );
        }
        if (redirectNuevoCliente) {
            return (
                <NuevoCliente id_trabajador={this.props.id_trabajador}   username={this.props.username} password={this.props.password} rol = {"admin"}/>
            );
        }
        if (redirectModificarTrabajador) {
            return (
                <ModificarTrabajador 
                    id_trabajador={this.props.id_trabajador}   
                    username={this.props.username} 
                    password={this.props.password} 
                    rol = {"admin"}
                    id_trabajador_modificar={this.state.id_trabajador_modificar}
                />
            );
        }
        if (redirectPrestamo) {
            return (
                <Prestamo
                    id_trabajador = {this.props.id_trabajador} 
                    username={this.props.username}
                    saldo = {this.state.montoActual}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"admin"}
                />
            );
        }
        if (redirectRecojo) {
            return (
                <Recojo
                    id_trabajador = {this.props.id_trabajador} 
                    username={this.props.username}
                    password={this.props.password}
                    idClienteBuscado = {this.state.idClienteBuscado}
                    dniPasaporteBuscado = {this.state.dniPasaporteBuscado}
                    apellidoPaternoBuscado = {this.state.apellidoPaternoBuscado}
                    apellidoMaternoBuscado = {this.state.apellidoMaternoBuscado}
                    rol = {"admin"} />
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
                                        onClick={this.openTrabajadores}
                                        style={buttonSize}
                                    >
                                        TRABAJADORES
                                    </Button>
                                    <Button
                                            size="lg"
                                            onClick={this.openClientes}
                                            style={buttonSize}
                                        >
                                            CLIENTES
                                        </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.crearUsuario}
                                        style={buttonSize}
                                    >
                                    CREAR USUARIO
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalPrestar}
                                        style={buttonSizeHidden}
                                    >
                                        PRESTAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.openModalCobrar}
                                        style={buttonSizeHidden}
                                    >
                                        COBRAR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.modificarTrabajador}
                                        style={buttonSize}
                                    >
                                        MDF TRABAJADOR
                                    </Button>
                                    <span> </span>
                                    <Button
                                        size="lg"
                                        onClick={this.modificarUsuario}
                                        style={buttonSize}
                                    >
                                        MDF USUARIO
                                    </Button>
                            </Col>
                            <Col md={2}>
                            </Col>
                        </Row>
                        <br/> <br/>
                    </div>
                </div>
                <Modal  isOpen={this.state.showModalPrestarOption} style={customStyles} centered size = "lg" >
                    <ModalHeader toggle={this.closeModal}>
                        Cliente a prestar
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <Row>
                                        <Col md={9}>
                                            <span>Indicar Apellidos o Nombres</span>
                                            <Select
                                                name="dniPasaporteBuscar"
                                                id="dniPasaporteBuscarInput"
                                                placeholder=""
                                                value={dniPasaporteBuscar}
                                                onChange={this.handleChangeSelect}
                                                invalid={validate.dniPasaporteBuscar === "has-danger"}
                                                valid={validate.username === "has-success"}
                                                options={options}
                                            />
                                            <FormFeedback invalid>Cliente no encontrado</FormFeedback>
                                        </Col>
                                        <Col md={3}>
                                            <br />
                                            <Button
                                                onClick= {this.seleccionarDNIPasaporte}
                                            >
                                                Seleccionar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick= {this.nuevoCliente}
                                    >
                                        Nuevo Cliente
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={(this.state.usuarioEncontrado===true) ? null :{visibility: [this.state.visibleNuevo]}}>
                            <Row>
                                <Col md={6}>
                                    <span>Apellido Paterno</span>
                                    <Input
                                        name="apellidoPaternoBuscado"
                                        id="apellidoPaternoBuscadoInput"
                                        value={apellidoPaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Apellido Materno</span>
                                    <Input
                                        name="apellidoMaternoBuscado"
                                        id="apellidoMaternoBuscadoInput"
                                        value={apellidoMaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <br />
                            <div className = "text-center">
                                <Button
                                    size="lg"
                                    onClick= {this.prestamo}
                                    color="primary"
                                >
                                    Prestar
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal  isOpen={this.state.showModalRecogerOption} style={customStyles} centered size = "lg">
                    <ModalHeader toggle={this.closeModal}>
                        Recoger
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <span>Indicar Apellidos o Nombres</span>
                                    <Select
                                        name="dniPasaporteBuscar"
                                        id="dniPasaporteBuscarInput"
                                        placeholder=""
                                        value={dniPasaporteBuscar}
                                        onChange={this.handleChangeSelect}
                                        invalid={validate.dniPasaporteBuscar === "has-danger"}
                                        valid={validate.username === "has-success"}
                                        options={options}
                                    />
                                    <FormFeedback invalid>Cliente no encontrado</FormFeedback>
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick= {this.seleccionarDNIPasaporte}
                                    >
                                        Seleccionar
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={(this.state.usuarioEncontrado===true) ? null :{visibility: [this.state.visibleNuevo]}}>
                            <Row>
                                <Col md={6}>
                                    <span>Apellido Paterno</span>
                                    <Input
                                        name="apellidoPaternoBuscado"
                                        id="apellidoPaternoBuscadoInput"
                                        value={apellidoPaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Apellido Materno</span>
                                    <Input
                                        name="apellidoMaternoBuscado"
                                        id="apellidoMaternoBuscadoInput"
                                        value={apellidoMaternoBuscado}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <br />
                            <div className = "text-center">
                                <Button
                                    size="lg"
                                    onClick= {this.recoger}
                                    color="primary"
                                >
                                    RECOGER
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal  isOpen={this.state.showModalMdfUsuario} style={customStyles} centered size = "mg">
                    <ModalHeader toggle={this.closeModal}>
                        Modificar Usuario
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <span>Indicar username</span>
                                    <Select
                                        name="usernameBuscar"
                                        id="usernameInput"
                                        placeholder=""
                                        value={usernameBuscar}
                                        onChange={this.handleChangeSelectUser}
                                        options={optionsUsers}
                                    />
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick= {this.seleccionarUser}
                                    >
                                        Seleccionar
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={(this.state.userEncontrado===true) ? null :{visibility: [this.state.visibleNuevo]}}>
                            <Row>
                                <Col md={6}>
                                    <span>Usuario</span>
                                    <Input
                                        name="usuarioSeleccionado"
                                        id="usuarioSeleccionadoInput"
                                        value={usuarioSeleccionado}
                                        readOnly
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Nuevo nombre usuario</span>
                                    <Input
                                        name="usuarioNewSeleccionado"
                                        id="usuarioNewSeleccionadoInput"
                                        value={usuarioNewSeleccionado}
                                        readOnly
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <span>Digitar Nuevo Usuario</span>
                                    <Input
                                        name="usuarioNewSeleccionado"
                                        id="usuarioNewSeleccionadoInput"
                                        value={usuarioNewSeleccionado}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                                <Col md={6}>
                                    <span>Clave</span>
                                    <Input
                                        name="claveSeleccionado"
                                        id="claveSeleccionadoInput"
                                        value={claveSeleccionado}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <span>Rol</span>
                                    <Input
                                        type="select" 
                                        name="rolUsuarioSeleccionado"
                                        id="rolUsuarioSeleccionadoInput"
                                        value={rolUsuarioSeleccionado}
                                        onChange={this.handleChange}
                                    >
                                        <option value="2">COBRADOR/PRESTADOR</option>
                                        <option value="1">ADMIN</option>
                                    </Input>
                                </Col>
                                <Col md={6}>
                                    <span>Estado</span>
                                    <Input 
                                        type="select" 
                                        name="estadoUsuarioSeleccionado"
                                        id="estadoUsuarioSeleccionadoInput"
                                        value={estadoUsuarioSeleccionado}
                                        onChange={this.handleChange}
                                    >
                                        <option value="0">NO ACTIVO</option>
                                        <option value="1">ACTIVO</option>
                                    </Input>
                                </Col>
                            </Row>
                            <br />
                            <div className = "text-center">
                                <Button
                                    size="lg"
                                    onClick= {this.enviarModificacionUsuario}
                                    color="primary"
                                >
                                    Modificar
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal  isOpen={this.state.showModalMdfTrabajador} style={customStyles} centered size = "mg">
                    <ModalHeader toggle={this.closeModal}>
                        Modificar Trabajador
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Row>
                                <Col md={9}>
                                    <span>Indicar Nombre Completo</span>
                                    <Select
                                        name="trabajadorBuscar"
                                        id="trabajadorBuscarInput"
                                        placeholder=""
                                        value={trabajadorBuscar}
                                        onChange={this.handleChangeSelectTrabajador}
                                        options={optionTrabajador}
                                    />
                                </Col>
                                <Col md={3}>
                                    <br />
                                    <Button
                                        onClick={this.seleccionarTrabajador}
                                        color="primary"
                                    >
                                        Seleccionar
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <br /><br />
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default MainAdmin;