import React from 'react';

const ItemSelector = ({ cate , subCate}) => {
  const categories = [
    {
      name: 'Weapon',
      subCategories: [{sub:'Archer',category:'2'}, {sub:'Warrior',category:'1'}, {sub:'Mage',category:'3'}],
      color: 'from-green-500 to-green-700',
      category : '8',
    },
    {
      name: 'Armor',
      subCategories: [{sub:'Archer',category:'2'}, {sub:'Warrior',category:'1'}, {sub:'Mage',category:'3'}],
      color: 'from-blue-500 to-blue-700',
      category : '7',
    },
    { name: 'Potions', color: 'from-yellow-500 to-yellow-700',category : '6', },
    { name: 'Upgrade', color: 'from-purple-500 to-purple-700',category : '5', },
    { name: 'Pets', color: 'from-pink-500 to-pink-700',category : '4' },
    { name: 'Event', color: 'from-orange-500 to-orange-700',category : '3', },
    { name: 'Hot', color: 'from-red-500 to-red-700',category : '2' },
    { name: 'New', color: 'from-cyan-500 to-cyan-700',category : '1', },
    { name: 'Points', color: 'from-gray-500 to-gray-700',category : '9', },
  ];

  const getSubColor = (sub) => {
    return sub === 'Archer'
      ? 'text-green-400'
      : sub === 'Warrior'
      ? 'text-blue-400'
      : 'text-red-400';
  };

  return (
    <div className="justify-center my-8 w-full px-4 md:px-8 flex flex-wrap gap-4">
      {categories.map((cat, idx) => (
        <div key={idx} className="w-full md:w-auto relative group">
          {/* Parent Button */}
          <div onClick={() => {cate(cat.category); subCate(null)}}
            className={`px-6 py-2 text-white text-center rounded-xl cursor-pointer bg-gradient-to-r ${cat.color} shadow-md hover:scale-105 transition-all duration-300`}
          >
            {cat.name}
          </div>

          {/* Mobile: subcategories shown directly below */}
          {cat.subCategories && (
            <div className="flex justify-center md:hidden mt-2 flex-wrap gap-2">
              {cat.subCategories.map((subCat, subIdx) => (
                <button onClick={() => {cate(cat.category); subCate(subCat.category)}}
                  key={subIdx}
                  className={`px-4 py-2 rounded-lg bg-black/60 border  hover:bg-white/20 transition ${getSubColor(
                    subCat.sub
                  )}`}
                >
                  {subCat.sub}
                </button>
              ))}
            </div>
          )}

          {/* Desktop: subcategories in dropdown on hover */}
          {cat.subCategories && (
            <div className="hidden md:group-hover:flex absolute top-full left-0 bg-black/90 border border-gray-600 rounded-xl p-2 z-20 backdrop-blur-md flex-row gap-2">
              {cat.subCategories.map((subCat, subIdx) => (
                <button onClick={() => {cate(cat.category); subCate(subCat.category)}}
                  key={subIdx}
                  className={`px-4 py-2 rounded-full hover:bg-white/10 transition ${getSubColor(
                    subCat.sub
                  )}`}
                >
                  {subCat.sub}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemSelector;
