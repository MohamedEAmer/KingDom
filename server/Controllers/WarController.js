import sqlPool from '../db/sqlConnection.js';
import WarModel from '../Models/WarModal.js';

const validDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export const getTownOccupation = async (req, res) => {
  try {
    const [results] = await sqlPool.query(`
      SELECT 
        warresults.*, 
        guild.Name AS guild_name, 
        characterrecord.Name AS leader_name
      FROM warresults
      JOIN guild ON warresults.guildid = guild.Id
      JOIN characterrecord ON guild.LeaderLowId = characterrecord.EntityLowId
      LIMIT 3
    `);

    // Add warLevel based on mapid
    const dataWithWarLevel = results.map(record => {
      let warLevel = '';

      switch (record.mapid) {
        case 0:
          warLevel = '40-59';
          break;
        case 3:
          warLevel = '24-39';
          break;
        case 7:
          warLevel = '60-75';
          break;
        default:
          warLevel = 'Unknown';
      }

      return {
        ...record,
        warLevel,
      };
    });

    res.status(200).json({
      status: 200,
      message: "success",
      data: dataWithWarLevel,
    });
  } catch (error) {
    console.error('TownOccupation Error:', error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const setWarsTiming = async (req, res) => {
    const { day, wars } = req.body;
  
    // Validate `day`
    if (!day || !validDays.includes(day)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid 'day'. Must be one of: " + validDays.join(", "),
      });
    }
  
    // Validate `wars` array
    if (!Array.isArray(wars) || wars.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "'wars' must be a non-empty array.",
      });
    }
  
    let hasNextFlag = false;
  
    // Validate and normalize each war object
    const normalizedWars = wars.map((war, index) => {
      if (typeof war.time !== "string" || !/^\d{2}:\d{2}$/.test(war.time)) {
        throw new Error(`Invalid 'time' at index ${index}. Expected format: 'HH:MM'`);
      }
  
      const isNext = Boolean(war.isNext);
      if (isNext) hasNextFlag = true;
  
      return {
        time: war.time,
        duration: 35, // fixed duration
        isNext,
      };
    });
  
    try {
      // If any war in this request is marked isNext, clear all others first
      if (hasNextFlag) {
        await WarModel.updateMany(
          { },
          { $set: { "wars.$[].isNext": false } }
        );
      }
  
      // Replace or create the day's entry
      const updatedWar = await WarModel.findOneAndUpdate(
        { day: new RegExp(`^${day}$`, 'i') },
        { day, wars: normalizedWars },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        status: 200,
        message: "Wars timing set successfully.",
        data: updatedWar,
      });
    } catch (error) {
      console.error("setWarsTiming error:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
};
  



function toMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}
  
export const getWarsTiming = async (req, res) => {
    const { day, time } = req.query;
  
    if (!day || !validDays.includes(day)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid 'day'. Must be one of: " + validDays.join(", "),
      });
    }
  
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid 'time'. Format must be 'HH:MM'.",
      });
    }
  
    try {
      const nowMinutes = toMinutes(time);
      const currentDayIndex = validDays.indexOf(day);
  
      // Step 1: Get all days (we still need this to update isNext flags)
      const allWars = await WarModel.find();
  
      // Step 2: Calculate upcoming war
      let upcomingWar = null;
  
      for (const doc of allWars) {
        const docDayIndex = validDays.indexOf(doc.day);
  
        for (const war of doc.wars) {
          const warMinutes = toMinutes(war.time);
  
          let diffMinutes;
          if (doc.day === day) {
            diffMinutes = warMinutes > nowMinutes
              ? warMinutes - nowMinutes
              : 7 * 24 * 60 + warMinutes - nowMinutes;
          } else {
            const dayDiff = (docDayIndex - currentDayIndex + 7) % 7;
            diffMinutes = dayDiff * 24 * 60 + warMinutes - nowMinutes;
          }
  
          if (!upcomingWar || diffMinutes < upcomingWar.minutesUntil) {
            upcomingWar = {
              day: doc.day,
              time: war.time,
              minutesUntil: diffMinutes,
            };
          }
        }
      }

      // Step 3: Update isNext flags
      if (upcomingWar) {
        for (const doc of allWars) {
          const updatedWars = doc.wars.map((war) => ({
            ...war.toObject(),
            isNext: doc.day === upcomingWar.day && war.time === upcomingWar.time,
          }));
          await WarModel.updateOne({ _id: doc._id }, { wars: updatedWars });
        }
      }
  
      res.status(200).json({
        status: 200,
        currentDay: day,
        currentTime: time,
        nextWar: upcomingWar,
      });
  
    } catch (err) {
      console.error("getWarsTiming error:", err);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: err.message,
      });
    }
};

