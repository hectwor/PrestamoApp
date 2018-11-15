import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import './App.css';
import Login from './Components/login';
import ErrorPage from './Components/ErrorPage';

//import NuevoUsuario from './Components/NuevoUsuario';

class App extends Component {
    render() {
        const fondo = {
            top:'0',
            bottom:'0',
            left:'0',
            right:'0',
            position: 'absolute',
            background : 'linear-gradient(to bottom right, red, yellow)'
        };
    return (
      <div className="App" style={fondo}>
          <Switch>
              <Route exact path="/" component={()=>{return <Login />}}/>
              <Route path="/error" component={()=>{return <ErrorPage />}}/>
          </Switch>
      </div>
    );
  }
}

export default App;
