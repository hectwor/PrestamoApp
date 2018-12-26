import React, { Component } from "react";
import {
    Navbar, NavbarBrand, NavItem, NavLink, Nav,
    Row, Col,
    Button,
    ModalFooter, ModalBody, ModalHeader, Modal, Label,
    Input
} from 'reactstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from "moment";
import Login from "./Login";
import MainAdmin from "./MainAdmin";
const axios = require('axios');
moment.lang('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});
moment.lang("es");
class ListarTrabajadores extends Component {
    constructor(props){
        super(props);

        this.state = {
            dniPasaporteApellidoBuscado: "",
            id_trabajadorBuscado:"",
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            movAnte:"",
            lunesDeLaSemana:null,
            liquidarDia:[],
            AvisoDisplay: 'none',
            redirectLogin: false,
            redirectMainAdmin: false,
            pagoDia:0,
            pagoSemanalTotal:0,
            pagoSemanal:0,

            nombresCompletos: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            dniPasaporte: "",
            telefono: "",
            fechaNacimiento: "",
            sexo: "",
            pais: "",
            correoElectronico: "",
            direccion: "",

            showModalInformation:null,
            showModalTrabajadorInfo:null,
            showModalTrabajadorPagar:null,

            trabajadores: [],
            movimientos: [],
            columnsTable:
            {
                "dni": "DNI",
                "nombreCompleto": 'Nombre Trabajador',
                "telefono": "Telefono",
                "verDatos": "Ver / Liquidar"
            }
        }
    }

    componentWillMount () {
        let self = this;
        let hoy = moment();
        do{
            hoy = hoy.subtract(1, 'days');
        }while(hoy.format('dddd') !== 'Lunes');
        this.setState({
            lunesDeLaSemana: hoy
        })
        axios.get('https://edutafur.com/sgp/public/trabajadores')
        .then(function (response) {
              const trabajadores = response.data;

              let optionsTrabajadores = trabajadores.map((n) => {
                  let trabajador = {};
                  trabajador['id_trabajador']= n.id_trabajador;
                  trabajador['dni']= n.nro_doc;
                  trabajador['nombreCompleto']= n.ape_pat+ ' '+n.ape_mat+' '+n.nombre;
                  trabajador['telefono']= n.telefono;
                  return trabajador;
              });
              self.setState({
                  trabajadores: optionsTrabajadores
              });
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
        });
    }

    llenarModal = (id_trabajador) => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/movimientos/trabajador/', {
            params: {
                idTrabajador: id_trabajador
            }
        }).then(function (response) {
            const movimientos = response.data;
            let pagoDia= 0;
            let movAnte = "";
            let pagosDia = [];
            let optionsMv = movimientos.map((n) => {
                let mov = {};
                if(n.flag_liquidado === 'S' && moment(n.fecha_movimiento) < moment(self.state.fechaBusqueda)){
                    self.setState({
                        AvisoDisplay: 'block'
                    });
                }
                if(moment(n.fecha_movimiento).format('YYYY-MM-DD') === moment(self.state.fechaBusqueda).format('YYYY-MM-DD')){
                    mov['id_pago'] = n.id_movimiento;
                    mov['tipo_movimiento'] = n.tipo_movimiento;
                    mov['cliente'] = n.cliente_descripcion_gasto;
                    mov['pago'] = n.monto;
                    mov['flag_liquidado'] = n.flag_liquidado;
                    pagoDia = parseFloat(pagoDia) + parseFloat(n.monto);
                    pagosDia = pagosDia.concat({
                        "tipo": n.tipo_movimiento,
                        "id": n.id_movimiento
                    });
                }else{
                    if (n.flag_liquidado === 'N'){
                        movAnte = movAnte + ", " + moment(n.fecha_movimiento).format('YYYY-MM-DD');
                    }
                }
                return mov;
            });
            self.setState({
                movimientos: optionsMv,
                pagoDia:pagoDia,
                movAnte:movAnte,
                liquidarDia: pagosDia
            });
        }).catch(function (error) {
          console.log(error);
        })
        .then(function () {
            self.setState({
                id_trabajadorBuscado : id_trabajador
            });
        })
    };

    abrirModalInfo = (id_trabajador) =>{
        this.setState({
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            showModalInformation: true
        });
        this.llenarModal(id_trabajador);
    };

    abrirModalparaPagar  = (id_trabajador) =>{
        let self = this;
        axios.get('https://edutafur.com/sgp/public/movimientos/trabajador/', {
            params: {
                idTrabajador: id_trabajador
            }
        }).then(function (response) {
            const movimientos = response.data;
            let mov = 0;
            for(let i=0;i<Object.keys(movimientos).length;i++){
                if(movimientos[i].tipo_movimiento === 'Pagos'){
                    if(moment(movimientos[i].fecha_movimiento).format('YYYY-MM-DD') >= self.state.lunesDeLaSemana.format('YYYY-MM-DD')
                        && moment(movimientos[i].fecha_movimiento).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD')){
                        mov = mov + parseFloat(movimientos[i].monto);
                    }
                }
            }
            self.setState({
                pagoSemanalTotal: mov,
                pagoSemanal: Math.round((parseFloat(mov)*0.03) * 100) / 100
            });
        }).catch(function (error) {
            console.log(error);
          });
        this.setState({
            showModalTrabajadorPagar: true
        });
    };

    liquidarPago = (id_pago, tipo_movimiento) => {
        //let self = this;
        let linkPost = "";
        if(tipo_movimiento === 'Pagos') linkPost = 'https://edutafur.com/sgp/public/pagos/liquidar';
        if(tipo_movimiento === 'Gastos') linkPost = 'https://edutafur.com/sgp/public/gastos/liquidar';
        if(tipo_movimiento === 'Prestamos') linkPost = 'https://edutafur.com/sgp/public/prestamos/liquidar';
        axios.post(linkPost, {
            id: id_pago
          })
          .then(function (response) {
           window.document.getElementById(`ButtonLiquidar${tipo_movimiento}${id_pago}`).style.background = "green";
            alert(response.data.mensaje);
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    liquidarDia = () => {
        let self= this;
        if (Object.keys(this.state.liquidarDia).length === 0){
            alert('No hay pagos en el día');
        }else{
            axios.post('https://edutafur.com/sgp/public/movimientos/liquidarDia', this.state.liquidarDia)
                .then(function (response) {
                    alert(`Gastos Liquidados: ${response.data.mensaje.GastosLiquidados}\nPagos Liquidados: ${response.data.mensaje.PagosLiquidados}\nPréstamos Liquidados: ${response.data.mensaje.PrestamosLiquidados}`
                    )
                    self.closeModal();
                })
                .catch(function (error) {
                    console.log(error);
            });
        }
    };

    verTrabajador = (dni) => {
        let self = this;
        axios.get('https://edutafur.com/sgp/public/trabajador/buscar', {
            params: {
                nroDoc: dni
            }
        }).then(function (response) {
            self.setState({
                apellidoPaterno: response.data[0].ape_pat,
                apellidoMaterno: response.data[0].ape_mat,
                nombresCompletos: response.data[0].nombre,
                telefono: response.data[0].telefono,
                fechaNacimiento: response.data[0].fecha_nac,
                dniPasaporte: response.data[0].nro_doc,
                correoElectronico: response.data[0].correo,
                direccion: response.data[0].direccion,
                sexo: response.data[0].sexo,
                pais: response.data[0].pais,

                showModalTrabajadorInfo: true
            });
        })
    };

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
    
    handleChange = event => {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)
        this.llenarModal(this.state.id_trabajadorBuscado);
    };

    closeModal = () => {
        this.setState({
            showModalInformation: false,
            showModalTrabajadorInfo:false,
            showModalTrabajadorPagar:false,
            fechaBusqueda:  moment().format('YYYY-MM-DD'),
            AvisoDisplay: 'none'
        });
    };

    render(){
        const { redirectLogin, redirectMainAdmin, 
            columnsTable, trabajadores, fechaBusqueda,
            AvisoDisplay, movimientos, pagoDia,
            nombresCompletos, apellidoPaterno, apellidoMaterno,
            dniPasaporte,
            telefono,
            fechaNacimiento, correoElectronico, direccion, lunesDeLaSemana, pagoSemanal, pagoSemanalTotal
         } = this.state;
        let self = this;
        const panelAdmin = {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
            marginTop: "80px"
        };
        const fontSize = {
            fontSize: 14
        };
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
                                            <Th>{columnsTable.dni}</Th>
                                            <Th>{columnsTable.nombreCompleto}</Th>
                                            <Th>{columnsTable.telefono}</Th>
                                            <Th>{columnsTable.verDatos}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                    {trabajadores.map(function(item, key) {
                                        return (
                                            <Tr key = {key}>
                                                <Td >{item.dni}</Td>
                                                <Td >{item.nombreCompleto}</Td>
                                                <Td>{item.telefono}</Td>
                                                <Td>
                                                    <Button
                                                        size="sm"
                                                        color="info"
                                                        onClick={() => { self.verTrabajador(item.dni)}}
                                                    >
                                                        Ver
                                                    </Button>
                                                    <span> </span>
                                                    <Button
                                                        size="sm"
                                                        color="info"
                                                        onClick={() => { self.abrirModalInfo(item.id_trabajador) }}
                                                    >
                                                        Liquidar
                                                    </Button>
                                                    <span> </span>
                                                    <Button
                                                        size="sm"
                                                        color="info"
                                                        onClick={() => { self.abrirModalparaPagar(item.id_trabajador) }}
                                                    >
                                                        Pagar
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
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
                <Modal isOpen={this.state.showModalInformation} style={customStyles} centered size = "lg">
                    <ModalHeader  toggle={this.closeModal}>
                        Liquidar Movimientos
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right" style={{marginTop: '7px'}}>
                                    <Label>Fecha para Liquidar :</Label>
                                </div>
                            </Col>
                            <Col  md={6}>
                                <div className="text-left">
                                    <Input
                                        type="date"
                                        name="fechaBusqueda"
                                        id="fechaBusquedaInput"
                                        value={fechaBusqueda}
                                        onChange={this.handleChange}
                                        />
                                </div>
                            </Col>
                        </Row>
                        <br/>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th><b>Nombre de Cliente</b></Th>
                                    <Th><b>Movimiento</b></Th>
                                    <Th><b>Monto de Cobro</b></Th>
                                    <Th><b>Liquidar</b></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {movimientos.map(function (item, key) {
                                    if (item.cliente !== undefined) {
                                        let styleButton = "";
                                        if (item.flag_liquidado === 'S') styleButton = 'success';
                                        if (item.flag_liquidado === 'N') styleButton = 'danger';
                                        return (
                                            <Tr key={key}>
                                                <Td>
                                                    <div className="text-center">
                                                        <Label>{item.cliente}</Label>
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="text-center">
                                                        <Label>{item.tipo_movimiento}</Label>
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <div className="text-center">
                                                        <Label>S/. {item.pago}</Label>
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        id={`ButtonLiquidar${item.tipo_movimiento}${item.id_pago}`}
                                                        name={`ButtonLiquidar${item.tipo_movimiento}${item.id_pago}`}
                                                        block
                                                        color={styleButton}
                                                        onClick={() => { self.liquidarPago(item.id_pago, item.tipo_movimiento) }}
                                                    >
                                                        LIQUIDAR
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
                                    } else {
                                        return (
                                            <div></div>
                                        )
                                    }
                                })}
                            </Tbody>
                        </Table>
                        <Row>
                            <Col  md={6}>
                                <div className="text-right">
                                    <Label><b>Monto Total del día:</b></Label>
                                </div>
                            </Col>
                            <Col  md={3}>
                                <div className="text-center">
                                    <Label><b>S/. {parseFloat(pagoDia)}</b></Label>
                                </div>
                            </Col>
                        </Row>
                        <div className="text-right">
                            <Label>Pago a trabajador por el día: S/. {parseFloat(pagoDia)*0.15}</Label>
                            <span> </span>
                            <Button
                                onClick = {this.liquidarDia}
                            >
                                LIQUIDAR DÍA
                            </Button>
                        </div>
                        <br/>
                        <Label style={{color: '#B40404', display: AvisoDisplay}}>Tiene días anteriores sin liquidar ({this.state.movAnte})</Label>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick= {this.closeModal}
                            color="danger"
                        >
                            Salir
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.showModalTrabajadorInfo} style={customStyles} centered size="mg">
                    <ModalHeader toggle={this.closeModal}>
                        Información de Trabajador
                    </ModalHeader>  
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>Nombre Completo :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{nombresCompletos} {apellidoPaterno} {apellidoMaterno}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>DNI / Pasaporte :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{dniPasaporte}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>Teléfono :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{telefono}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>Correo :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{correoElectronico}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>Dirección :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{direccion}</Label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className="text-right" >
                                    <Label>Fecha de Nacimiento :</Label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="text-left">
                                    <Label>{fechaNacimiento}</Label>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={this.closeModal}
                            color="danger"
                        >
                            Salir
                        </Button>
                    </ModalFooter>       
                </Modal>
                <Modal  isOpen={this.state.showModalTrabajadorPagar} style={customStyles} centered size="mg">
                    <ModalHeader toggle={this.closeModal}>
                        Pago a Trabajador
                    </ModalHeader>
                    <ModalBody>
                        <div className = "text-center">
                                <Label> Pago desde {lunesDeLaSemana.format('dddd')} {lunesDeLaSemana.format('Do')} a hoy {moment().format('dddd')} {moment().format('Do')}</Label>
                                <br/>
                                <Label><b>Cobró S/. {pagoSemanalTotal}</b></Label><br/>
                                <Label><b>Se le pagará S/. {pagoSemanal}</b></Label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={this.closeModal}
                            color="danger"
                        >
                            Salir
                        </Button>
                    </ModalFooter>      
                </Modal>
            </div>
        )
    }
}

export default ListarTrabajadores;