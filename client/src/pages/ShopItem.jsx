import { ShoppingCartIcon } from 'lucide-react';
import React from 'react'
import {useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import ItemSelector from '../components/ItemSelector';
import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext'



const ShopItem = () => {
  const [shopItems, setShopItems] = useState([]);
  const [category , setCategory] = useState('1');
  const [subCategory , setSubCategory] = useState();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      showToast("You need to login", "warning");
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          category,
          subcategory: subCategory
        };
        const [shopRes] = await Promise.all([
          axios.get(`http://localhost:3000/shop/category`, { params: data })
        ]);
        setShopItems(shopRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

   fetchData();
  }, [category ,subCategory]);


  return (
    <div className='relative my-40 border border-gray-600 rounded-2xl mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <div className="flex justify-center items-center gap-2 my-6 ">
        <h2 className="text-2xl font-semibold text-white ">Items Shop</h2>
        <ShoppingCartIcon className="w-8 h-8 text-blue-500" />
      </div>
      <ItemSelector cate = {setCategory} subCate = {setSubCategory}/>
      {shopItems.length > 0 ? 
      (
      <div className='flex flex-wrap justify-center max-sm:justify-center gap-8 mx-8 my-16 '>
        {shopItems.map((item) => (
          <ItemCard item={item} key={item.name} />
        ))}
      </div>
      ) : (
          <div className='flex flex-col items-center justify-center mt-30'>
          <p className='text-3xl font-bold text-center'> No Items available , The Shop is under Maintenance Or Empty.</p>
          </div>)}
    </div>
  );
}

export default ShopItem
