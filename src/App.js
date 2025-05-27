import  {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignUp from './Components/Pages/SignUp';

function App() {
  return (
  <div className = "App">
   <Router>
    <Routes>
    <Route path = "/signup" element = {<SignUp/>}/>  
    </Routes>
   </Router>
  </div>
  );
}

export default App;
