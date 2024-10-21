"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@consensys/connect-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReadContract, useWriteContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contractAddress, contractAbi } from "../../constants";
import { Vote, Clock, User, CheckCircle2 } from "lucide-react";

// Define the structure of a Candidate
interface Candidate {
  index: number;
  name: string;
  voteCount: number;
}

export default function Component() {
  // Get the connected account's address
  const { address } = useAccount();
  // Get the wallet client
  const { data: walletClient } = useWalletClient();
  // State for the input field
  const [number, setNumber] = useState("");

  // Hook for writing to the contract
  const { writeContract } = useWriteContract();

  // Read the voting status from the contract
  const { data: votingStatus } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getVotingStatus",
  }) as { data: Candidate[] };

  // Check if the current user can vote
  const { data: canVote } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "voters",
    args: [address],
  });

  // Get the remaining time for voting
  const { data: remainingTime } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getRemainingTime",
  }) as { data: bigint };

  // Get all candidates and their vote counts
  const { data: candidates } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllVotesOfCandiates",
  }) as { data: Candidate[] };

  if (!candidates) return null;

  // Function to cast a vote
  async function vote() {
    if (!walletClient || !address || number === "") {
      console.error("Missing required data for voting");
      return;
    }
    if (
      isNaN(Number(number)) ||
      Number(number) < 0 ||
      Number(number) >= candidates.length
    ) {
      console.error("Invalid candidate index");
      return;
    }
    if (!votingStatus) {
      console.error("Voting is not currently active");
      return;
    }
    try {
      console.log("Attempting to vote for candidate index:", number);
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "vote",
        args: [BigInt(number)],
        account: address,
      });
    } catch (error) {
      console.error("Detailed error in vote function:", error);
    }
  }

  return (
    <main className="container mx-auto p-4">
      {/* Voting interface card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Vote className="mr-2 h-6 w-6" />
            LineaPoll
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Wallet connection button */}
          <div className="flex justify-end mb-4 hover:cursor-pointer  hover:font-bold p-2 rounded-md">
            <ConnectButton />
          </div>
          {/* Conditional rendering based on voting status and user connection */}
          {votingStatus ? (
            address ? (
              <div className="space-y-4">
                {/* Display connected account */}
                <p className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Connected Account: {address}
                </p>
                {/* Display remaining voting time */}
                <p className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Remaining Time: {Number(remainingTime)} seconds
                </p>
                {/* Voting input and button if user hasn't voted yet */}
                {!canVote ? (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter Candidate Index"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={vote}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Vote
                    </Button>
                  </div>
                ) : (
                  <p className="text-green-500 font-semibold">
                    You have already voted
                  </p>
                )}
              </div>
            ) : (
              <p className="text-yellow-500">
                Please connect your wallet to vote
              </p>
            )
          ) : (
            <p className="text-red-500">Voting has finished</p>
          )}
        </CardContent>
      </Card>
      {/* Candidates list card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {/* Map through candidates and display their info */}
            {candidates.map((candidate) => (
              <li
                key={candidate.index}
                className="flex justify-between items-center p-2 bg-secondary rounded-md"
              >
                <span>
                  {candidates.indexOf(candidate)}: {candidate.name}
                </span>
                <span className="font-semibold">
                  {Number(candidate.voteCount)} votes
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
