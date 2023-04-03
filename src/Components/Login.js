import React, { useState } from 'react';
import axios from 'axios';
import './css/util.css';
import './css/main.css';
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import DairyLogo from './images/DairyLogo.jpg'
// import './images/img-01.png';
import { useHistory, Link } from "react-router-dom";

export function Login() {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('https://visakha-dairy-backend.onrender.com/', {
        user_name,
        password
      });
      localStorage.setItem('token', response.data.token);
      setErrorMessage('');
      history.push('/home')
      // window.location.href = '/home';
    } catch (err) {
      setErrorMessage(err.response.data.message);
    }
  }

  return (
    <div>
      {/* <h2>Login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_name">user_name</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={user_name}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form> */}


      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img src={DairyLogo} alt="IMG" />
            </div>

            <form className="login100-form validate-form" onSubmit={handleSubmit}>
              <span className="login100-form-title">Member Login</span>

              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  id="user_name"
                  value={user_name}
                  onChange={handleUsernameChange}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              {errorMessage && <div className="error">{errorMessage}</div>}

              <div className="container-login100-form-btn">
                <button className="login100-form-btn">Login</button>
              </div>

              {/* <div className="text-center p-t-12">
              <span className="txt1">Forgot</span>
              <a className="txt2" href="#">
                Username / Password?
              </a>
            </div> */}

              {/* <div className="text-center p-t-136">
              <a className="txt2" href="#">
                Create your Account
                <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </a>
            </div> */}
            </form>
          </div>
        </div>
      </div>


    </div>
  );
}
