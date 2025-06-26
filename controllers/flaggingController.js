const { flagged_words } = require('../models')

const flagContent = async (req, res) => {
  const { dialect_id, word, reason } = req.body;
  try {
    const newFlag = await flagged_words.create({ dialect_id, word, reason });
    
    res.status(201).json({ message: 'Content flagged successfully', result: newFlag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFlaggedContents = async (req, res) => {
    try{
        const flaggedWords = await flagged_words.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({message: 'All flagged contents retrieved', data: flaggedWords});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};


module.exports = {
    flagContent,
    getAllFlaggedContents
};