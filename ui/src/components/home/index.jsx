import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  Typography,
} from '@material-ui/core';
import { colors } from '../../theme'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

import ColoredLoader from '../loader/coloredLoader'
import Snackbar from '../snackbar'

import { WalletConnectionError } from '../../constants'

import Store from "../../stores";
const store = Store.store

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },
  card: {
    flex: '1',
    height: '25vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0px',
    transition: 'background-color 0.2s linear',
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      minWidth: '20%',
      minHeight: '50vh',
    }
  },
  gradient: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: '#00AEE9',
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
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
  title: {
    padding: '24px 0 12px 0',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
  },
  subTitle: {
    padding: '0 0 12px 0',
    fontSize: '12px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  }
}));

export default function Home() {
  const classes = useStyles();
  const [snackbarMessage, setSnackbarMessage] = useState(null)
  const [snackbarType, setSnackbarType] = useState(null)
  const [loading, setLoading] = useState(false)

  const renderSnackbar = () => {
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  }

  const faucet = async () => {
    if (!loading) {
      setSnackbarMessage(null)
      setSnackbarType(null)
      setLoading(true)
  
      const hmy = store.getStore('hmy')
      
      try {
        const res = await store.useFaucet()
  
        if (res.status === 'called' || res.status === 'call') {
          const url = `${hmy.explorerUrl}/tx/${res.transaction.receipt.transactionHash}`
          setSnackbarMessage(url)
          setSnackbarType("Hash")
          setLoading(false)
        } else {
          setSnackbarMessage("An error occurred :(. Please try again!")
          setSnackbarType("Error")
          setLoading(false)
        }
      } catch (error) {
        if (error instanceof WalletConnectionError) {
          setSnackbarMessage("Please connect a wallet and then try again!")
        } else {
          setSnackbarMessage("An error occurred :(. Please try again!")
        }
  
        setSnackbarType("Error")
        setLoading(false)
      }
    }
  }

  return (

    <div className={ classes.root }>
              <Card className={ `${classes.card} ${classes.gradient}` } >

        <AttachMoneyIcon className={ `${classes.icon} icon` } />
        <Typography variant={'h2'} className={ `${classes.title} title` }>What Time Is On Time Today?</Typography>
        <Typography variant={'h3'} className={ `${classes.title} title` }>Bet against Ivan's Atomic Clock</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>Stake One tokens against time range you think Ivan will start the show.</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>Winner(s) take all.</Typography>
        <Typography variant={'h3'} className={ `${classes.title} title` }>Project History</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>The project started with me seeking to port the Augur Protocol to Harmony chain.</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>That didn't workout for various reasons, mainly time.</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>I decided to take a step back and look at the good and bad parts of the project with an eye to building something myself.</Typography>
        <Typography variant={'h4'} className={ `${classes.subTitle} title` }>The answer to what would make this project a success is "Community". i.e. Understand and interact with the community and design from there.</Typography>      
    </Card>
      <Card className={ `${classes.card} ${classes.gradient}` } >

        <AttachMoneyIcon className={ `${classes.icon} icon` } />
        <Typography variant={'h3'} className={ `${classes.title} title` }>Stake Betting</Typography>
        <Typography variant={'h3'} className={ `${classes.title} title` }>&</Typography>
        <Typography variant={'h3'} className={ `${classes.title} title` }>Prediction Markets</Typography>
      </Card>

      { loading && <ColoredLoader /> }
      { snackbarMessage && renderSnackbar() }
    </div>
  )
}
