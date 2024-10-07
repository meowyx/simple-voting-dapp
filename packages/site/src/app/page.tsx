"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@consensys/connect-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReadContract, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { contractAddress, contractAbi } from "../../constants";

interface Candidate {
  index: number;
  name: string;
  voteCount: number;
}

export default function Home() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [number, setNumber] = useState("");

  const { writeContract } = useWriteContract();

  const { data: votingStatus } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getVotingStatus",
  }) as { data: Candidate[] };

  const { data: canVote } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "voters",
    args: [address],
  });

  const { data: remainingTime } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getRemainingTime",
  }) as { data: bigint };

  const { data: candidates } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getAllVotesOfCandiates",
  }) as { data: Candidate[] };

  if (!candidates) return;

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

  // async function logContractState() {
  //   try {
  //     const candidatesList = await client.readContract({
  //       address: contractAddress,
  //       abi: contractAbi,
  //       functionName: "getAllVotesOfCandiates",
  //     });
  //     console.log("Current candidates:", candidatesList);

  //     const votingStatus = await client.readContract({
  //       address: contractAddress,
  //       abi: contractAbi,
  //       functionName: "getVotingStatus",
  //     });
  //     console.log("Voting status:", votingStatus);

  //     const remainingTime = await client.readContract({
  //       address: contractAddress,
  //       abi: contractAbi,
  //       functionName: "getRemainingTime",
  //     });
  //     console.log("Remaining time:", remainingTime);
  //   } catch (error) {
  //     console.error("Error logging contract state:", error);
  //   }
  // }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Decentralized Voting Application
      </h1>
      <ConnectButton />

      {votingStatus ? (
        address ? (
          <Card className="mt-4">
            <CardContent>
              <p>Connected Account: {address}</p>
              <p>Remaining Time: {Number(remainingTime)} seconds</p>
              {!canVote ? (
                <div className="mt-4">
                  <Input
                    type="number"
                    placeholder="Enter Candidate Index"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={vote}>Vote</Button>
                </div>
              ) : (
                <p>You have already voted</p>
              )}
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Candidates</h2>
                <ul>
                  {candidates.map((candidate) => (
                    <li key={candidate.index}>
                      {candidates.indexOf(candidate)}: {candidate.name} -{" "}
                      {Number(candidate.voteCount)} votes
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Please connect your wallet to vote</p>
        )
      ) : (
        <p>Voting has finished</p>
      )}
    </main>
  );
}
