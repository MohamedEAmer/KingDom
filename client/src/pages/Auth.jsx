import React, { useState ,useEffect ,useContext} from 'react';
import { useLocation , useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../context/userContext.jsx'
import { useToast } from "../context/ToastContext";



const Auth = () => {
  const location = useLocation();
  const initialMode =location.state?.isLogin;
  const [isLogin, setIsLogin] = useState(initialMode);
  const navigate = useNavigate()
  const [error,setError] =useState('')
  const {setCurrentUser} = useContext(UserContext)
  const { showToast } = useToast();


  useEffect(() => {
    if (initialMode !== undefined) {
      setIsLogin(initialMode);
      setError('');
    }
  }, [initialMode]);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post("http://localhost:3000/auth/register", registerData );
      if (res.status === 201 || res.status === 200) {
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate('/Auth', { state: { isLogin: true } });
        showToast(res.data.message || "Account activated successfully 🎉", "success");
      }
    } catch (err) {
      console.error(err);
      setError(err.response.data.message);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post("http://localhost:3000/auth/login", loginData);
      const user = await res.data.user;
      if (res.status === 201 || res.status === 200) {
        setCurrentUser(user)
        setLoginData({
          username: "",
          password: "",
        });
        if(user.role === "Owner"){
          navigate("/admin");
        }else{
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };


  return (
    <div className="min-h-full py-50 flex items-center justify-center text-white px-4">
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/5 backdrop-blur-md">

        {/* Left Section - Game Info */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-white/10 p-10 text-center border-r border-white/20">
          <img
            src="../../public/AsdaLogo.png"
            alt="Game Logo"
            className="w-40 h-40 mb-6 object-contain"
          />
          <h2 className="text-2xl font-bold mb-4">KingDom Of Secrets Game</h2>
          <p className="text-gray-300">
            Join the adventure in the world of secrets. Create your character, build your legend, and forge alliances in a mystical MMORPG experience.
          </p>
        </div>

        {/* Right Section - Forms */}
        <div className="w-full md:w-1/2 p-8 bg-black/60">
          {/* Login Form */}
          {isLogin && (
            <form className="space-y-6">
              {error && (
                <div className="px-4 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block mb-1 text-sm"> Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your username"
                  defaultValue={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  defaultValue={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>

              <button
                onClick={handleLogin}
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold"
              >
                Login
              </button>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form className="space-y-6">
              {error && (
                <div className="px-4 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block mb-1 text-sm">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Choose a username"
                  defaultValue={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter your email"
                  defaultValue={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Create a password"
                  defaultValue={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Confirm Password"
                  defaultValue={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                onClick={handleRegister}
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 transition rounded-md text-white font-semibold"
              >
                Register
              </button>
            </form>
          )}

          {/* Extra Links */}
          <div className="mt-6 text-sm text-gray-300 flex flex-col items-center gap-2">
            {isLogin ? (
              <>
                <p>
                  Don’t have an account?{' '}
                  <span
                    className="text-green-400 hover:underline cursor-pointer"
                    onClick={() => {setIsLogin(false); setError('');}}
                  >
                    Register
                  </span>
                </p>
                <p onClick={() => navigate('/support')} className="text-yellow-400 hover:underline cursor-pointer">
                  Forgot password?
                </p>
              </>
            ) : (
              <>
                <p>
                  Already have an account?{' '}
                  <span
                    className="text-blue-400 hover:underline cursor-pointer"
                    onClick={() => {setIsLogin(true);  setError('');}}
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
