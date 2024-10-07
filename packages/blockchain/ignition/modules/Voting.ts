import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  // Default values
  const DEFAULT_CANDIDATES = ["Candidate 1", "Candidate 2", "Candidate 3"];
  const DEFAULT_DURATION_MINUTES = 60; // 1 hour

  // Get parameters with default values
  const candidateNames = m.getParameter("candidateNames", DEFAULT_CANDIDATES);
  const durationInMinutes = m.getParameter(
    "durationInMinutes",
    DEFAULT_DURATION_MINUTES
  );

  // Deploy the Voting contract
  const voting = m.contract("Voting", [
    DEFAULT_CANDIDATES,
    DEFAULT_DURATION_MINUTES,
  ]);

  return { voting };
});

export default VotingModule;
