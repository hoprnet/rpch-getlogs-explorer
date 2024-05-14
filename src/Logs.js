/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const UPDATE_INTERVAL_MS = 1_000;
const RPC = 'https://rpc.gnosischain.com';

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC),
})

export default function Logs() {
  const [blockNumber, set_blockNumber] = useState(null);
  const [chosenBlock, set_chosenBlock] = useState(null);
  const [blockLoading, set_blockLoading] = useState(false);
  const [transationsLoading, set_transationsLoading] = useState(false);
  const [transactions, set_transactions] = useState([]);
  const [chosenTx, set_chosenTx] = useState(null);
  const [tx, set_tx] = useState([]);
  const [txLoading, set_txLoading] = useState(false);
  const [blocks, set_blocks] = useState([]);
  const [lastUpdate, set_lastUpdate] = useState(null);


  useEffect(() => {
    async function getBlockNumberWrapper() {
      if(blockLoading) return;
      let loaded = false;
      let tryNumber = 0;
      while(!loaded) {
        try {
          set_blockLoading(true);
          const blockNumberTmp = await client.getBlockNumber();
          set_lastUpdate(Date.now());
          set_blockNumber(Number(blockNumberTmp));
          addBlock(Number(blockNumberTmp));
          set_blockLoading(false)
          loaded = true;
        } catch (e) {
          await sleep(tryNumber);
          tryNumber++;
        }
      }
    }

    getBlockNumberWrapper();
    const interval = setInterval(() => {
      getBlockNumberWrapper();
    }, UPDATE_INTERVAL_MS);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [blockLoading]);


  const addBlock = (block) => {
    set_blocks(prev => {
      if (prev.length === 0) return [block];
      else {
        if (prev[prev.length - 1] + 1 === block) {
          return [...prev, block];
        }
        else if (block > prev[prev.length - 1]) {
          let lastSavedBlock = prev[prev.length - 1];
          let newBlocks = block - lastSavedBlock;
          let tmp = [];
          for (let i = 0; i < newBlocks; i++) {
            tmp.push(lastSavedBlock + 1 + i);
          }
          return [...prev, ...tmp];
        }
        else {
          return prev;
        }
      }
    })
  }

  const loadBlock = async (blockNumber) => {
    set_transactions([]);
    set_chosenBlock(blockNumber);
    set_transationsLoading(true);
    set_tx(null);
    set_chosenTx(null);

    let loaded = false;
    let tryNumber = 0;
    while(!loaded) {
      try {
        const block = await client.getBlock({
          nubmer: blockNumber
        })
        set_transactions(block.transactions);
        loaded = true;
      } catch (e) {
        console.error(e)
        e.shortMessage && stringify(e.shortMessage);
        await sleep(tryNumber);
        tryNumber++;
      }
    }
    set_transationsLoading(false);
  }

  const loadTx = async (tx) => {
    set_chosenTx(tx);
    set_tx(null);
    set_txLoading(true);

    let loaded = false;
    let tryNumber = 0;
    while(!loaded) {
      try {
        const transaction = await client.getTransaction({
          hash: tx
        });
        set_tx(transaction);
        loaded = true;
      } catch (e) {
        console.error(e);
        e.shortMessage && set_tx(e.shortMessage);
        await sleep(tryNumber);
        tryNumber++;
      }
    }
    set_txLoading(false);
  }

  const sleep = async (tryNumber) => {
    await new Promise(r => setTimeout(r, tryNumber > 15 ? 15_000 : tryNumber * 1_000));
  }

  const formattedJson = tx && JSON.stringify(tx, (_, v) => typeof v === 'bigint' ? v.toString() : v, 3);

  return (
    <div
      id="whole"
    >
      <div
        id="status"
      >
        Status
        <div>Last update: {lastUpdate ? new Date(lastUpdate).toGMTString() : 'Loading ...'}</div>
        <div>Update interval: {UPDATE_INTERVAL_MS / 1000} sec</div>
        <div>Current block: {blockNumber}</div>
      </div>
      <div
        id="blocks-and-rest"
      >
        <div
          id="blocks"
        >
          <div
            id='blocks-title'
          >
            Blocks created since dApp load:
          </div>
          <div
            id="blocks-list"
          >
            {
              blocks.map(elem =>
                <div
                  onClick={() => { loadBlock(elem) }}
                  className={`block-list-item ${elem === chosenBlock ? 'weight700' : 'weight400'}`}
                >
                  {elem}
                </div>
              )
            }
          </div>
        </div>
        <div
          id="explorer"
        >
          <div
            id="transactions"
          >
            <div
              id="transactions-title"
            >
              {chosenBlock && <>Chosen block <strong>{chosenBlock}</strong> content: </>}
              {!chosenBlock && <>Choose a block!</>}
            </div>
            <div
              id="transactions-list"
            >
              {
                transationsLoading && <strong>Loading...</strong>
              }
              {
                transactions.map(elem =>
                  <div
                    className={`transactions-list-item ${elem === chosenTx ? 'weight700' : 'weight400'}`}
                    onClick={() => { loadTx(elem) }}
                  >
                    {elem}
                  </div>
                )
              }
            </div>
          </div>
          <div
            id="logs"
          >
            <div
              id='logs-title'
            >

              {formattedJson && <>Chosen hash content:</>}
              {!formattedJson && <>Choose a hash!</>}
            </div>
            {
              txLoading && <strong>Loading...</strong>
            }
            <pre
              id="json"
            >
              {formattedJson}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}