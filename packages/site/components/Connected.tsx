import React from "react";

interface Candidate {
  index: number;
  name: string;
  voteCount: number;
}

interface ConnectedProps {
  account: string;
  remainingTime: string;
  showButton: boolean;
  number: string;
  handleNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  voteFunction: () => void;
  candidates: Candidate[];
}

const Connected: React.FC<ConnectedProps> = ({
  account,
  remainingTime,
  showButton,
  number,
  handleNumberChange,
  voteFunction,
  candidates,
}) => {
  return (
    <div className="connected-container">
      <h1 className="connected-header">You are Connected to Metamask</h1>
      <p className="connected-account">Metamask Account: {account}</p>
      <p className="connected-account">Remaining Time: {remainingTime}</p>
      {showButton ? (
        <p className="connected-account">You have already voted</p>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter Candidate Index"
            value={number}
            onChange={handleNumberChange}
          />
          <br />
          <button className="login-button" onClick={voteFunction}>
            Vote
          </button>
        </div>
      )}

      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate name</th>
            <th>Candidate votes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Connected;
