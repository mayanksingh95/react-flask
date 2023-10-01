import React from "react";
import "./App.css";
import { MovieComponent } from "./components/MovieComponent";
import { Container } from "semantic-ui-react";
import { About } from "./components/About";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Secret } from "./components/Secret";
import { Header } from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useAuth } from "./components/Auth"


function App() {


  let [logged] = useAuth();





  const PrivateRoute = ({ component: Component, ...rest }) => {
    const [logged] = useAuth();

    console.log(logged)
    return <Route {...rest} render={(props) => (
      logged
        ? <Component {...props} />
        :
        <Redirect to='/login' />
    )} />

  }




  return (
    <>
      <Router>

        <Header islogin={logged} />
        <Switch>
          <Route exact path="/" render={() => {
            return (
              <Container style={{ marginTop: 40 }}>

                {logged ? (
                  <MovieComponent />
                ) : <h2>You are not logged in!</h2>}
              </Container >
            )
          }}>
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/secret" component={Secret} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
