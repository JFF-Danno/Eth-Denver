import React, { useState, useEffect } from "react"
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Harmony } from '@harmony-js/core'
import { ChainID,  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit, } from '@harmony-js/utils'
import { contractConfig } from './config.js'
import {hexToAscii} from 'web3-utils';
import { colors } from "../../theme";
import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  ERROR,
  WalletConnectionError
} from '../../constants'
import { toBech32 } from '@harmony-js/crypto'
import UnlockModal from '../unlock/unlockModal.jsx'
import Balances from './balances.jsx'
import Store from "../../stores";

const {
  ChainType
} = require('@harmony-js/utils');

const { ContractFactory } = require('@harmony-js/contract');
const store = Store.store
const emitter = Store.emitter
const web3 = require('web3');
const useStyles = makeStyles(theme => ({
  headerContainer: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 999,
    display: 'flex',
  },
    staked: { background: '#444444' },
  actionButton: {
    background: '#bcecfd',
    color: '#00AEE9',
    borderColor: '#00AEE9',
    '&:hover': {
      color: `${colors.white} !important`
    }
  },
  gradient: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: '#00AEE9',
      '& .title': {
        color: `${colors.white} !important`
      },
      '& .icon': {
        color: `${colors.white} !important`
      }
    },
    '& .title': {
      color: '#00AEE9',
    },
    '& .icon': {
      color: '#00AEE9'
    },
  },
  green: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.compoundGreen,
    },
    '& .icon': {
      color: colors.compoundGreen
    },
  },
  account: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flex: '0'
    }
  },
  walletAddress: {
    padding: '12px',
    border: '2px solid rgb(174, 174, 174)',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      border: "2px solid "+colors.borderBlue,
      background: 'rgba(47, 128, 237, 0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'absolute',
      transform: 'translate(0, 200%)',
      border: "1px solid "+colors.borderBlue,
      background: colors.white
    }
  }
}));

