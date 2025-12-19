import {  MenuIcon, XIcon, UserIcon, LogOutIcon, Wallet2Icon } from 'lucide-react'
import React from 'react'
import { useState ,useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import { useToast } from "../context/ToastContext";



const Navbar = () => {
  const [isOpen , setIsOpen] = useState(false)
  const { showToast } = useToast();

  const navigate = useNavigate()
    const {setCurrentUser} = useContext(UserContext)
    const {currentUser} = useContext(UserContext)
    const token = currentUser?.token;
  
    const handleLogout = () => {
      setCurrentUser(null)
      navigate('/')
    }


  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-26 py-2
      bg-white/10 backdrop-blur border-b border-white/20 shadow-md'>
        
      <Link to='/' className='max-md:flex-1'>
        <img src="../public/AsdaLogo.png" alt="Logo" className='w-16 h-auto' />
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
       max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
         min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
          border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <XIcon onClick={()=> setIsOpen(!isOpen)} className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' />
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false)}} to='/'>Home</Link>
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false)}} to='/events'>Events & News</Link>
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false) ; if(!token){showToast("You need to login", "warning");}}} to={`/${token?"shopitem":""}`}>Shop</Link>
        {/* <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false)}} to='/gamedetails'>Game</Link> */}
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false) ; if(!token){showToast("You need to login", "warning");}}} to={`/${token?"war":""}`}>War</Link>
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false) ; if(!token){showToast("You need to login", "warning");}}} to={`/${token?"recharge":""}`}>Recharge & Payment</Link>
        <Link onClick={()=> {scrollTo(0,0) ; setIsOpen(false) ; if(!token){showToast("You need to login", "warning");}}} to={`/${token?"support":""}`}>Support</Link>
      </div>

      <div className='flex items-center gap-6'>
        {/* <DownloadIcon onClick={() => navigate('/gamedetails')} className='max-md:hidden hover:text-blue-500 transition w-6 h-6 cursor-pointer'/> */}
        {!token ? (
          <>
            <button onClick={() => navigate('/Auth', { state: { isLogin: false } })} className='min-w-[80px] text-center px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
              Register
            </button>
            <button onClick={() => navigate('/Auth', { state: { isLogin: true } })} className='min-w-[80px] text-center px-4 py-1 sm:px-7 sm:py-2 bg-green-500 hover:bg-green-600 transition rounded-full font-medium cursor-pointer'>
              Login
            </button>
          </>
        ) : (
          <div className='flex items-center gap-4 md:gap-6'>
            <div
              className="flex items-center gap-1 px-4 py-2 bg-gray-800/60 backdrop-blur-sm 
                        border border-white/10 rounded-full hover:border-green-500 
                        cursor-pointer transition"
              onClick={() => navigate(`/profile`)}
            >
              <UserIcon className="w-5 h-5 text-green-400" />
              <p className="text-white text-sm">{currentUser.name}</p>
              <Wallet2Icon className="w-5 h-5 text-blue-400" />
              <p className="text-white text-sm">Balance: {currentUser.points}</p>
            </div>
            <div
              className="flex items-center justify-center gap-3 sm:gap-3 px-2 py-1 sm:px-4 sm:py-2
                        bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-full 
                        hover:border-red-500 cursor-pointer transition"
              onClick={handleLogout}
            >
              <p className="text-white text-sm hidden sm:block">LogOut</p>
              <LogOutIcon className="w-5 h-5 text-red-400" />
            </div>
          </div>
        )}
      </div>
      <MenuIcon onClick={()=> setIsOpen(!isOpen)} className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' />
    </div>
  )
}

export default Navbar
