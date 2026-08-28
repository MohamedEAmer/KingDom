import sqlPool from '../db/sqlConnection.js';
//import PurchasesModal from '../models/PurchasesModal.js';


export const getAllItems = async (req , res)=>{
  try {
    const [allItems] = await sqlPool.query('SELECT * FROM webshop')
    if(!allItems){
      return res.status(400).json({ message: "The Items shop is empty" });
    }
    res.status(200).json(allItems);

  } catch (error) {
    console.error('Error fetching All items:', error);
    res.status(500).json({ message: 'Failed to get All items.' });
  }
}

export const getCategoryItems = async (req, res) => {
  const { category, subcategory } = req.query;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }
  try {
      let query = `
        SELECT w.*
        FROM webshop w
        WHERE w.category = ?
      `;

      const params = [category];

      if (subcategory) {
        query += " AND w.subcategory = ?";
        params.push(subcategory);
      }

      const [items] = await sqlPool.query(query, params);
  
      res.json(items);
    } catch (err) {
      console.error('Error fetching category items:', err);
      res.status(500).json({ message: 'Failed to get category items.' });
    }
};

export const getItem = async (req, res) => {
  const { guid } = req.params;

  if (!guid) {
    return res.status(400).json({ message: 'Missing item GUID.' });
  }

  try {
    const [rows] = await sqlPool.query(
      'SELECT * FROM webshop WHERE guid = ?',
      [guid]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Failed to retrieve item.' });
  }
};


export const addItem = async (req, res) => {
    const { itemid, price, amount, category, subcategory } = req.body;
    if (!itemid || !price || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
  
    try {
      const { AccountId } = req.user;
  
      const [sqlResult] = await sqlPool.query(
        `SELECT Name, AccountId, RoleGroupName
         FROM account
         WHERE AccountId = ?`,
        [AccountId]
      );
    
      if (!sqlResult.length) {
        return res.status(403).json({ message: "User not found" });
      }
    
      const user = sqlResult[0];
    
      // console.log(user)
      if(user.RoleGroupName !== "Owner" || user.Name !== "gmfirst"){
        return res.status(403).json({ message: "Invalid User Role Or Admin" });
      }
      // Get item name from asda2itemtemlate using the itemid
      const [items] = await sqlPool.query(
        'SELECT * FROM asda2itemtemlate WHERE id = ?',
        [itemid]
      );
  
      if (!items || items.length === 0) {
        return res.status(404).json({ message: 'Item not found in asda2itemtemlate.' });
      }

      let Class = ''

      if(!subcategory){
        Class = 'General';
      }

      if(subcategory){
        switch (subcategory) {
          case 1:
            Class = 'Warrior';
            break;
          case 2:
            Class = 'Archer';
            break;
          case 3:
            Class = 'Mage';
            break;
          default:
            Class = 'General';
            break;
        }
      }
      // Get item Img from itemlistimg using the itemid
      const [itemImg] = await sqlPool.query(
        'SELECT ImageFullName FROM itemsimglist WHERE ItemId = ?',
        [itemid]
      );
      if(!itemImg)
      {
        return res.status(404).json({ message: 'Item Image is not found please check the itemsimglist Table' });
      }

      const img = itemImg[0].ImageFullName.replace(/\.jpg$/i, ''); // remove .jpg, case-insensitive

      const [result] = await sqlPool.query(
        `INSERT INTO webshop (itemid, name, price, amount ,category, subcategory,quality,item_img,class,item_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [itemid, items[0].Name, price, amount, category, subcategory ? subcategory : null ,items[0].quality,img,Class,items[0].reqaired_level]
      );

      res.status(200).json({ message: 'Item added successfully.', id: result.insertId });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ message: 'Failed to add item.' });
    }
};

export const editItem = async (req, res) => {
  const {guid}  = req.params;
  const { itemid, price, amount, category, subcategory } = req.body;

  if (!guid || !itemid || !price || !amount || !category) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const { AccountId } = req.user;
  
    const [sqlResult] = await sqlPool.query(
      `SELECT Name, AccountId, RoleGroupName
       FROM account
       WHERE AccountId = ?`,
      [AccountId]
    );
  
    if (!sqlResult.length) {
      return res.status(403).json({ message: "User not found" });
    }
  
    const user = sqlResult[0];
  
    // console.log(user)
    if(user.RoleGroupName !== "Owner" || user.Name !== "gmfirst"){
      return res.status(403).json({ message: "Invalid User Role Or Admin" });
    }
    // Get updated item data
    const [items] = await sqlPool.query(
      'SELECT * FROM webshop WHERE guid = ?',
      [guid]
    );
    // console.log(items[0].itemid);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'Item not found in webshop.' });
    }
    if(items[0].itemid != itemid){
      return res.status(404).json({ message: 'This item is not in the webshop.' });
    }

    let Class = 'General';
    if (subcategory) {
      switch (subcategory) {
        case 1:
          Class = 'Warrior';
          break;
        case 2:
          Class = 'Archer';
          break;
        case 3:
          Class = 'Mage';
          break;
      }
    }

    const [result] = await sqlPool.query(
      `UPDATE webshop
       SET itemid = ?, name = ?, price = ?, amount = ?, category = ?, subcategory = ?, quality = ?, item_img = ?, class = ?, item_level = ?
       WHERE guid = ?`,
      [
        itemid,
        items[0].name,
        price,
        amount,
        category,
        subcategory == "null" ? null : subcategory,
        items[0].quality,
        items[0].item_img,
        Class,
        items[0].item_level,
        guid
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or no changes made.' });
    }

    res.status(200).json({ message: 'Item updated successfully.' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item.' });
  }
};

// export const buyItem = async (req, res) => {
//   const { receiverName, guid } = req.params;
//   const { AccountId, Name, itemId, itemName, amount, price, points } = req.body;

//   if (!guid || !receiverName || !AccountId || !Name || !itemId || !itemName || !amount || !price) {
//     return res.status(400).json({ message: "Missing required fields." });
//   }

//   const connection = await sqlPool.getConnection();

//   // ---- Format date dd/mm/yy ----
//   const now = new Date();
//   const historyDate = `${String(now.getDate()).padStart(2, "0")}/${String(
//     now.getMonth() + 1
//   ).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)}`;

//   try {
//     await connection.beginTransaction();

//     // ---- 1) Read item ----
//     const [[dbItem]] = await connection.query(
//       "SELECT * FROM webshop WHERE guid = ? AND itemid = ?",
//       [Number(guid), Number(itemId)]
//     );
//     if (!dbItem) throw new Error("Item not found.");

//     // ---- 2) Receiver lookup ----
//     const [[receiver]] = await connection.query(
//       "SELECT EntityLowId, AccountId, Name FROM characterrecord WHERE Name = ?",
//       [receiverName]
//     );
//     if (!receiver) throw new Error("Receiver not found.");

//     // ---- 3) Owner validation ----
//     if (Number(AccountId) !== Number(receiver.AccountId)) {
//       return res.status(400).json({ message: "You are buying for the wrong character." });
//     }

//     // ---- 4) Validate item data ----
//     if (
//       Number(dbItem.itemid) !== Number(itemId) ||
//       dbItem.name !== itemName ||
//       Number(dbItem.price) !== Number(price) ||
//       Number(dbItem.amount) !== Number(amount)
//     ) {
//       return res.status(400).json({ message: "Item data mismatch." });
//     }

//     // ---- 5) Get points ----
//     const [[accountPoints]] = await connection.query(
//       "SELECT Points FROM account WHERE AccountId = ? FOR UPDATE",
//       [receiver.AccountId]
//     );
//     if (!accountPoints) throw new Error("Account points not found.");

//     if (Number(accountPoints.Points) !== Number(points)) {
//       return res.status(400).json({ message: "Points mismatch." });
//     }

//     const newPoints = Number(accountPoints.Points) - Number(dbItem.price);
//     if (newPoints < 0) {
//       return res.status(400).json({ message: "Not enough points." });
//     }

//     // ---- 6) Update points ----
//     await connection.query(
//       "UPDATE account SET Points = ? WHERE AccountId = ?",
//       [newPoints, receiver.AccountId]
//     );

//     // ---- 7) Queue item ----
//     await connection.query(
//       `INSERT INTO asda2donationitem
//        (ItemId, Amount, RecieverId, Creator, IsSoulBound, Recived, Created)
//        VALUES (?, ?, ?, '~WebShop System~', 0, 0, NOW())`,
//       [dbItem.itemid, dbItem.amount, receiver.EntityLowId]
//     );

//     // ---- 8) Purchase history ----
//     await connection.query(
//       `INSERT INTO webshoprecord
//        (AccId, AccName, CharId, CharName, ItemId, ItemName, Amount, History, Price, Img)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         receiver.AccountId,
//         Name,
//         receiver.EntityLowId,
//         receiver.Name,
//         dbItem.itemid,
//         dbItem.name,
//         dbItem.amount,
//         historyDate,
//         dbItem.price,
//         dbItem.item_img,
//       ]
//     );

//     // ---- 9) VIP logic (SAFE) ----
//     const [[accountInfo]] = await connection.query(
//       "SELECT UsedPoints, VipLevel FROM account WHERE AccountId = ? FOR UPDATE",
//       [receiver.AccountId]
//     );

//     let newVipLevel = accountInfo.VipLevel;

//     if (Number(dbItem.category) !== 9) {
//       const updatedUsedPoints =
//         Number(accountInfo.UsedPoints || 0) + Number(dbItem.price);

//       await connection.query(
//         "UPDATE account SET UsedPoints = ? WHERE AccountId = ?",
//         [updatedUsedPoints, receiver.AccountId]
//       );

//       const [[vip]] = await connection.query(
//         `SELECT VipLevel
//          FROM VipLevels
//          WHERE TargetPoints <= ?
//          ORDER BY TargetPoints DESC
//          LIMIT 1`,
//         [updatedUsedPoints]
//       );

//       if (vip && vip.VipLevel > accountInfo.VipLevel) {
//         await connection.query(
//           "UPDATE account SET VipLevel = ? WHERE AccountId = ?",
//           [vip.VipLevel, receiver.AccountId]
//         );
//         newVipLevel = vip.VipLevel;
//       }
//     }

//     await connection.commit();

//     return res.status(200).json({
//       message: "Purchase successful.",
//       newPoints,
//       newVipLevel,
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error("Purchase failed:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   } finally {
//     connection.release();
//   }
// };

export const buyItem = async (req, res) => {
  const { receiverName, guid } = req.params;
  const {AccountId, Name } = req.user
  const {itemId, itemName, amount, price } = req.body;

  // Basic validation BEFORE taking a connection / starting a transaction
  if (
    !guid || !receiverName || !AccountId || !Name ||
    !itemId || !itemName || !amount || !price
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const connection = await sqlPool.getConnection();

  // ---- Format date dd/mm/yy ----
  const now = new Date();
  const historyDate = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)}`;

  // Helper: fail inside transaction without leaking locks
  const fail = (status, message) => {
    const err = new Error(message);
    err.httpStatus = status;
    throw err;
  };

  try {
    await connection.beginTransaction();

    // ---- 1) Read item ----
    const [[dbItem]] = await connection.query(
      "SELECT * FROM webshop WHERE guid = ? AND itemid = ?",
      [Number(guid), Number(itemId)]
    );
    if (!dbItem) fail(404, "Item not found.");

    // ---- 2) Receiver lookup ----
    const [[receiver]] = await connection.query(
      "SELECT EntityLowId, AccountId, Name FROM characterrecord WHERE Name = ?",
      [receiverName]
    );
    if (!receiver) fail(404, "Receiver not found.");

    // ---- 3) Owner validation ----
    if (Number(AccountId) !== Number(receiver.AccountId)) {
      fail(400, "You are buying for the wrong character.");
    }

    // ---- 4) Validate item data (server-side) ----
    if (
      Number(dbItem.itemid) !== Number(itemId) ||
      dbItem.name !== itemName ||
      Number(dbItem.price) !== Number(price) ||
      Number(dbItem.amount) !== Number(amount)
    ) {
      fail(400, "Item data mismatch.");
    }

    // ---- 5) Spend points atomically (NO FOR UPDATE needed) ----
    const itemPrice = Number(dbItem.price);

    const [spendResult] = await connection.query(
      "UPDATE account SET Points = Points - ? WHERE AccountId = ? AND Points >= ?",
      [itemPrice, receiver.AccountId, itemPrice]
    );

    if (spendResult.affectedRows === 0) {
      fail(400, "Not enough points.");
    }

    // Read new points for response (optional)
    const [[pointsRow]] = await connection.query(
      "SELECT Points FROM account WHERE AccountId = ?",
      [receiver.AccountId]
    );
    const newPoints = Number(pointsRow?.Points ?? 0);

    // ---- 6) Queue item ----
    await connection.query(
      `INSERT INTO asda2donationitem
       (ItemId, Amount, RecieverId, Creator, IsSoulBound, Recived, Created)
       VALUES (?, ?, ?, '~WebShop System~', 0, 0, NOW())`,
      [dbItem.itemid, dbItem.amount, receiver.EntityLowId]
    );

    // ---- 7) Purchase history ----
    await connection.query(
      `INSERT INTO webshoprecord
       (AccId, AccName, CharId, CharName, ItemId, ItemName, Amount, History, Price, Img)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiver.AccountId,
        Name,
        receiver.EntityLowId,
        receiver.Name,
        dbItem.itemid,
        dbItem.name,
        dbItem.amount,
        historyDate,
        dbItem.price,
        dbItem.item_img,
      ]
    );

    // ---- 8) VIP logic (no FOR UPDATE needed; do atomic increment) ----
    let newVipLevel = null;

    if (Number(dbItem.category) !== 9) {
      // Increment UsedPoints atomically
      await connection.query(
        "UPDATE account SET UsedPoints = UsedPoints + ? WHERE AccountId = ?",
        [itemPrice, receiver.AccountId]
      );

      // Get current UsedPoints + VipLevel
      const [[accInfo]] = await connection.query(
        "SELECT UsedPoints, VipLevel FROM account WHERE AccountId = ?",
        [receiver.AccountId]
      );

      const usedPoints = Number(accInfo?.UsedPoints ?? 0);
      const currentVipLevel = Number(accInfo?.VipLevel ?? 0);

      const [[vip]] = await connection.query(
        `SELECT VipLevel
         FROM VipLevels
         WHERE TargetPoints <= ?
         ORDER BY TargetPoints DESC
         LIMIT 1`,
        [usedPoints]
      );

      if (vip && Number(vip.VipLevel) > currentVipLevel) {
        await connection.query(
          "UPDATE account SET VipLevel = ? WHERE AccountId = ?",
          [vip.VipLevel, receiver.AccountId]
        );
        newVipLevel = Number(vip.VipLevel);
      } else {
        newVipLevel = currentVipLevel;
      }
    } else {
      // Category 9: just return current VipLevel
      const [[accInfo]] = await connection.query(
        "SELECT VipLevel FROM account WHERE AccountId = ?",
        [receiver.AccountId]
      );
      newVipLevel = Number(accInfo?.VipLevel ?? 0);
    }

    await connection.commit();

    return res.status(200).json({
      message: "Purchase successful.",
      newPoints,
      newVipLevel,
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // ignore rollback errors
    }

    const status = error.httpStatus || 500;
    const message = status === 500 ? "Internal server error." : error.message;

    console.error("Purchase failed:", error);
    return res.status(status).json({ message });
  } finally {
    // Extra safety: if someone adds a new early return later, this prevents transaction leaks
    try {
      await connection.rollback();
    } catch {
      // ignore
    }
    connection.release();
  }
};



export const deleteItem = async (req, res) => {
  const { guid } = req.params;

  if (!guid) {
    return res.status(400).json({ message: 'Missing item GUID.' });
  }

  try {
    const { AccountId } = req.user;
  
    const [sqlResult] = await sqlPool.query(
      `SELECT Name, AccountId, RoleGroupName
       FROM account
       WHERE AccountId = ?`,
      [AccountId]
    );
  
    if (!sqlResult.length) {
      return res.status(403).json({ message: "User not found" });
    }
  
    const user = sqlResult[0];
  
    // console.log(user)
    if(user.RoleGroupName !== "Owner" || user.Name !== "gmfirst"){
      return res.status(403).json({ message: "Invalid User Role Or Admin" });
    }
    const [result] = await sqlPool.query(
      'DELETE FROM webshop WHERE guid = ?',
      [guid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
};


  