export const getTownLastWarResult = async (req, res) => {
  const { Town } = req.params;
  if (Town === undefined) {
    return res.status(400).json({ message: 'Missing Town parameter.' });
  }

  try {
    // Step 1: Get the latest war for the specified town
    const [warRows] = await sqlPool.query(
      `SELECT * 
       FROM battlegroundresultrecord
       WHERE Town = ?
       ORDER BY guid DESC
       LIMIT 1`,
      [Town]
    );

    if (!warRows || warRows.length === 0) {
      return res.status(400).json({ message: 'No war record found for this town.' });
    }

    const WarGuid = warRows[0].Guid;

    // Step 2: Get players who participated in this war
    const [players] = await sqlPool.query(
      `SELECT 
         b.*,
         c.Asda2FactionId,
         c.ClassId
       FROM battlegroundcharacterresultrecord b
       LEFT JOIN characterrecord c ON b.CharacterGuid = c.EntityLowId
       WHERE b.WarGuid = ?
       ORDER BY b.ActScores DESC`,
      [WarGuid]
    );

    if (!players || players.length === 0) {
      return res.status(400).json({ message: 'No participants found for this war.' });
    }

    // Step 3: Return warGuid and participants
    res.status(200).json({
      WarGuid,
      participants: players,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve war data.' });
  }
};

export const getTownWarLeaderboard = async (req, res) => {
  const { Town } = req.params;

  if (!Town) {
    return res.status(400).json({ message: 'Missing Town parameter.' });
  }

  try {
    // Step 1: Get all war GUIDs for the given town
    const [warRows] = await sqlPool.query(
      `SELECT Guid 
       FROM battlegroundresultrecord
       WHERE Town = ?`,
      [Town]
    );
    if (!warRows || warRows.length === 0) {
      return res.status(400).json({ message: 'No wars found for this town.' });
    }

    const WarGuids = warRows.map(row => row.Guid);

    // Step 2: Aggregate data per player over all those wars
    const [players] = await sqlPool.query(
      `
      SELECT 
        b.CharacterGuid,
        c.Asda2FactionId,
        c.ClassId,
        SUM(b.ActScores) AS TotalActScores,
        SUM(b.Kills) AS TotalKills,
        SUM(b.Deathes) AS TotalDeathes
      FROM battlegroundcharacterresultrecord b
      LEFT JOIN characterrecord c ON b.CharacterGuid = c.EntityLowId
      WHERE b.WarGuid IN (?)
      GROUP BY b.CharacterGuid
      ORDER BY TotalActScores DESC
      `,
      [WarGuids]
    );

    if (!players || players.length === 0) {
      return res.status(400).json({ message: 'No participant data found.' });
    }

    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve leaderboard.' });
  }
};


export const getTownAllWars = async (req, res) => {
  const { Town } = req.params;
  if (!Town) {
    return res.status(400).json({ message: 'Missing Town parameter.' });
  }

  try {
    // Step 1: Get all war GUIDs for the given town
    const [warRows] = await sqlPool.query(
      `SELECT * 
       FROM battlegroundresultrecord
       WHERE Town = ?
       ORDER BY Guid DESC`,
      [Town]
    );
    if (!warRows || warRows.length === 0) {
      return res.status(400).json({ message: 'No wars found for this town.' });
    }
    res.status(200).json(warRows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve leaderboard.' });
  }
};





