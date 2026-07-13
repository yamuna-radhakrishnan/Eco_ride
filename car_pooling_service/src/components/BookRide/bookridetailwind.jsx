import { Dialog, Divider, Paper, Typography, Checkbox } from '@mui/material'
import { Button } from '@/components/ui/button'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material'

import './BookRide.css'
import routepng from './Route2.png'
import FilterListIcon from '@mui/icons-material/FilterList'
import RidePaper from './RidePaper'
import car from './car.png'
import man from './man.png'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIdselected } from '../Store/Reducer'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
          color: 'black',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-focused': { color: 'white' },
        },
      },
    },
  },
})

const BookRide = () => {
  const passLongitude = localStorage.getItem('passLongitude')
  const passLatitude = localStorage.getItem('passLati')
  const dispatch = useDispatch()
  const selectedid = useSelector((state) => state.selectedIdReducer)
  const [opendilog, setOpendilog] = useState(false)
  const nav = useNavigate()

  const f = async () => {
    const { data, error } = await supabase.from('rides').select('*')
    if (error) return
    const updatedRidesData = data.map((ride) => {
      const distance = haversine(
        ride.leaving_from_latitude, ride.leaving_from_longitude,
        parseFloat(passLatitude), parseFloat(passLongitude)
      )
      return {
        ...ride,
        id: ride.id, name: ride.name, phone: ride.phone, email: ride.email,
        leaving: ride.leaving, going: ride.going,
        availableSeats: ride.available_seats, price: ride.price,
        carName: ride.car_name, carNumber: ride.car_number,
        date: ride.date, startTime: ride.start_time, endTime: ride.end_time,
        locationFirstName: ride.location_first_name,
        goingLocationFirstName: ride.going_location_first_name,
        leavingFromLatitude: ride.leaving_from_latitude,
        leavingFromLongitude: ride.leaving_from_longitude,
        distance: distance.toFixed(2),
      }
    })
    setRideData(updatedRidesData)
    setAllRideData(updatedRidesData)
    dispatch(setIdselected(1))
  }

  const [rideData, setRideData] = useState([])
  const [AllrideData, setAllRideData] = useState([])

  useEffect(() => { f() }, [])

  const [leavingFromFilters, setLeavingFromFilters] = useState([])
  const [goingToFilters, setGoingToFilters] = useState([])
  let [isOpen, setIsOpen] = useState(true)
  const [passengerLocation, setPassengerLocation] = useState('')
  const [passLatitud, setPassLatitude] = useState()
  const [passLongitud, setPassLongitude] = useState()
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (passengerLocation !== '') {
      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${passengerLocation}&format=json&apiKey=7150d3d1879642babb4e29c827ae645b`)
        .then(r => r.json())
        .then(result => setSuggestions(result.results.map(item => ({ label: `${item.address_line1} ${item.address_line2}`, value: item }))))
        .catch(e => console.log('error', e))
    }
  }, [passengerLocation])

  function open() { setIsOpen(true) }
  function close() { setIsOpen(false) }

  const handleLeavingFromcheckbox = (event) => {
    const value = event.target.value
    setLeavingFromFilters(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  useEffect(() => {
    localStorage.setItem('passLati', passLatitud)
    localStorage.setItem('passLongitude', passLongitud)
    localStorage.setItem('passengerLocation', passengerLocation)
  }, [passLatitud, passLongitud])

  const handleGoingTocheckbox = (event) => {
    const value = event.target.value
    setGoingToFilters(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  const logindata = useSelector((state) => state.loginReducer)

  const handleBookRide = async () => {
    if (logindata.email === '') { alert('please login first'); return }
    await supabase.from('rides').update({ ride_completion_status: 'ongoing' }).eq('id', selectedRideData.id)
    await supabase.from('ride_history').insert({ user_email: logindata.email, ride_id: selectedRideData.id, status: 'upcoming' })
    f()
    nav('/passengerRideHistory')
  }

  const [selectedRideData, setSelectedRideData] = useState({
    id: null, name: '', phone: '', email: '', leaving: '', going: '',
    availableSeats: 0, price: 0, carName: '', carNumber: '', date: '',
    startTime: '', endTime: '', locationFirstName: '', goingLocationFirstName: '',
  })

  const handleFilterChanges = async () => {
    if (leavingFromFilters.length === 0 && goingToFilters.length === 0) return
    let query = supabase.from('rides').select('*')
    if (leavingFromFilters.length > 0) query = query.in('leaving', leavingFromFilters)
    if (goingToFilters.length > 0) query = query.in('going', goingToFilters)
    const { data } = await query
    if (data) setRideData(data.map(ride => ({
      ...ride, id: ride.id, name: ride.name, phone: ride.phone, email: ride.email,
      leaving: ride.leaving, going: ride.going,
      availableSeats: ride.available_seats, price: ride.price,
      carName: ride.car_name, carNumber: ride.car_number,
      date: ride.date, startTime: ride.start_time, endTime: ride.end_time,
      locationFirstName: ride.location_first_name,
      goingLocationFirstName: ride.going_location_first_name,
    })))
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180)
    lat1 = toRadians(lat1); lon1 = toRadians(lon1); lat2 = toRadians(lat2); lon2 = toRadians(lon2)
    const dLat = lat2 - lat1; const dLon = lon2 - lon1
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return 6371 * c
  }

  useEffect(() => {
    const fetchSelected = async () => {
      const { data } = await supabase.from('rides').select('*').eq('id', selectedid.idSelected).single()
      if (data) setSelectedRideData({
        id: data.id, name: data.name, phone: data.phone, email: data.email,
        leaving: data.leaving, going: data.going,
        availableSeats: data.available_seats, price: data.price,
        carName: data.car_name, carNumber: data.car_number,
        date: data.date, startTime: data.start_time, endTime: data.end_time,
        locationFirstName: data.location_first_name,
        goingLocationFirstName: data.going_location_first_name,
      })
    }
    if (selectedid.idSelected > 0) fetchSelected()
  }, [selectedid.idSelected])

  return (
    <div>
      <div className="sortingContainer">
        <div className="pt-1 pb-1 pl-1 flex gap-3 m-3">
          <button className="py-2 px-4 rounded-full text-xs bg-white border border-lightgray flex items-center"
            onClick={() => { const sorted = [...rideData].sort((a, b) => a.distance - b.distance); setRideData(sorted) }}>
            <Typography>Sort</Typography>
          </button>

          <button className="py-2 px-4 rounded-full text-xs bg-white border border-lightgray flex items-center transition-all hover:pl-3 hover:pr-3 hover:pt-2">
            <Typography onClick={() => setOpendilog(!opendilog)}>Filter</Typography>
            <FilterListIcon className="ml-2" />
          </button>

          <Button onClick={open} variant="contained" style={{ backgroundColor: 'black' }}
            className="py-2 px-4 text-sm font-medium text-white rounded-md bg-black">
            Change your location
          </Button>

          <Dialog open={isOpen} onClose={close} className="rounded-lg" maxWidth="xs" fullWidth>
            <DialogTitle className="text-base font-medium text-primary">Current Location:</DialogTitle>
            <DialogContent className="bg-secondary p-6">
              <p className="mt-2 text-sm text-primary">
                Enter your Current Location :{' '}
                <ThemeProvider theme={theme}>
                  <Autocomplete options={suggestions} getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} variant="outlined" onChange={(e) => setPassengerLocation(e.target.value)} />}
                    onChange={(event, newValue) => { if (newValue) { setPassengerLocation(newValue.label); setPassLatitude(newValue.value.lat); setPassLongitude(newValue.value.lon) } }} />
                </ThemeProvider>
              </p>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" style={{ backgroundColor: 'black' }}
                className="py-1.5 px-3 text-sm font-semibold text-white"
                onClick={() => { close(); f() }}>Got it, thanks!</Button>
            </DialogActions>
          </Dialog>
        </div>
        <Divider />
        <div className="content text-black">
          <div className="ride-papers">
            {rideData.map((data, idx) => <RidePaper key={data.id || idx} value={data} />)}
          </div>
          <div className="ride-content flex justify-around">
            {selectedRideData ? (
              <div className="flex flex-col w-3/5">
                <h1 className="text-5xl text-center">Mon 23 JUL</h1>
                <img src={routepng} className="w-11/12 mt-10 px-10" alt="Route" />
                <div className="flex flex-col justify-between pt-2">
                  <div className="flex justify-between">
                    <Typography variant="h5">{selectedRideData.locationFirstName}</Typography>
                    <Typography variant="h5">{selectedRideData.goingLocationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : selectedRideData.goingLocationFirstName}</Typography>
                  </div>
                  <div className="flex justify-between pt-3">
                    <Typography color="primary" variant="h6">{selectedRideData.startTime}</Typography>
                    <Typography color="primary" variant="h6">{selectedRideData.endTime}</Typography>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <Typography className="py-2 text-xl">Price per person</Typography>
                    <Typography className="py-2 text-4xl">Rs.{selectedRideData.price}</Typography>
                  </div>
                  <Divider className="pt-3" />
                </div>
                <div className="pt-4">
                  <h1 className="pb-5 text-center text-3xl">Car Info</h1>
                  <div className="flex justify-between items-center">
                    <img src={car} className="h-[18dvh]" alt="Car" />
                    <div>
                      <Typography variant="h4">{selectedRideData.carNumber}</Typography>
                      <Typography variant="h6">{selectedRideData.carName}</Typography>
                      <Typography color="primary" variant="h6">{selectedRideData.availableSeats} seats available</Typography>
                    </div>
                  </div>
                  <Divider className="pt-5 mt-10" />
                  <div className="pb-4">
                    <h1 className="pb-4 pt-5 text-center text-3xl">Driver Profile</h1>
                    <div className="flex justify-between items-center">
                      <div className="w-1/3 flex justify-center"><img src={man} className="h-[24dvh]" alt="Driver" /></div>
                      <div>
                        <Typography variant="h4">{selectedRideData.name}</Typography>
                        <Typography variant="h6">Male</Typography>
                        <Typography variant="h6">Btech IT</Typography>
                        <Typography variant="h6">{selectedRideData.email}</Typography>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-center py-8">
                  <Button onClick={() => handleBookRide()}>Book Ride</Button>
                  <Link to="/map">
                    <Button variant="contained" style={{ backgroundColor: 'black', marginLeft: '10px', color: 'white' }}>More Details</Button>
                  </Link>
                </div>
              </div>
            ) : <div></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookRide
