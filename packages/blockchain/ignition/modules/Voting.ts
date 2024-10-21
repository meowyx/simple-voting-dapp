// Import the buildModule function from Hardhat Ignition
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Define a module named "VotingModule"
const VotingModule = buildModule("VotingModule", (m) => {
  // Set default values for candidates and voting duration
  const DEFAULT_CANDIDATES = ["Candidate 1", "Candidate 2", "Candidate 3"];
  const DEFAULT_DURATION_MINUTES = 60; // 1 hour

  // Get parameters with default values
  // These can be overridden when deploying the module
  const candidateNames = m.getParameter("candidateNames", DEFAULT_CANDIDATES);
  const durationInMinutes = m.getParameter(
    "durationInMinutes",
    DEFAULT_DURATION_MINUTES
  );

  // Deploy the Voting contract
  // Pass the default candidates and duration to the constructor
  const voting = m.contract("Voting", [
    DEFAULT_CANDIDATES,
    DEFAULT_DURATION_MINUTES,
  ]);

  // Return the deployed contract
  return { voting };
});

// Export the VotingModule for use in deployment scripts
export default VotingModule;
