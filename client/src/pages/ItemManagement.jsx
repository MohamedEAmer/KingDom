import React, { useState ,useEffect,useContext,useRef } from 'react';
import {
  PencilIcon, Trash2Icon, SaveIcon, FlameIcon, PlusIcon, X
} from 'lucide-react';
import ItemSelector from '../components/ItemSelector';
import axios from 'axios';
import SpriteImage from '../components/SpriteImage';
import { UserContext } from '../context/userContext'
import {useNavigate } from 'react-router-dom';



const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [itemid,setItemId]=useState('')
  const [amount,setAmount]=useState('')
  const [price,setPrice]=useState('')
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token || currentUser.role !== "Owner"){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  const dialogRef = useRef(null);

  const [category , setCategory] = useState('1'); // always start with the New
  const [subCategory , setSubCategory] = useState();

  function openDialog() {
    setSelectedCategory('');
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  const fetchData = async () => {
    try {
      const data = {
        category,
        subcategory: subCategory
      };
      const shopRes = await axios.get(`http://localhost:3000/shop/category`, { params: data });
      setItems(shopRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    const itemData = new FormData();

    itemData.set('itemid',editValues.itemid)
    itemData.set('price',editValues.price)
    itemData.set('amount',editValues.amount)
    itemData.set('category',editValues.category)
    itemData.set('subcategory',editValues.subcategory)

    try {
      const editShopItemRes = await axios.put(`http://localhost:3000/shop/${editValues.guid}`, itemData ,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      if(editShopItemRes.status == 200){
        setEditingItemId(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleEditClick = (item) => {
    if(item == null ){
      setEditingItemId(null);
      setEditValues({});
    }
    setEditingItemId(item.guid); // only one item gets this ID
    setEditValues(item)
  };

  const handleDelete = async (e , item) => {
    e.preventDefault();
    try {
      const deleteItemRes = await axios.delete(`http://localhost:3000/shop/${item.guid}`,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      if(deleteItemRes.status == 200){
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete the item', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const itemData = new FormData();

    itemData.set('itemid',itemid)
    itemData.set('price',price)
    itemData.set('amount',amount)
    itemData.set('category',selectedCategory)
    itemData.set('subcategory',selectedSubCategory)

    try {
      const addShopItemRes = await axios.post(`http://localhost:3000/shop`, itemData ,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      if(addShopItemRes.status == 200){
        closeModal();
        fetchData();
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
   fetchData();
  }, [category ,subCategory]);



  return (
    <div className="p-6 my-6 mx-0 lg:ml-70 md:ml-70 border border-gray-600 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">Manage Items</h2>
        {/* Add Item Button */}
        <div className="mt-6">
            <button
            onClick={() => openDialog()}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white flex items-center gap-2"
            >
            <PlusIcon className="w-5 h-5" />
            Add New Item
            </button>
        </div>

      {/* Category Selector with Subcategory Hover */}  
      <ItemSelector cate = {setCategory} subCate = {setSubCategory}/>

      {/* Item List */}
      <div className="flex flex-col gap-2 mt-15">
        {items.length > 0 ? items.map(item => (
          <div
            key={item.guid}
            className="bg-black/60 border border-gray-600 rounded-xl flex justify-between items-center px-4 py-2 text-sm shadow border border-gray-700"
          >
            <div className="flex items-center gap-3 w-full">
              <SpriteImage
                code={item.item_img}
                className="w-10 h-10 object-contain rounded"
                scale={2}
              />

              {item.guid === editingItemId ? (
                <>
                  Amount
                  <input
                    type="number"
                    className="bg-gray-700 p-1 rounded w-24"
                    defaultValue={editValues.amount}
                    onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                  />
                  Price
                  <input
                    type="number"
                    className="bg-gray-700 p-1 rounded w-16"
                    defaultValue={editValues.price}
                    onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                  />
                  <select
                  value={editValues.category}
                  onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                  className="p-2 mx-2 border border-gray-600 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <option value="" disabled>
                          Select Category
                      </option>
                      <option value="1">New</option>
                      <option value="2">Hot</option>
                      <option value="3">Event</option>
                      <option value="4">Pets</option>
                      <option value="5">Upgrade</option>
                      <option value="6">Potions</option>
                      <option value="7">Armor</option>
                      <option value="8">Weapon</option>
                      <option value="9">Points</option>
                  </select>
                  {editValues.subcategory &&
                  <select
                  value={editValues.subcategory}
                  onChange={(e) => setEditValues({ ...editValues, subcategory: parseFloat(e.target.value) })}
                  className="p-2 mx-2 border border-gray-600 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <option value="" disabled>
                          Select Category
                      </option>
                      <option value="2">Archer</option>
                      <option value="1">Warrior</option>
                      <option value="3">Mage</option>
                  </select>}
                  <button
                    onClick={handleUpdate}
                    className="bg-green-900 text-white px-2 py-1 rounded text-xs ml-2 hover:bg-green-500"
                  >
                    <SaveIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(null)}
                    className="bg-red-900 text-white px-2 py-1 rounded text-xs ml-2 hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) :
              (
                <>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-400 ml-2">{item.price} Points</span>
                  {item.labels == "Hot" && <FlameIcon className="w-4 h-4 text-red-500 ml-2" />}
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditClick(item)} className="hover:text-yellow-400">
                      <PencilIcon className="mx-5 w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(event , item)} className="hover:text-red-500">
                      <Trash2Icon className="mx-5 w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )) : <p className="text-gray-400">No items in this category.</p>}
      </div>
      {/* Add new item dialog */}
      <dialog ref={dialogRef} className="rounded-lg overflow-hidden">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700 relative z-50">
            <h2 className="text-xl font-bold mb-4 text-center">Add New Item</h2>
            <input
                name='ItemID'
                placeholder='ItemID'
                type="number"
                onChange={(e) => setItemId(e.target.value)}
                className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                name='Item Price'
                placeholder='Item Price'
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                name='Item Amount'
                placeholder='Item Amount'
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>
                    Select Category
                </option>
                <option value="1">New</option>
                <option value="2">Hot</option>
                <option value="3">Event</option>
                <option value="4">Pets</option>
                <option value="5">Upgrade</option>
                <option value="6">Potions</option>
                <option value="7">Armor</option>
                <option value="8">Weapon</option>
                <option value="9">Points</option>
            </select>
            <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>
                    Select SubCategory
                </option>
                <option value="2">Archer</option>
                <option value="1">Warrior</option>
                <option value="3">Mage</option>
            </select>


            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className={`px-4 py-2 rounded transition font-semibold ${
                  !selectedCategory
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dull text-white'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ItemManagement;
