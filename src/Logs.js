import React, { useState, useEffect } from 'react';
import { config } from './config-wagmi'

import { getBlockNumber } from '@wagmi/core'
import { getBlock } from '@wagmi/core'
import { getTransaction } from '@wagmi/core'

/* eslint-disable */

const UPDATE_INTERVAL_MS = 4_000;

export default function Logs() {
  const [blockNumber, set_blockNumber] = useState(null);
  const [chosenBlock, set_chosenBlock] = useState(null);
  const [transations_Loading, set_transations_Loading] = useState(false);
  const [transactions, set_transactions] = useState([]);
  const [chosenTx, set_chosenTx] = useState(null);
  const [tx, set_tx] = useState([]);
  const [tx_Loading, set_tx_Loading] = useState(false);
  const [blocks, set_blocks] = useState([]);
  const [lastUpdate, set_lastUpdate] = useState(null);
  const [history, set_history] = useState({});

  useEffect(() => {
    async function getBlockNumberWrapper() {
      const blockNumberTmp = await getBlockNumber(config);
      set_lastUpdate(Date.now());
      set_blockNumber(Number(blockNumberTmp));
      addBlock(Number(blockNumberTmp));
    }

    getBlockNumberWrapper();
    const interval = setInterval(() => {
      getBlockNumberWrapper();
    }, UPDATE_INTERVAL_MS);

    //Clearing the interval
    return () => clearInterval(interval);
  }, []);

  const addBlock = (block) => {
    set_blocks(prev => {
      if (prev.length === 0) return [block];
      else {
        if (prev[prev.length -1] + 1 === block) {
          return [...prev, block];
        }
        else if (block > prev[prev.length -1]) {
          let lastSavedBlock = prev[prev.length -1];
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
    set_transations_Loading(true);
    set_tx(null);
    set_chosenTx(null);
    try {
      const block = await getBlock(config, {
        blockNumber: blockNumber
      })
      set_transactions(block.transactions)
      console.log(block)
    } catch (e) {
      console.error(e)
    }
    set_transations_Loading(false);
  }

  const loadTx = async (tx) => {
    set_chosenTx(tx);
    set_tx(null);
    set_tx_Loading(true);
    try {
      const transaction = await getTransaction(config, {
        hash: tx
      })
      set_tx(transaction)
      console.log(transaction)
    } catch (e) {
      console.error(e)
    }
    set_tx_Loading(false);
  }

  const formattedJson = tx && JSON.stringify(tx, (_, v) => typeof v === 'bigint' ? v.toString() : v, 3);

  return (
    <div
      id="whole"
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        id="status"
        style={{
          display: 'none',
        }}
      >
        Status
        <div>Last update: {lastUpdate ? new Date(lastUpdate).toGMTString() : 'Loading ...'}</div>
        <div>Update interval: {UPDATE_INTERVAL_MS / 1000} sec</div>
        <div>Current block: {blockNumber}</div>
      </div>
      <div
        id="blocks-and-rest"
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          id="blocks"
          style={{
            maxHeight: 'calc( 100vh - 200px )',
            width: '150px',
          }}
        >
            <div
              style={{
                marginBottom: '8px'
              }}
            >
              Blocs created since dApp load:
            </div>
              <div
                id="blocks-list"
                style={{
                  maxHeight: 'calc( 100vh - 200px )',
                  width: '150px',
                  overflow: 'auto',
                  marginRight: '16px',
                  marginLeft: '16px'
                }}
              >
                {
                  blocks.map(elem =>
                  <div
                    onClick={()=>{loadBlock(elem)}}
                    style={{
                      fontWeight: elem === chosenBlock ? '700' : '400',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginBottom: '4px'
                    }}
                  >
                    {elem}
                  </div>
                  )
                }
                </div>
        </div>
        <div
          id="explorer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
          }}
        >
          <div
            id="transactions"
            style={{
              height: '330px',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                marginBottom: '8px'
              }}
            >
              Chosen block <strong>{chosenBlock}</strong> content:
            </div>
            <div
                id="transactions-list"
                style={{
                  maxHeight: '300px',
                  overflow: 'auto',
                  maxWidth: '660px',
                  width: '100%',
                  margin: 'auto',
                }}
              >
                {
                  transations_Loading && <strong>Loading...</strong>
                }
                {
                  transactions.map(elem =>
                    <div
                      onClick={()=>{loadTx(elem)}}
                      style={{
                        fontWeight: elem === chosenTx ? '700' : '400',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginBottom: '4px'
                      }}
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
              style={{
                marginBottom: '8px'
              }}
            >
              Chosen hash content:
            </div>
            {
              tx_Loading && <strong>Loading...</strong>
            }
            <pre
              id="json"
              style={{
                maxWidth: '100vw',
                overflowWrap: 'anywhere',
                wordBreak: 'break-all',
                whiteSpace: 'pre-line',
                margin: '16px',
              }}
            >
               {formattedJson}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}