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
  const accountId = req.params.id;
  if (!accountId) {
    return res.status(400).json({ message: 'Missing account ID parameter.' });
  }

  try { 
    const [characters] = await sqlPool.query(
      `SELECT Name, EntityLowId ,Level, ClassId, TitlesRank
       FROM characterrecord
       WHERE AccountId = ?`,
      [accountId]
    );
    // const [AccPoints] = await sqlPool.query(
    //   'SELECT Points FROM accountdata WHERE accountId = ? ',
    //   [accountId]
    // );
    res.status(200).json({
      accountId,
      //Points:AccPoints[0]?.Points,
      characters,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve character data.' });
  }
};




export const getAllPlayersCharactersInfo = async (req, res) => {
  try {
    // Step 1: Get all account IDs
    const [accounts] = await sqlPool.query('SELECT AccountId, Name FROM account ORDER BY AccountId ASC');
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found.' });
    }

    // Step 2: Process each account
    const result = await Promise.all(
      accounts.map(async (account) => {
        const accountId = account.AccountId;

        // Get characters
        const [characters] = await sqlPool.query(
          `SELECT Name, Level, ClassId, TitlesRank FROM characterrecord WHERE AccountId = ?`,
          [accountId]
        );

        // Get points
        const [pointsResult] = await sqlPool.query(
          `SELECT Points FROM account WHERE AccountId = ?`,
          [accountId]
        );

        return {
          accountId,
          accountName: account.Name,
          points: pointsResult[0]?.Points ?? 0,
          characters,
        };
      })
    );

    res.status(200).json({ accounts: result });
  } catch (error) {
    console.error('Error fetching account data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editPlayerBalance = async (req, res) => {
  const { id: accountId } = req.params;
  const { newBalance } = req.body;

  if (!accountId || newBalance === undefined) {
    return res.status(400).json({ message: 'Missing account ID or new balance.' });
  }

  try {
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
  const { id : accountId } = req.params;
  if (!accountId) {
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
      `,
      [accountId]
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




