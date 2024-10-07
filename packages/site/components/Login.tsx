import React from "react";

interface LoginProps {
  connectWallet: () => void;
}

const Login: React.FC<LoginProps> = ({ connectWallet }) => {
  return (
    <div className="login-container">
      <h1 className="welcome-message">
        Welcome to decentralized voting application
      </h1>
      <button className="login-button" onClick={connectWallet}>
        Login Metamask
      </button>
    </div>
  );
};

export default Login;
