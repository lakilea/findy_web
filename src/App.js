import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeScreen from "./pages/home";
import QrScreen from "./pages/qr";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/qr">
            <QrScreen />
          </Route>
          <Route path="/">
            <HomeScreen />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;