
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationButtons from './navbar';
import MainPage from './mainpage';
import LoginPage from './auth';
import RegisterPage from './register';





const App = () => (
  
  <div className="App">
    <Router>
      <NavigationButtons />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </Router>
  </div>
);

export default App;
