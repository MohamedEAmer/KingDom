import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import GameDetails from './pages/GameDetails'
import ShopItem from './pages/ShopItem'
import EventDetails from './pages/EventDetails'
import Events from './pages/Events'
import Support from './pages/Support'
import ActivateAccount from './pages/ActivateAccount'
import War from './pages/War'
import AdminDashboard from './pages/AdminDashboard'
import ItemManagement from './pages/ItemManagement'
import EventManagement from './pages/EventManagement'
import PlayersManagement from './pages/PlayersManagement'
import RatesAndWars from './pages/RatesAndWars'
import Auth from './pages/Auth'
import Recharge from './pages/Recharge'
import Profile from './pages/Profile'
import ProfileDetails from './pages/ProfileDetails'
import MyItems from './pages/MyItems'
import MyMail from './pages/MyMail'
import Missions from './pages/Missions'
import Royals from './pages/Royals'
import VipInfo from './pages/VipInfo'
import NotFound from './pages/NotFound'
import {Toaster} from 'react-hot-toast'
import DBSideBar from './components/DBSideBar.jsx'




const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  
  return (
    <>
      <Toaster />
      {isAdminRoute && <DBSideBar />}
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/gamedetails' element={<GameDetails/>}/>
        <Route path='/shopitem' element={<ShopItem/>}/>
        <Route path='/events/:id' element={<EventDetails/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/war' element={<War/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/admin/items' element={<ItemManagement/>}/>
        <Route path='/admin/events' element={<EventManagement/>}/>
        <Route path='/admin/players' element={<PlayersManagement/>}/>
        <Route path='/admin/rates-wars' element={<RatesAndWars/>}/>
        <Route path='/recharge' element={<Recharge/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/details' element={<ProfileDetails/>}/>
        <Route path='/myItems' element={<MyItems/>}/>
        <Route path='/myMail' element={<MyMail/>}/>
        <Route path='/myMissions' element={<Missions/>}/>
        <Route path='/royals' element={<Royals/>}/>
        <Route path='/vipInfo' element={<VipInfo/>}/>
        <Route path='/support' element={<Support/>}/>
        <Route path='/activate-account/:token' element={<ActivateAccount/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App
