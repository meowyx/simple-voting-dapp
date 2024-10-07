import React from "react";

interface FinishedProps {
  message?: string;
}

const Finished: React.FC<FinishedProps> = ({
  message = "Voting is Finished",
}) => {
  return (
    <div className="login-container">
      <h1 className="welcome-message">{message}</h1>
    </div>
  );
};

export default Finished;
