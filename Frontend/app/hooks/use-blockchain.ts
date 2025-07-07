import {
  useBlockNumber,
  useContract,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from "@starknet-react/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Abi,
  Account,
  AccountInterface,
  CallData,
  Contract,
  RpcProvider,
} from "starknet";

const REPARKR_CONTRACT_ADDRESS =
  "0x0543733be79a15a98bc5e84b11deeda4c15f5f4a84763b7573090c9ea1da8645";

export const myProvider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
});

// Utility function to perform contract read operations
export function useContractFetch(
  abi: Abi,
  functionName: string,
  args: any[] = []
) {
  const {
    data: readData,
    refetch: dataRefetch,
    isError: readIsError,
    isLoading: readIsLoading,
    error: readError,
  } = useReadContract({
    abi: abi,
    functionName: functionName,
    address: REPARKR_CONTRACT_ADDRESS,
    args: args,
    refetchInterval: 1000,
  });

  return { readData, dataRefetch, readIsError, readIsLoading, readError };
}

// Utility function to perform contract write operations
export function useContractWriteUtility(
  functionName: string,
  args: any[],
  abi: any
) {
  const { contract } = useContract({ abi, address: REPARKR_CONTRACT_ADDRESS });

  const calls = useMemo(() => {
    if (
      !contract ||
      !args ||
      args.some((arg) => arg === undefined || arg === null || arg === "")
    ) {
      return undefined;
    }

    return [contract.populate(functionName, args)];
  }, [contract, functionName, args]);

  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useSendTransaction({ calls });

  const {
    isLoading: waitIsLoading,
    data: waitData,
    status: waitStatus,
    isError: waitIsError,
    error: waitError,
  } = useTransactionReceipt({
    hash: writeData?.transaction_hash,
    watch: true,
  });

  return {
    writeAsync,
    writeData,
    writeIsPending,
    waitIsLoading,
    waitData,
    waitStatus,
    waitIsError,
    waitError,
    calls,
  };
}

export async function readContractWithStarknetJs(
  functionName: string,
  args: any[] = []
): Promise<any> {
  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
  });

  // Get the contract ABI from the chain
  const { abi } = await provider.getClassAt(REPARKR_CONTRACT_ADDRESS);
  if (!abi) {
    throw new Error("No ABI found for the contract.");
  }

  // Instantiate contract
  const contract = new Contract(abi, REPARKR_CONTRACT_ADDRESS, provider);

  // Dynamically call the function
  if (typeof contract[functionName] !== "function") {
    throw new Error(
      `Function '${functionName}' does not exist on the contract.`
    );
  }

  const result = await contract[functionName](...args);
  return result;
}

export async function writeContractWithStarknetJs(
  account: AccountInterface,
  entrypoint: string,
  args: any //Object of arguments e.g. {uri: "1234"}
) {
  const result = await account.execute({
    contractAddress: REPARKR_CONTRACT_ADDRESS,
    entrypoint,
    calldata: CallData.compile(args),
  });

  const status = await myProvider.waitForTransaction(result.transaction_hash);

  return { result, status };
}
