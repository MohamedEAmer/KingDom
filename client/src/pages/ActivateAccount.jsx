import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/auth/activate/${token}`
        );

        showToast(res.data.message || "Account activated successfully 🎉", "success");
        setActivated(true);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Invalid or expired activation link";

        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      activateAccount();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>

        {loading && <p>Activating your account...</p>}

        {!loading && activated && (
          <>
            <p className="text-green-400 mb-4">
              Your account has been activated successfully.
            </p>
            <button
              onClick={() => navigate('/Auth', { state: { isLogin: true } })}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
            >
              Go to Login
            </button>
          </>
        )}

        {!loading && !activated && (
          <p className="text-red-400">
            Activation failed or link expired.
          </p>
        )}

      </div>
    </div>
  );
};

export default ActivateAccount;
