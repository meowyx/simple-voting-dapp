// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Define a contract named Voting
contract Voting {
    // Define a struct to represent a candidate
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // Array to store all candidates
    Candidate[] public candidates;
    // Address of the contract owner
    address owner;
    // Mapping to keep track of voters
    mapping(address => bool) public voters;

    // Timestamps for voting period
    uint256 public votingStart;
    uint256 public votingEnd;

    // Constructor function to initialize the contract
    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        // Add initial candidates to the array
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        // Set the contract owner
        owner = msg.sender;
        // Set voting period start and end times
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // Modifier to restrict access to owner only
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // Function to add a new candidate (only owner can call)
    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({
                name: _name,
                voteCount: 0
        }));
    }

    // Function for voters to cast their vote
    function vote(uint256 _candidateIndex) public {
        // Check if the voter hasn't voted before
        require(!voters[msg.sender], "You have already voted.");
        // Check if the candidate index is valid
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        // Increment the vote count for the chosen candidate
        candidates[_candidateIndex].voteCount++;
        // Mark the voter as having voted
        voters[msg.sender] = true;
    }

    // Function to get all candidates and their vote counts
    function getAllVotesOfCandiates() public view returns (Candidate[] memory){
        return candidates;
    }

    // Function to check if voting is currently active
    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    // Function to get the remaining time for voting
    function getRemainingTime() public view returns (uint256) {
        // Check if voting has started
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        // If voting has ended, return 0
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        // Otherwise, return the remaining time
        return votingEnd - block.timestamp;
    }
}