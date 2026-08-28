import sqlPool from '../db/sqlConnection.js';

export const getTop10Ranks = async (req, res) => {
    try {
      const [ranks] = await sqlPool.query(
        'SELECT `Name` FROM characterrecord ORDER BY TotalTitlePoints DESC LIMIT 10' //was TitlePoints
      );
  
      res.status(200).json({
        status: 200,
        message: 'success',
        data: ranks
      });
    } catch (err) {
      res.status(500).json({ error: 'Ranks Error' });
    }
};

// royal roles system
export const getKing = async (req, res) => {
  try {
    const [rows] = await sqlPool.query(
      `
      SELECT c.Name, c.EntityLowId, COALESCE(r.KingTokens, 0) AS Tokens
      FROM characterrecord c
      LEFT JOIN royalroles r ON r.EntityLowId = c.EntityLowId
      WHERE c.VIPLevel = 5
      LIMIT 1
      `
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({ king: null });
    }

    return res.status(200).json({ king: rows[0] });
  } catch (err) {
    console.error('Error fetching the King:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// royal roles system
const ROYAL_RANKS = {
  1: { title: 'Knight', tokenColumn: 'KnightTokens', seatLimit: 20 },
  2: { title: 'Duke', tokenColumn: 'DukeTokens', seatLimit: 15 },
  3: { title: 'Count', tokenColumn: 'CountTokens', seatLimit: 10 },
  4: { title: 'Prince', tokenColumn: 'PrinceTokens', seatLimit: 4 },
  5: { title: 'King', tokenColumn: 'KingTokens', seatLimit: 1 },
};

export const getRoyalRoleList = async (req, res) => {
  const level = Number(req.params.level);
  const rank = ROYAL_RANKS[level];

  if (!rank) {
    return res.status(400).json({ message: 'Invalid royal rank level.' });
  }

  try {
    // rank.tokenColumn comes from the fixed ROYAL_RANKS map above (never user input),
    // so it's safe to interpolate directly into the query.
    const [rows] = await sqlPool.query(
      `
      SELECT c.Name, c.EntityLowId, COALESCE(r.${rank.tokenColumn}, 0) AS Tokens
      FROM characterrecord c
      LEFT JOIN royalroles r ON r.EntityLowId = c.EntityLowId
      WHERE c.VIPLevel = ?
      ORDER BY Tokens DESC, c.EntityLowId ASC
      LIMIT ?
      `,
      [level, rank.seatLimit]
    );

    return res.status(200).json({
      level,
      title: rank.title,
      seatLimit: rank.seatLimit,
      players: rows,
    });
  } catch (err) {
    console.error('Error fetching royal role list:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getTotalPlayers = async (req, res) => { // the same for events and items in web shop
  try {
    const [result] = await sqlPool.query('SELECT COUNT(*) AS total FROM account');

    res.status(200).json({
      totalPlayers: result[0].total,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching total players' });
  }
};


export const getPlayer = async (req, res) => {
  const { AccountId } = req.user;
  if (!AccountId) {
    return res.status(400).json({ message: 'Missing account ID parameter.' });
  }

  try { 
    const [characters] = await sqlPool.query(
      `SELECT Name, EntityLowId ,Level, ClassId, TitlesRank
       FROM characterrecord
       WHERE AccountId = ?`,
      [AccountId]
    );
    // const [AccPoints] = await sqlPool.query(
    //   'SELECT Points FROM accountdata WHERE accountId = ? ',
    //   [accountId]
    // );
    res.status(200).json({
      AccountId,
      //Points:AccPoints[0]?.Points,
      characters,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve character data.' });
  }
};




// export const getAllPlayersCharactersInfo = async (req, res) => {
//   try {
//     // Step 1: Get all account IDs
//     const [accounts] = await sqlPool.query('SELECT AccountId, Name FROM account ORDER BY AccountId ASC');
//     if (!accounts || accounts.length === 0) {
//       return res.status(404).json({ message: 'No accounts found.' });
//     }

//     // Step 2: Process each account
//     const result = await Promise.all(
//       accounts.map(async (account) => {
//         const accountId = account.AccountId;

//         // Get characters
//         const [characters] = await sqlPool.query(
//           `SELECT Name, Level, ClassId, TitlesRank FROM characterrecord WHERE AccountId = ?`,
//           [accountId]
//         );

//         // Get points
//         const [pointsResult] = await sqlPool.query(
//           `SELECT Points FROM account WHERE AccountId = ?`,
//           [accountId]
//         );

//         return {
//           accountId,
//           accountName: account.Name,
//           points: pointsResult[0]?.Points ?? 0,
//           characters,
//         };
//       })
//     );

//     res.status(200).json({ accounts: result });
//   } catch (error) {
//     console.error('Error fetching account data:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getAllPlayersCharactersInfo = async (req, res) => {

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
    const [rows] = await sqlPool.query(`
      SELECT
        a.AccountId,
        a.Name AS accountName,
        a.Points,
        c.EntityLowId,
        c.Name AS charName,
        c.Level,
        c.ClassId,
        c.TitlesRank
      FROM account a
      LEFT JOIN characterrecord c ON c.AccountId = a.AccountId
      ORDER BY a.AccountId ASC
    `);

    // Group rows into accounts
    const map = new Map();

    for (const r of rows) {
      if (!map.has(r.AccountId)) {
        map.set(r.AccountId, {
          accountId: r.AccountId,
          accountName: r.accountName,
          points: r.Points ?? 0,
          characters: [],
        });
      }

      if (r.EntityLowId != null) {
        map.get(r.AccountId).characters.push({
          EntityLowId: r.EntityLowId,
          Name: r.charName,
          Level: r.Level,
          ClassId: r.ClassId,
          TitlesRank: r.TitlesRank,
        });
      }
    }

    return res.status(200).json({ accounts: Array.from(map.values()) });
  } catch (error) {
    console.error("Error fetching account data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const editPlayerBalance = async (req, res) => {
  const { id: accountId } = req.params;
  const { newBalance } = req.body;

  if (!accountId || newBalance === undefined) {
    return res.status(400).json({ message: 'Missing account ID or new balance.' });
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
      'UPDATE account SET Points = ? WHERE AccountId = ?',
      [newBalance, accountId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.status(200).json({ message: 'Balance updated successfully.' });
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getPlayerBalance = async (req, res) => {
  const { id : accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({ message: 'Missing account ID' });
  }

  try{
        // Get points
        const [pointsResult] = await sqlPool.query(
          `SELECT Points FROM account WHERE AccountId = ?`,
          [accountId]
        );
      res.status(200).json({Points :pointsResult[0].Points});
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getPlayerItems = async (req, res) => {
  const { AccountId } = req.user;
  if (!AccountId) {
    return res.status(400).json({ message: 'Missing account ID' });
  }

  try{
        // Get All Data
    // const [itemsResult] = await sqlPool.query(
    //   `SELECT * FROM webshoprecord WHERE AccId = ? ORDER BY CreatedAt DESC`,
    //   [accountId]
    // );
    // Get Needed Data
    const [itemsResult] = await sqlPool.query(
      `
        SELECT 
          Amount,
          CharName,
          CreatedAt,
          History,
          Img,
          ItemName,
          Price,
          id
        FROM webshoprecord
        WHERE AccId = ?
        ORDER BY CreatedAt DESC
        LIMIT 25
      `,
      [AccountId]
    );
    

    res.status(200).json(itemsResult);
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getVipInfo = async (req, res) => {
  try {
    const [vipLevels] = await sqlPool.query(
      `
      SELECT 
        VipLevel,
        TargetPoints
      FROM viplevels
      ORDER BY VipLevel ASC
      LIMIT 20
      `
    );

    res.status(200).json({
      success: true,
      levels: vipLevels
    });
  } catch (err) {
    console.error('Error Getting vip levels:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};




