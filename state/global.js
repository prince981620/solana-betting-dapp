import { createContext,useCallback,useEffect,useState } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet,useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram,getMasterAccountPk,getBetAccountPk } from "../utils/program";
import toast from "react-hot-toast";
import { Children } from "react/cjs/react.production.min";
import { RPC_ENDPOINT } from "../utils";

export const GlobalContext = createContext({
    isConnected: null,
    wallet: null,
    hasUserAccount: null,
    allBets: null,
    fetchBets: null,
})

export const GlobalState = ({children}) => {
    const [program,setProgram] = useState()
    const [isConnected,setIsConnected] = useState()
    const [masterAccount,setMasterAccount] = useState()
    const [allBets,setAllBets] = useState()
    const [userBets,setUserBets] = useState()

    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    // set program
    useEffect(()=>{
        if(connection){
            setProgram(getProgram(connection,wallet ?? {}))
        }else {
            setProgram(null);
        }
    },[connection,wallet])

    // check for wallet connection
    useEffect(()=>{
        setIsConnected(!!wallet?.publicKey)
    },[wallet]);

    const fetchMasterAccount = useCallback(async ()=>{
        if(!program) return;
        try{
            const masterAccountPk = await getMasterAccountPk();
            const masterAccount = await program.account.master.fetch(masterAccountPk);
            setMasterAccount(masterAccount);
        }catch(e){
            console.log("Couldn't Fetch Master Account:",e.message);
            setMasterAccount(null);
        }
    })
    // cheeck for master account
    useEffect(()=>{
        if(!masterAccount && program){
            fetchMasterAccount();
        }
    },[masterAccount,program]);

    const fetchBets = useCallback(async()=>{
        if(!program) return;
        const allBetsResult = await program.account.bet.all();
        const allBets = allBetsResult.map((bet)=>bet.account);
        setAllBets(allBets);
        // filter to get just the use bets
    },[program])
    useEffect(()=>{
        // fetch all bets if not alrady
        if(!allBets){
            fetchBets();
        }
    },[allBets,fetchBets])

    const createBet = useCallback(
        async (amount,price,duration,pythPriceKey)=>{
            console.log("inside createbet");
            if(!masterAccount) return;
            try{
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
                const betId = masterAccount.lastBetId.addn(1);
                const res = await getBetAccountPk(betId);
                console.log({betPk: res})
                let bet = await getBetAccountPk(betId);
                let master = await getMasterAccountPk();
                let player = wallet.publicKey;
                console.log(
                    bet.toString(), "Bet",
                    master.toString(),"master",
                    player.toString(),"player"
                )
                const txHash = await program.methods
                .createBet(amount,price,duration,pythPriceKey)
                .accounts({
                    bet: await getBetAccountPk(betId),
                    master: await getMasterAccountPk(),
                    player: wallet.publicKey,
                })
                .rpc({ recentBlockhash: blockhash })
                await connection.confirmTransaction({
                    signature: txHash,
                    blockhash,
                    lastValidBlockHeight,
                });
                console.log("Creeated bet!", txHash);
                toast.success("Created Bet!");
            }catch(e){
                toast.error("Failed! to create Bet");
                console.log(e);
            }
        },[
            masterAccount,
            allBets,
            createBet,
        ]
    )

    return (
        <GlobalContext.Provider
            value={{
                masterAccount,
                allBets,
                createBet,
            }}
            >
                {children}
        </GlobalContext.Provider>
    )
}