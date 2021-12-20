import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Movies from "./Routes/Movies";
import TvShow from "./Routes/TvShow";
import Search from "./Routes/Search";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path = "/tv">
          <TvShow />
        </Route>
        <Route path = "/search">
          <Search />
        </Route>
        <Route path = {["/", "/movies/:movieID"]}>
        {/* /movies/:movieId에 있을 때에도 Home을 render함 */}
          <Movies />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
