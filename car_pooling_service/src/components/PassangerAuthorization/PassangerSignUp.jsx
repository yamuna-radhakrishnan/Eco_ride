import React, { useState } from 'react'
import Swal from 'sweetalert2'
import image from '../../assets/images/Hero.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function PassangerSignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idCard, setIdCard] = useState(null)
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [step, setStep] = useState(1)
  const [open, setopen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errors, setErrors] = useState({
    emailError: '',
    passwordError: '',
    mobileNumberError: '',
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    })

    if (error) {
      console.error('Supabase auth error:', error)
      Swal.fire({ icon: 'error', title: 'Error', text: error.message })
      setLoading(false)
      return
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        department,
        year_of_study: year,
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }

      setLoading(false)
      setopen(true)
    }
  }

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value)
    if (!/^[6-9][0-9]{9}$/.test(event.target.value))
      setErrors({ ...errors, mobileNumberError: 'Enter a valid mobile number.' })
    else setErrors({ ...errors, mobileNumberError: '' })
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    if (event.target.value.length < 8)
      setErrors({ ...errors, passwordError: 'Password must contain atleast 8 characters' })
    else setErrors({ ...errors, passwordError: '' })
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    if (!/^[A-Z0-9._%+-]+@skcet\.ac\.in$/i.test(event.target.value))
      setErrors({ ...errors, emailError: 'Enter a valid SKCET email address.' })
    else setErrors({ ...errors, emailError: '' })
  }

  return (
    <div className="slide-in-from-corner h-[80vh] flex justify-center items-center">
      <div className="flex justify-evenly items-center gap-20">
        <div className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information as your ID Card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4 grid gap-2">
                      <label className="text-foreground">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-1 border rounded"
                        required
                      />
                    </div>
                    <div className="mb-4 grid gap-2">
                      <label className="text-foreground">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-1 border rounded"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      placeholder="must contain @skcet.ac.in"
                      onChange={handleEmailChange}
                      className={`w-full px-3 py-1 border rounded ${
                        errors.emailError !== '' ? 'border-red-500' : ''
                      }`}
                    />
                    <span className="text-xs text-red-600 italic">{errors.emailError}</span>
                  </div>
                  <div className="mb-4">
                    <label className="text-foreground">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-1 border rounded ${
                        errors.passwordError !== '' && 'border-red-600'
                      }`}
                    />
                    <span className="text-xs text-red-600 italic">{errors.passwordError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-1 bg-foreground text-white rounded"
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="block text-foreground">Mobile Number</label>
                    <input
                      type="tel"
                      onChange={handlePhoneNumberChange}
                      className={`w-full px-3 py-1 border rounded ${
                        errors.mobileNumberError != '' ? 'border-red-500' : ''
                      }`}
                    />
                    <span className="text-xs text-red-600 italic">{errors.mobileNumberError}</span>
                  </div>
                  <div className="mb-4">
                    <label className="block text-foreground">ID Card</label>
                    <input
                      type="file"
                      onChange={(e) => setIdCard(e.target.files[0])}
                      className="w-full px-3 py-1 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <Select
                      value={department}
                      onValueChange={(value) => setDepartment(value)}
                      className="w-full"
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Computer Science and Engineering">Computer Science and Engineering</SelectItem>
                          <SelectItem value="Computer Science and Design">Computer Science and Design</SelectItem>
                          <SelectItem value="Computer Science and Engineering (Cyber Security)">Computer Science and Engineering (Cyber Security)</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</SelectItem>
                          <SelectItem value="Computer Science and Business Systems">Computer Science and Business Systems</SelectItem>
                          <SelectItem value="Electronics and Communication Engineering">Electronics and Communication Engineering</SelectItem>
                          <SelectItem value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Mechatronics Engineering">Mechatronics Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          <SelectItem value="M.E. Applied Electronics">M.E. Applied Electronics</SelectItem>
                          <SelectItem value="M.E. Computer Science and Engineering">M.E. Computer Science and Engineering</SelectItem>
                          <SelectItem value="M.E. Engineering Design">M.E. Engineering Design</SelectItem>
                          <SelectItem value="M.Tech. Computer Science and Engineering">M.Tech. Computer Science and Engineering</SelectItem>
                          <SelectItem value="Master of Business Administration">Master of Business Administration</SelectItem>
                          <SelectItem value="INTEGRATED_MTECH">Integrated M.Tech.</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <Select
                      value={year}
                      onValueChange={(value) => setYear(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Year of Studying" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="I Year">I Year</SelectItem>
                          <SelectItem value="II Year">II Year</SelectItem>
                          <SelectItem value="III Year">III Year</SelectItem>
                          <SelectItem value="IV Year">IV Year</SelectItem>
                          <SelectItem value="V Year">V Year</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 py-1 border border-gray-950 text-black font-semibold rounded"
                    >
                      Previous
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="submit"
                          disabled={
                            errors.emailError !== '' ||
                            errors.passwordError !== '' ||
                            errors.mobileNumberError !== '' ||
                            firstName === '' ||
                            lastName === '' ||
                            email === '' ||
                            password === '' ||
                            phoneNumber === '' ||
                            idCard === null ||
                            department === '' ||
                            year === '' ||
                            loading
                          }
                          className="px-4 py-1 bg-foreground text-white rounded disabled:opacity-50"
                        >
                          {loading ? 'Submitting...' : 'Submit'}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Verify your email</AlertDialogTitle>
                          <AlertDialogDescription>
                            A verification link has been sent to your mail{' '}
                            <b>{email}</b>. Please check your inbox and verify
                            your email to complete registration.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => {
                              setopen(false)
                              navigate('/passangerSignin')
                            }}
                          >
                            Go to Sign In
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/passangerSignIn" className="underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </div>
        <div className="">
          <img src={image} className="h-[49dvh]" alt="" />
        </div>
      </div>
    </div>
  )
}