export default function Header() {
  const classes = useStyles();
  const [account, setAccount] = useState(store.getStore('account'))
  const [modalOpen, setModalOpen] = useState(false)
  const [time2, setTime] = useState(0);
  const [looper, setStart] = useState(false);
  var [lastIndex, setIndex] = useState(0);

  useEffect(() => {

    setTime(getTime())
    if ( ! looper )
    {
        ping()
        setStart(true);
    }
    const connectionChanged = () => { 
      setAccount(store.getStore('account'))
    }

    emitter.on(CONNECTION_CONNECTED, connectionChanged)
    emitter.on(CONNECTION_DISCONNECTED, connectionChanged)

    return () => {
      emitter.removeListener(CONNECTION_CONNECTED, connectionChanged)
      emitter.removeListener(CONNECTION_DISCONNECTED, connectionChanged)
    }
  }, [])

  var address = null;
  if (account.address) {
    address = toBech32(account.address)
    address = `${address.substring(0,6)}...${address.substring(address.length-4,address.length)}`
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const renderModal = () => {
    return (
      <UnlockModal closeModal={ closeModal } modalOpen={ modalOpen } />
    )
  }

const hmy = new Harmony(
  contractConfig.url,
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
)

function getTime()
{
    var d = new Date();
    var timeMins = d.getMinutes();
    document.getElementById( 'time' ).innerHTML = ( d.getHours() ) + ' ' + addZero( d.getMinutes() );
   // alert( 'get time ' );
    return timeMins;
}

function addZero(i)
{  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const contractPrizePoolGame = hmy.contracts.createContract(contractConfig.abiPrizePool, contractConfig.address);

var contractaddress1 ='.....';
var oldbalance = 0;
var time = 0;
async function ping()
{
    var d = new Date();
    time = d.getMinutes();
    loop();
}


var loaded = false;
function loop()
{
    setTimeout(() => setTime(getTime) , 1000);

    var current = getCurrentIndex();
 //   alert( 'index ' + current + ' last ' + lastIndex );
    if ( current != lastIndex )
    {   
        lastIndex = current;
        document.getElementById( 'stakes' ).innerHTML ='Reloading';
        getStakes();
    }

    setTimeout(function () { loop();}, 30000);
}

var rewardPings = [0,0,0,0,0];
var panelNames = [ '< 8.35','8.35 - 8.40','8.40 - 8.45','8.45 - 8.50','8.50 - 8.55','8.55 >' ];

async function getStakes()
{

    document.getElementById( 'stakes' ).innerHTML ='';
    const account = store.getStore('account');
    var prizePoolTotal = await contractPrizePoolGame.methods.getTotalPrizePool().call();

    document.getElementById( 'price' ).innerHTML = 'Total Prize Pool : ' + web3.utils.fromWei( prizePoolTotal );
    for ( var i = 1; i < 8; i++ )
    {
        var holders = await contractPrizePoolGame.methods.getTotalHolders( i ).call();
        var fStaked = await contractPrizePoolGame.methods.hasStaker( i ).call();
        var myStake = await contractPrizePoolGame.methods.isMyStake( account.address, i ).call();
        var stakeClass = isCurrent( i ) ? ' staked' : '';
        document.getElementById( 'stakes' ).innerHTML = document.getElementById( 'stakes' ).innerHTML + '<div id="stake' + i + '" class="stakebox' + stakeClass + '" ><h2>' + panelNames[i - 1] + '<h2><h4>Stakers : ' + holders + '</h4>'+ ( myStake ?  '<h4 id="curent' + i + '"> This My Stake :-) </h4>' : '' ) + ( isCurrent( i ) ? '<img  class="pants" src="pants.gif" />' : '' ) + '</div>';
    }
  
}


function isCurrent(index)
{
    var d = new Date();
    var currentTime = d.getMinutes();
    if ( index == 1 ) { return ( currentTime < 35 ); }
    if ( index == 2 ) { return ( currentTime >= 35 && currentTime < 40 ); }
    if ( index == 3 ) { return ( currentTime >= 40 && currentTime < 45 ); }
    if ( index == 4 ) { return ( currentTime >= 45 && currentTime < 50 ); }
    if ( index == 5 ) { return ( currentTime >= 50 && currentTime < 55 ); }
    if ( index == 6 ) { return ( currentTime > 55  ); }

}

function getCurrentIndex()
{
    var d = new Date();
    var currentTime = d.getMinutes();
    
    if ( currentTime < 35 ){ return 1 }
    if ( currentTime >= 35 && currentTime < 40 ){ return 2 }
    if ( currentTime >= 40 && currentTime < 45 ){ return 3 }
    if ( currentTime >= 45 && currentTime < 50 ){ return 4 }
    if ( currentTime >= 50 && currentTime < 55 ){ return 5 }
    return 6;
}


async function AddToStake1()
{
    AddToStake( 1 );
}
async function AddToStake2()
{
    AddToStake( 2 );
}
async function AddToStake3()
{
    AddToStake( 3 );
}
async function AddToStake4()
{
    AddToStake( 4);
}
async function AddToStake5()
{
    AddToStake( 5 );
}
async function AddToStake6()
{
    AddToStake( 6 );
}


async function AddToStake( index )
{
    var GAS_LIMIT=3321900;
    var GAS_PRICE=1000000000;
     
    const account = store.getStore('account')
    const context = store.getStore('web3context')
    var connector = null

    if (context) {
      connector = context.connector
    }

    if (!connector) {
      throw new WalletConnectionError('No wallet connected')
    }

    const options = {  gasPrice: GAS_PRICE, gasLimit: GAS_LIMIT, value: 10000000000000000000 };   
    var contractConnected  = await connector.attachToContract( contractPrizePoolGame );
    const addCall = await contractConnected.methods.addMoney( index ).send( options ).then(
                response => {console.log('contract deployed at ' + response.transaction.receipt.contractAddress); 
                            alert( 'adding to stake - tx ' + response.transaction.receipt.contractAddress ); }
    );
    document.getElementById( 'stakes' ).innerHTML = '';
    getStakes();
}

async function RemoveStake1()
{
    RemoveStake( 0 );
}
async function RemoveStake2()
{
    RemoveStake( 1 );
}
async function RemoveStake3()
{
    RemoveStake( 2 );
}
async function RemoveStake4()
{
    RemoveStake( 3 );
}
async function RemoveStake5()
{
    RemoveStake( 4 );
}


async function RemoveStake( index )
{

//    var index = 0;
    var GAS_LIMIT=3321900;
    var GAS_PRICE=1000000000;
    const account = store.getStore('account')
    const context = store.getStore('web3context')
    var connector = null

    if (context) {
      connector = context.connector
    }

    if (!connector) {
      throw new WalletConnectionError('No wallet connected')
    }

    const options = {  gasPrice: GAS_PRICE, gasLimit: GAS_LIMIT };
    var contractConnected  = await connector.attachToContract( contractPrizePoolGame );

    const addCall = await contractConnected.methods.payOut( index ).send( options )
    .then(
                       
            response => {console.log('contract deployed at ' + response.transaction.receipt.contractAddress); 
                            alert( 'withdrawing stake - tx ' + response.transaction.receipt.contractAddress ); }
        );
        document.getElementById( 'stakes' ).innerHTML = '';
        getStakes();
}

var accountBalance = 0;
async function getBalance()
{
       hmy.blockchain
                  .getBalance({ address: account.address } )
                  .then( (response) => 
                   {    
                        accountBalance = web3.utils.fromWei(hexToNumber(response.result) );
                        document.getElementById( 'balance' ).innerHTML = 'Balance One Tokens : ' + accountBalance;                  
                   } )
}



  return (
    <div className={ classes.headerContainer }>

      <div className={ classes.account }>


        { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake1} >
            Bet on pre 8.35am
          </Typography>
        }

         { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake2} >
            Bet on 8.35am to 8.40am
          </Typography>
        }



     { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake3} >
            Bet on 8.40am to 8.45am
          </Typography>
        }


        { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake4} >
            Bet on 8.45am to 8.50am
          </Typography>
        }



       { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake5} >
            Bet on 8.50am to 8.55am
          </Typography>
        }
        { address &&
          <Typography variant={ 'h5'} className={ `${classes.walletAddress} ${classes.gradient}` } noWrap onClick={AddToStake6} >
            Bet on post 8.55am
          </Typography>
        }



      </div>

    </div>
  );

}
