import { Box, Typography } from '@mui/material'
import './LoginSuccess.css'
import React, { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom';

export default function SuccessSignIn () {
  const [time, setTime] = React.useState(2)
  const navigate = useNavigate();
  useEffect(()=>{
    if(time === 0){
      navigate('/')
    }
    setTimeout(()=>{
      setTime(time-1)
    },1000)
  })
  return (
    <>
      <Box id="success" sx={{display: 'flex', flexDirection: 'column', width: '100dvw', height: '91.4dvh', justifyContent: 'center', alignItems: 'center'}}>
        <Confetti />
        <Typography id="h1" variant='h1'>Welcome to Eco Ride Back!!</Typography>
        <Typography id="h4" variant='h4'>Login Successful</Typography>
        <Typography id="h5" variant='body1'>Redirecting to your page in {time} seconds...</Typography>
      </Box>
    </>
  )
}