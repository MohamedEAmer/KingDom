import RatesModel from '../models/RatesModal.js'; 

export const getRates = async (req, res) => {
  try {
    const rates = await RatesModel.findOne(); 

    if (!rates) {
      return res.status(404).json({
        status: 404,
        message: "Rates not found.",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Rates fetched successfully.",
      data: rates,
    });
  } catch (error) {
    console.error("getRates error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const setRates = async (req, res) => {
    const { expRate, dropRate, goldRate } = req.body;
  
    // Basic validation
    if (
      typeof expRate !== 'number' ||
      typeof dropRate !== 'number' ||
      typeof goldRate !== 'number'
    ) {
      return res.status(400).json({
        status: 400,
        message: "All fields (expRate, dropRate, goldRate) must be numbers.",
      });
    }
  
    try {
      // Upsert the single rates document
      const updatedRates = await RatesModel.findOneAndUpdate(
        {}, // empty query matches the only document
        { expRate, dropRate, goldRate },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        status: 200,
        message: "Rates updated successfully.",
        data: updatedRates,
      });
    } catch (error) {
      console.error("setRates error:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error.",
        error: error.message,
      });
    }
};