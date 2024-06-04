
import { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { Context } from '../main';



const NavigationButtons = () => {
    const navigate = useNavigate();
    let {store} = useContext(Context);
  
    return (
      <div>
        <button onClick={() => navigate('/')}>Main Page</button>
        <button onClick={() => navigate('/auth')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <button onClick={() => {store.logout()
          navigate('/')}}>Logout</button>
      </div>
    );
};

export default NavigationButtons;