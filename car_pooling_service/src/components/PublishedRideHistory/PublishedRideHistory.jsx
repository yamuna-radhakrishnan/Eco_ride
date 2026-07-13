import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import route from './routedot.png'
import car from './Car.jpg'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import './PublishedRideHistory.css'
import image1 from './image1.png'
import image2 from './image2.png'
import image3 from './image3.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { supabase } from '../../lib/supabase'

const mapRide = (ride) => ({
  ...ride,
  bookRide: ride.rides ? {
    id: ride.rides.id,
    name: ride.rides.name,
    email: ride.rides.email,
    phone: ride.rides.phone,
    leaving: ride.rides.leaving,
    going: ride.rides.going,
    availableSeats: ride.rides.available_seats,
    price: ride.rides.price,
    carName: ride.rides.car_name,
    carNumber: ride.rides.car_number,
    date: ride.rides.date,
    startTime: ride.rides.start_time,
    endTime: ride.rides.end_time,
    locationFirstName: ride.rides.location_first_name,
    goingLocationFirstName: ride.rides.going_location_first_name,
    leavingFromLatitude: ride.rides.leaving_from_latitude,
    leavingFromLongitude: ride.rides.leaving_from_longitude,
  } : ride.bookRide,
})

const PublishedRideHistory = () => {
  const logindata = useSelector((state) => state.loginReducer)
  const [upcomingRideHistory, setUpcomingRideHistory] = useState([])
  const [onGoingRideHistory, setOnGoingRideHistory] = useState([])
  const [onCompletedRideHistory, setCompletedRideHistory] = useState([])

  const getall = async () => {
    if (!logindata.email) return

    const { data: upcoming } = await supabase
      .from('ride_history')
      .select('*, rides(*)')
      .eq('user_email', logindata.email)
      .eq('status', 'upcoming')

    if (upcoming) setUpcomingRideHistory(upcoming.map(mapRide))

    const { data: ongoing } = await supabase
      .from('ride_history')
      .select('*, rides(*)')
      .eq('user_email', logindata.email)
      .eq('status', 'ongoing')

    if (ongoing) setOnGoingRideHistory(ongoing.map(mapRide))

    const { data: completed } = await supabase
      .from('ride_history')
      .select('*, rides(*)')
      .eq('user_email', logindata.email)
      .eq('status', 'completed')

    if (completed) setCompletedRideHistory(completed.map(mapRide))
  }

  useEffect(() => {
    getall()
  }, [logindata])

  return (
    <div style={{ backgroundColor: ' #f6f6f6', paddingTop: '4vh', minHeight: '91dvh' }}>
      <div style={{ Top: '0%', display: 'flex', justifyContent: 'center', paddingTop: '0%', width: '100%', paddingBottom: '2%' }}>
        <div style={{ width: '80%', backgroundColor: 'white', height: '90%' }}>
          <Tabs defaultValue="UpComing" className="w-[100%] justify-center">
            <TabsList className="grid grid-cols-3 w-[100%] h-[8dvh] bg-gray-200">
              <TabsTrigger value="Completed" className="text-lg">Completed</TabsTrigger>
              <TabsTrigger value="OnGoing" className="text-lg">OnGoing</TabsTrigger>
              <TabsTrigger value="UpComing" className="text-lg">UpComing</TabsTrigger>
            </TabsList>
            <TabsContent value="Completed" className="overflow-y-scroll h-[70dvh]">
              {onCompletedRideHistory && onCompletedRideHistory.length > 0 ? (
                onCompletedRideHistory.map((ride, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center', padding: '2vh', flexDirection: 'column', fontSize: '0.7rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ backgroundColor: 'White', width: '80%', height: '23vh', padding: '1vh', paddingLeft: '7%' }}>
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.locationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.locationFirstName}
                        </Typography>
                        <img src={route} style={{ height: '48%', alignContent: 'center' }} alt="Route" />
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.goingLocationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.goingLocationFirstName}
                        </Typography>
                      </div>
                      <div style={{ width: '100%', padding: '1vh', position: 'relative', top: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <Typography variant="h4" sx={{ fontSize: '1.3rem', fontWeight: '600' }}>{ride.bookRide.name}</Typography>
                          <Typography sx={{ lineHeight: '1.2rem', marginTop: '5%', fontSize: '0.9rem' }}>B-tech IT</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.email}</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.phone}</Typography>
                        </div>
                      </div>
                      <div style={{ backgroundColor: 'White', width: '70%', height: '23dvh', padding: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <img src={car} style={{ height: '55%', alignContent: 'center' }} alt="Car" />
                          <Typography variant="h6" sx={{ paddingLeft: '15%', fontSize: '0.9rem', fontWeight: '500' }}>{ride.bookRide.carNumber}</Typography>
                        </div>
                      </div>
                      <div style={{ marginTop: '3%', width: '85%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem', fontWeight: '700' }}>Ride has been completed</Typography>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[100%]">
                  <img src={image2} className="h-[35vh] w-[vh]" alt="" />
                </div>
              )}
            </TabsContent>
            <TabsContent value="OnGoing" className="overflow-y-scroll h-[70dvh]">
              {onGoingRideHistory && onGoingRideHistory.length > 0 ? (
                onGoingRideHistory.map((ride, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center', padding: '2vh', flexDirection: 'column', fontSize: '0.7rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ backgroundColor: 'White', width: '80%', height: '23vh', padding: '1vh', paddingLeft: '7%' }}>
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.locationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.locationFirstName}
                        </Typography>
                        <img src={route} style={{ height: '48%', alignContent: 'center' }} alt="Route" />
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.goingLocationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.goingLocationFirstName}
                        </Typography>
                      </div>
                      <div style={{ width: '100%', padding: '1vh', position: 'relative', top: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <Typography variant="h4" sx={{ fontSize: '1.3rem', fontWeight: '600' }}>{ride.bookRide.name}</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.email}</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.phone}</Typography>
                        </div>
                      </div>
                      <div style={{ backgroundColor: 'White', width: '100%', height: '23dvh', padding: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <img src={car} style={{ height: '55%', alignContent: 'center' }} alt="Car" />
                          <Typography variant="h6" sx={{ paddingLeft: '15%', fontSize: '0.9rem', fontWeight: '500' }}>{ride.bookRide.carNumber}</Typography>
                        </div>
                      </div>
                      <div style={{ marginTop: '3%', width: '65%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button className="w-auto text-sm">Ride is Ongoing</Button>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[100%]">
                  <img src={image3} className="h-[35vh] w-[50vh]" alt="" />
                </div>
              )}
            </TabsContent>
            <TabsContent value="UpComing" className="overflow-y-scroll h-[70dvh]">
              {upcomingRideHistory && upcomingRideHistory.length > 0 ? (
                upcomingRideHistory.map((ride, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center', padding: '2vh', flexDirection: 'column', fontSize: '0.7rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ backgroundColor: 'White', width: '80%', height: '23vh', padding: '1vh', paddingLeft: '7%' }}>
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.locationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.locationFirstName}
                        </Typography>
                        <img src={route} style={{ height: '48%', alignContent: 'center' }} alt="Route" />
                        <Typography variant="h5" sx={{ fontSize: '0.8rem' }}>
                          {ride.bookRide.goingLocationFirstName === 'Sri Krishna College of Engineering and Technology' ? 'SKCET' : ride.bookRide.goingLocationFirstName}
                        </Typography>
                      </div>
                      <div style={{ width: '100%', padding: '1vh', position: 'relative', top: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <Typography variant="h4" sx={{ fontSize: '1.3rem', fontWeight: '600' }}>{ride.bookRide.name}</Typography>
                          <Typography sx={{ lineHeight: '1.2rem', marginTop: '5%', fontSize: '0.9rem' }}>B-tech IT</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.email}</Typography>
                          <Typography sx={{ lineHeight: '2rem', fontSize: '0.9rem' }}>{ride.bookRide.phone}</Typography>
                        </div>
                      </div>
                      <div style={{ backgroundColor: 'White', width: '100%', height: '23dvh', padding: '1vh' }}>
                        <div style={{ height: '23dvh', position: 'absolute', bottom: '0%' }}>
                          <img src={car} style={{ height: '55%', alignContent: 'center' }} alt="Car" />
                          <Typography variant="h6" sx={{ paddingLeft: '15%', fontSize: '0.9rem', fontWeight: '500' }}>{ride.bookRide.carNumber}</Typography>
                        </div>
                      </div>
                      <div style={{ marginTop: '3%', width: '65%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button className="w-[55%] text-sm" onClick={async () => {
                            const { data: rideData } = await supabase.from('rides').select('available_seats').eq('id', ride.bookRide.id).single()
                            await supabase.from('rides').update({ available_seats: (rideData?.available_seats || 0) + 1 }).eq('id', ride.bookRide.id)
                            await supabase.from('ride_history').delete().eq('ride_id', ride.bookRide.id)
                            getall()
                          }}>
                            Cancel Ride
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[100%]">
                  <img src={image1} className="h-[35vh] w-[50vh]" alt="" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default PublishedRideHistory
