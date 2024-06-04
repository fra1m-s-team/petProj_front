import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let {store} = useContext(Context);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    store.login(email, password);
    navigate('/');
  };


  store.checkAuth()

  if(localStorage.getItem('token') && store.isAuth){
    return (
      <div>
        <h2>Вы уже авторизированны</h2>
        {store.user.name}
      </div>
    )
  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
