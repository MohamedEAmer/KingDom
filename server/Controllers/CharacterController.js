import sqlPool from '../db/sqlConnection.js';

export const getDailyAttend = async (req, res) => {
  const char = req.params.name;
  const charId = req.params.id;
  if (!char || !charId) {
    return res.status(400).json({ message: "Missing character." });
  }

  try {
    const [rows] = await sqlPool.query(
      `
      SELECT *
      FROM dailygift
      WHERE Name = ? AND Entrylowid = ?
      ORDER BY datetime DESC
      LIMIT 28
      `,
      [char, charId]
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        streak: 0,
        lastDay: null,
      });
    }

    const filtered = [];
    let previousDate = new Date(rows[0].datetime);

    // Only push latest day if it's within the last 14 days
    const now = new Date();
    const diffDaysLatest = Math.abs(now - previousDate) / (1000 * 60 * 60 * 24);
    if (diffDaysLatest <= 14) {
      filtered.push(rows[0]);
    } else {
      // Latest day is too old, streak = 0
      return res.status(200).json({
        streak: 0,
        lastDay: rows[0].datetime,
      });
    }

    for (let i = 1; i < rows.length; i++) {
      const currentDate = new Date(rows[i].datetime);
      const diffDays = Math.abs(previousDate - currentDate) / (1000 * 60 * 60 * 24);

      if (diffDays > 14) break; // streak broken

      filtered.push(rows[i]);
      previousDate = currentDate;
    }

    return res.status(200).json({
      streak: filtered.length,
      lastDay: rows[0].datetime,
    });

  } catch (err) {
    console.error("Error fetching daily attendance:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const getDailyData = async (req, res) => {
    try {
      // Step 1 — get all 28 items
      const [rows] = await sqlPool.query(
        `
          SELECT item_img
          FROM dailygiftitem
          WHERE id <= 28
          ORDER BY id ASC
          LIMIT 28
        `
      );
  
      if (!rows || rows.length === 0) {
        return res.status(500).json({ message: "Server error: Cannot get items." });
      }
  
      return res.status(200).json({ rows });
    } catch (err) {
      console.error("Error fetching daily data items:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  
  
  export const getCharMail = async (req, res) => {
    const charId = req.params.id
    if (!charId) {
        return res.status(400).json({ message: "Missing character name." });
      }
    try {  
      // Step 1 — get latest 28 records
      const [rows] = await sqlPool.query(
        `
          SELECT
          d.Amount,
          d.Creator,
          d.Created,
          d.Recived,
          t.Name,
          COALESCE(
            SUBSTRING_INDEX(i.ImageFullName, '.', 1),
            SUBSTRING_INDEX(t.img_name , '.',1)
          ) AS ItemImg
        FROM asda2donationitem d
        LEFT JOIN asda2itemtemlate t ON t.Id = d.ItemId
        LEFT JOIN itemsimglist i ON i.ItemId = d.ItemId
        WHERE d.RecieverId = ?
        ORDER BY d.Created DESC;
        `,
        [charId]
      );
  
      if (!rows || rows.length === 0) {
        return res.status(400).json({ message: "You don't have any Mails." });
      }
        
      return res.status(200).json({rows});
  
    } catch (err) {
      console.error("Error fetching Mail:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
};

export const giveCharBeta = async (req, res) => {
  const charId = req.params.id;

  if (!charId) {
    return res.status(400).json({ message: "Missing character ID." });
  }

  const connection = await sqlPool.getConnection();

  try {
    await connection.beginTransaction();

    // 1) Fetch character → AccountId
    const [charResult] = await connection.query(
      `SELECT AccountId FROM characterrecord WHERE EntityLowId = ?`,
      [charId]
    );

    if (!charResult || charResult.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Character not found." });
    }

    const accountId = charResult[0].AccountId;

    // 2) Fetch account → RoleGroupName
    const [accountResult] = await connection.query(
      `SELECT IsBeta FROM account WHERE AccountId = ?`,
      [accountId]
    );

    if (!accountResult || accountResult.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Account not found." });
    }

    const role = accountResult[0].IsBeta;

    // 3) If already Player → STOP (means already received or not beta)
    if (role === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Character is not a beta player or already received the gifts."
      });
    }

    // 4) Get beta gifts
    const [betaGifts] = await connection.query(`
      SELECT ItemId, Amount FROM betagifts
    `);

    if (!betaGifts || betaGifts.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "No beta gifts found." });
    }

    // 5) Insert beta gifts into asda2donationitem
    for (const gift of betaGifts) {
      await connection.query(
        `
        INSERT INTO asda2donationitem
          (ItemId, Amount, RecieverId, Creator, IsSoulBound, Recived, Created)
        VALUES (?, ?, ?, '~Beta Gifts~', 1, 0, NOW())
        `,
        [gift.ItemId, gift.Amount, charId]
      );
    }

    // 6) Update RoleGroupName → Player (Beta gifts delivered)
    await connection.query(
      `UPDATE account SET IsBeta = 0 WHERE AccountId = ?`,
      [accountId]
    );

    // 7) Commit transaction
    await connection.commit();

    return res.status(200).json({
      message: "Beta gifts delivered successfully.",
      delivered: betaGifts.length
    });

  } catch (err) {
    console.error("Error giving Beta gifts:", err);
    await connection.rollback();
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    connection.release();
  }
};



export const getGachaUsed = async (req, res) => {
  const charId = req.params.id
  if (!charId) {
      return res.status(400).json({ message: "Missing character name." });
    }
  try {  
    const [gacha] = await sqlPool.query(
      `
        SELECT GachaUsed From characterrecord WHERE EntityLowId = ?
      `,
      [charId]
    );

    if (!gacha || gacha.length === 0) {
      return res.status(400).json({ message: "You don't have any Mails." });
    }
    return res.status(200).json(gacha[0].GachaUsed);

  } catch (err) {
    console.error("Error fetching Mail:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const giveGachaGift = async (req, res) => {
  const charId = Number(req.params.id);
  const gachaUsedParam = Number(req.params.gacha);

  if (!charId || gachaUsedParam === undefined || gachaUsedParam < 500) {
    return res.status(400).json({ message: "Missing or invalid character Gacha info." });
  }

  const connection = await sqlPool.getConnection();

  try {
    await connection.beginTransaction();

    // 1) Fetch current GachaUsed and AccountId from characterrecord
    const [charRows] = await connection.query(
      `SELECT GachaUsed, AccountId FROM characterrecord WHERE EntityLowId = ?`,
      [charId]
    );

    if (!charRows || charRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Character not found." });
    }

    const { GachaUsed: currentGachaUsed, AccountId } = charRows[0];

    // Ensure gachaUsedParam does not exceed actual GachaUsed
    const gachaUsed = Math.min(gachaUsedParam, currentGachaUsed);

    if (gachaUsed < 500) {
      await connection.rollback();
      return res.status(400).json({ message: "Not enough Gacha points to claim gift." });
    }

    const newGacha = currentGachaUsed - 500;

    // 2) Insert Gacha gift
    await connection.query(
      `INSERT INTO asda2donationitem
        (ItemId, Amount, RecieverId, Creator, IsSoulBound, Recived, Created)
       VALUES (56820, 1, ?, '~GachaGift~', 1, 0, NOW())`,
      [charId]
    );

    // 3) Update GachaUsed
    await connection.query(
      `UPDATE characterrecord SET GachaUsed = ? WHERE EntityLowId = ?`,
      [newGacha, charId]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Gacha gift delivered successfully.",
      remainingGacha: newGacha,
      charId,
      accountId: AccountId
    });

  } catch (err) {
    console.error("Error giving Gacha gifts:", err);
    await connection.rollback();
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    connection.release();
  }
};


