import React from 'react';
import { useRef, useState ,useEffect,useContext} from 'react';
import { WalletIcon,Loader2Icon, CheckIcon, ShoppingBasket, Mailbox } from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'
import {Ban} from 'lucide-react';
import axios from 'axios';
import { useToast } from "../context/ToastContext";


const Profile = () => {
  const dialogRef = useRef(null);
  const [selectedChar, setSelectedChar] = useState(null);
  const [accountData, setAccountData] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [thisUser, setThisUser] = useState({});
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(()=>{
    if(!token){
      showToast("You need to login", "warning");
      navigate('/')
    }
  }, [])

  // useEffect(()=>{
  //   const getPlayerData =async () =>{
  //     try {
  //         const response = await axios.get(`http://localhost:3000/player/`,
  //         {withCredentials: true , headers:{Authorization: `Bearer ${token}`}})
  //         setAccountData(response.data.characters)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   getPlayerData()
  // },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, playerResponse] = await Promise.all([
          axios.get("http://localhost:3000/auth/user", {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:3000/player/", {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setThisUser(userResponse.data);
        setAccountData(playerResponse.data.characters);
  
      } catch (err) {
        console.log(err);
      }
    };
  
    if (token) {
      fetchData();
    }
  }, [token]);
  

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setError('');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setLoading(false);
    setSuccess(false);
    dialogRef.current.close();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    // if (!oldPass || !newPass || newPass !== confirmPass) return;
    const changePass = new FormData();

    changePass.set('password',newPass)
    changePass.set('confirmPassword',confirmPass)
    changePass.set('oldPassword',oldPass)
    setLoading(true);
  
    try {
      const changePassRes = await axios.put(`http://localhost:3000/auth/changePassword/`, changePass ,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      // console.log(changePass)
      if(changePassRes.status == 200){
      setSuccess(true);
      setError('')
    }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' min-h-full	my-30 text-white flex flex-col items-center pt-12 px-4 '>
      {/* Account Info */}
      <div className="w-full max-w-xl mt-10 space-y-4 border border-gray-500 p-6 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-xl font-bold text-center">Account Information</h2>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between border-b border-gray-700 py-2">
            <span className="text-gray-400">Email:</span>
            <span className="text-right sm:text-left break-all">{thisUser?.EmailAddress}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between border-b border-gray-700 py-2">
            <span className="text-gray-400">Username:</span>
            <span className="text-right sm:text-left">{thisUser?.Name}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between border-b border-gray-700 py-2">
            <span className="text-gray-400">VIPLevel:</span>
            <span className="text-right sm:text-left">{thisUser?.VipLevel}</span>
          </div>
          {/* Road to Next VIP */}
          {thisUser?.VipLevel < 20 ? (
          <div className="flex flex-col gap-1 py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">Progress to next{" "}<span className="text-yellow-400 cursor-pointer hover:underline" onClick={() => navigate("/VipInfo")}>
                VIP
              </span>{" "}
              level:
            </span>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-yellow-500 h-4"
                  style={{
                    width: `${Math.min(
                      (thisUser?.UsedPoints / thisUser?.NextVipTarget ) * 100,
                      100
                    )}%`
                  }}
                ></div>
              </div>
              
              <span className="text-gray-300 text-xs mt-1">
                {thisUser?.UsedPoints} / {thisUser?.NextVipTarget} Points
              </span>
          </div>) : (
          <div className="flex flex-col gap-1 py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">You have reached the final{" "}<span className="text-yellow-400 cursor-pointer hover:underline" onClick={() => navigate("/VipInfo")}>
                VIP
              </span>{" "}
              level:
            </span>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-yellow-500 h-4"
                  style={{
                    width: `${Math.min(
                      (100 / 100 ) * 100,
                      100
                    )}%`
                  }}
                ></div>
              </div>
              
              <span className="text-gray-300 text-xs mt-1">
                {thisUser?.UsedPoints} Points
              </span>
          </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 border-b border-gray-700 py-2">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="flex items-center gap-1">
                Balance <WalletIcon className="w-4" />:
              </span>
              <span className="text-white">{thisUser?.Points} Points</span>
            </div>

            <Link
              to="/recharge"
              className="px-4 py-1 text-green-400 border border-green-500 rounded-xl hover:bg-green-500 hover:text-white transition font-medium "
            >
              Recharges & Payments
            </Link>
          </div>


          <Link
            to="/myItems"
            className="block mt-4 w-full bg-red-500 text-center py-2 rounded-lg 
            hover:bg-red-700 hover:text-white transition font-semibold"
          >
            <span className="text-white flex items-center justify-center gap-2">
              My Purchases <ShoppingBasket className="inline-block" />
            </span>
          </Link>
        </div>

        <button  onClick={openDialog} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold cursor-pointer">
          Change Password
        </button>
      </div>

      {/* In Game Accounts Section */}
      <div className="w-full max-w-4xl mt-12 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">In Game Characters</h2>

        {accountData.length >= 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accountData.map((char, index) => (
              <div onClick={() => {setSelectedChar(char); navigate('/profile/details', { state: { Char: char.Name , CharId :char.EntityLowId, } }) }} key={index} className="p-4 rounded-xl border border-gray-500 shadow-md space-y-4 hover:scale-110 cursor-pointer ">
                <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2 border border-gray-700">
                  <h3 className="text-lg font-semibold text-center text-blue-400 mb-2">{char.Name}</h3>
                  <div className="flex justify-between border-b border-gray-700 py-1">
                    <span className="text-gray-400">Level:</span>
                    <span className="text-white font-medium">{char.Level}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 py-1">
                    <span className="text-gray-400">Profession:</span>
                    <span className="text-white font-medium">{ [1,2,3].includes(char.ClassId) ? "Warrior" : [4,5,6].includes(char.ClassId) ? "Archer" : [7,8,9].includes(char.ClassId) ? "Mage" : "WithoutClass" }</span>
                    {char.ClassId !== 0 ?
                    (
                    <img
                      src={`../class_${char.ClassId}.png`}
                      alt="Profession Icon"
                      className="w-6 h-6 object-contain"
                    />
                    ):(
                      <Ban />
                    )}
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Rank:</span>
                    <span className="text-yellow-400 font-medium">{char.TitlesRank}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-400 font-medium">No character data found for this Account.</p>
        )}
      </div>

      {/* Dialog */}
      <dialog ref={dialogRef} className="rounded-lg overflow-hidden">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700 relative z-50">
            <h2 className="text-xl font-bold mb-6 text-center">Change Password</h2>

            <div className="space-y-4">
              {error && (
                  <div className="px-4 py-2  rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
              )}
              <input
                type="password"
                placeholder="Old Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 text-white"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={closeDialog}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>

              {!success ? (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-blue-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeDialog();
                    setSuccess(false); // Reset for next use
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  Success
                </button>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
