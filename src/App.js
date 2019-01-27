import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import ErrorPage from './Components/ErrorPage';

//import CrearUsuario from './Components/CrearUsuario';

class App extends Component {
    render() {
        const fondo = {
            top:'0',
            bottom:'0',
            left:'0',
            right:'0',
            position: 'absolute',
            background : 'linear-gradient(-135deg, #c850c0, #4158d0)'
        };
        const fondo2 = {
            top:'0',
            bottom:'-10px',
            left:'0',
            right:'0',
            position: 'relative',
            background : 'linear-gradient(-135deg, #c850c0, #4158d0)'
        };
    return (
      <div className="App" style={fondo}>
            <div  style={fondo2}>
                <Switch>
                    <Route exact path="/" component={()=>{return <Login />}}/>
                    <Route path="/error" component={()=>{return <ErrorPage />}}/>
                </Switch>
            </div>
      </div>
    );
  }
}

export default App;
