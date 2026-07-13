import {
  Button,
  Paper,
  TextField,
  Box,
  Autocomplete,
  Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import './RideCard.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'

const RideCard = () => {
  const [status, setStatus] = useState('')
  const [locationFirstName, setLocationFirstName] = useState('')
  const [goingLocationFirstName, setGoingLocationFirstName] = useState('')
  const [leaving, setLeaving] = useState('')
  const [going, setGoing] = useState('')
  const [availableSeats, setSeats] = useState('')
  const [price, setPrice] = useState('')
  const [carName, setCarName] = useState('')
  const [date, setDate] = useState('')
  const [carNumber, setCarNumber] = useState('')
  const [endTime, setEndTime] = useState('2:30 PM')
  const [startTime, setStartTime] = useState('')

  const [suggestions, setSuggestions] = useState([])
  const [leavingFromLatitude, setLeavingFromLatitude] = useState(null)
  const [leavingFromLongitude, setLeavingFromLongitude] = useState(null)
  const [goingToLatitude, setGoingToLatitude] = useState(null)
  const [goingToLongitude, setGoingToLongitude] = useState(null)
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  const logindata = useSelector((state) => state.loginReducer)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = {}
    const no = 'no'
    if (!leaving) newErrors.leaving = 'This field is required'
    if (!going) newErrors.going = 'This field is required'
    if (!availableSeats) newErrors.availableSeats = 'This field is required'
    if (!price) newErrors.price = 'This field is required'
    if (!carName) newErrors.carName = 'This field is required'
    if (!date) newErrors.date = 'This field is required'
    if (!startTime) newErrors.startTime = 'This field is required'
    if (!carNumber) newErrors.carNumber = 'This field is required'

    setErrors(newErrors)

    let finalGoingFirstName = goingLocationFirstName
    if (goingLocationFirstName === 'Sri Krishna College of Engineering and Technology') {
      finalGoingFirstName = 'SKCET'
    }

    if (Object.keys(newErrors).length === 0) {
      const rideDetails = {
        driver_id: logindata.id,
        name: logindata.firstName + ' ' + logindata.lastName,
        email: logindata.email,
        phone: logindata.phoneNumber,
        leaving,
        car_number: carNumber,
        going,
        available_seats: parseInt(availableSeats),
        price: parseInt(price),
        car_name: carName,
        date,
        start_time: startTime,
        end_time: endTime,
        ride_completion_status: no,
        location_first_name: locationFirstName,
        going_location_first_name: finalGoingFirstName,
        leaving_from_latitude: leavingFromLatitude,
        leaving_from_longitude: leavingFromLongitude,
        going_to_latitude: goingToLatitude,
        going_to_longitude: goingToLongitude,
      }

      const { error } = await supabase.from('rides').insert(rideDetails)

      if (!error) {
        setStatus('success')
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ride details submitted successfully!',
        })
      } else {
        console.error('Error submitting ride:', error)
        setStatus('error')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error submitting the ride details.',
        })
      }
    }
  }

  useEffect(() => {
    if (leaving !== '') {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${leaving}&format=json&apiKey=7150d3d1879642babb4e29c827ae645b`
      )
        .then((response) => response.json())
        .then((result) => {
          const newSuggestions = result.results.map((item) => ({
            label: `${item.address_line1} ${item.address_line2}`,
            value: item,
          }))
          setSuggestions(newSuggestions)
        })
        .catch((error) => console.log('error', error))
    }
  }, [leaving])

  useEffect(() => {
    if (going !== '') {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${going}&format=json&apiKey=7150d3d1879642babb4e29c827ae645b`
      )
        .then((response) => response.json())
        .then((result) => {
          const newSuggestions = result.results.map((item) => ({
            label: `${item.address_line1} ${item.address_line2}`,
            value: item,
          }))
          setSuggestions(newSuggestions)
        })
        .catch((error) => console.log('error', error))
    }
  }, [going])

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        position: 'relative',
        alignItems: 'center',
      }}
    >
      <Paper
        className="paper-comp"
        elevation={5}
        sx={{
          borderRadius: '20px',
          height: 'auto',
          width: '40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '50px',
          backgroundColor: 'white',
          overflow: 'auto',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          component="form"
          sx={{ flexGrow: 1 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Leaving From"
                    variant="outlined"
                    onChange={(e) => setLeaving(e.target.value)}
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setLeaving(newValue.label)
                    setLeavingFromLatitude(newValue.value.lat)
                    setLeavingFromLongitude(newValue.value.lon)
                    setLocationFirstName(newValue.value.address_line1)
                  } else {
                    setLeaving('')
                    setLeavingFromLatitude(null)
                    setLeavingFromLongitude(null)
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={suggestions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Going To"
                    variant="outlined"
                    onChange={(e) => setGoing(e.target.value)}
                  />
                )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setGoing(newValue.label)
                    setGoingLocationFirstName(newValue.value.address_line1)
                    setGoingToLatitude(newValue.value.lat)
                    setGoingToLongitude(newValue.value.lon)
                  } else {
                    setGoing('')
                    setGoingToLatitude(null)
                    setGoingToLongitude(null)
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-availableSeats"
                label="AvailableSeats"
                type="number"
                value={availableSeats}
                onChange={(e) => setSeats(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.availableSeats}
                helperText={errors.availableSeats}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-price"
                label="Price Per Person"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-name"
                label="Car Name"
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.carName}
                helperText={errors.carName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-date"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-start-time"
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.startTime}
                helperText={errors.startTime}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-end-time"
                label="Car Number"
                type="text"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.carNumber}
                helperText={errors.carNumber}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'centers',
            }}
          >
            Create Ride
          </Button>
        </Box>
      </Paper>
      {status === 'success' &&
        setTimeout(() => {
          navigate('/PilotRideHistory')
        }, 2000)}
    </div>
  )
}

export default RideCard
