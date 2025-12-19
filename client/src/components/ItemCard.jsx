import React, { useRef, useState, useContext } from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import SpriteImage from "./SpriteImage";
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useToast } from "../context/ToastContext";

const ItemCard = ({ item, setError }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [accountData, setAccountData] = useState([]);
  const dialogRef = useRef(null);

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const { showToast } = useToast();

  const openDialog = async () => {
    if (!token) {
      setError("You can't buy items, please login first.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/player/${currentUser.AccountId}`);
      setAccountData(res.data.characters || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch characters.");
    }

    setSelectedItem(item);
    setSelectedOption('');
    dialogRef.current?.showModal();
  };

  const closeModal = () => dialogRef.current?.close();

  const confirmPurchase = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    const buyData = new FormData();
    buyData.set('AccountId', currentUser.AccountId);
    buyData.set('Name', currentUser.name);
    buyData.set('points', currentUser.points);
    buyData.set('amount', selectedItem.amount);
    buyData.set('price', selectedItem.price);
    buyData.set('itemName', selectedItem.name);
    buyData.set('itemId', selectedItem.itemid);

    try {
      const buyResponse = await axios.post(
        `http://localhost:3000/shop/buy/${selectedOption}/${selectedItem.guid}`,
        buyData
      );
      showToast(buyResponse.data.message, "success");
      setCurrentUser(prev => ({
        ...prev,
        VipLevel: buyResponse.data.newVipLevel,
        points: buyResponse.data.newPoints
      }));
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-black/60 border border-gray-600 rounded-2xl hover:translate-y-1 transition duration-300 w-60">
      <SpriteImage code={item.item_img} className="mx-auto mt-4 mb-4" scale={3} />
      <p className="font-semibold mt-2 break-words text-center">{item.name}</p>
      <p className="text-sm text-gray-400 mt-2">Amount: {item.amount}</p>
      <p className="text-sm text-gray-400 mt-2">Price: {item.price} Points</p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={openDialog}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Item
        </button>
        <ShoppingCartIcon className="w-6 h-6 text-primary fill-primary" />
      </div>

      <dialog ref={dialogRef} className="rounded-lg overflow-hidden">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700 relative z-50">
            <h2 className="text-xl font-bold mb-4 text-center">{selectedItem?.name}</h2>

            {selectedItem && (
              <>
                <SpriteImage code={selectedItem.item_img} className="mx-auto mt-4 mb-4" scale={2} />
                <p className="mb-2 text-center">
                  Price: <span className="text-primary font-semibold">{selectedItem.price} Points</span>
                </p>
              </>
            )}

            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white"
            >
              <option value="" disabled>Select Character</option>
              {accountData.length > 0 ? accountData.map((char, i) => (
                <option key={i} value={char.Name}>{char.Name}</option>
              )) : <option disabled value="">Please Create a Character</option>}
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded transition font-semibold ${
                  !selectedOption ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dull text-white'
                }`}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ItemCard;
