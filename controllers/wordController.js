const {words} = require('../models')

// Create a new word
exports.createWord = async (req, res) => {
  try {
    const word = await words.create(req.body);
    res.status(201).json(word);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all words (optionally filter by dialectId, category, and difficulty)
exports.getWords = async (req, res) => {
  try {
    const whereClause = {};
    
    // Add dialectId filter if provided
    if (req.query.dialectId) {
      whereClause.dialect_id = req.query.dialectId;
    }
    
    // Add category filter if provided
    if (req.query.category) {
      whereClause.category = req.query.category;
    }
    
    // Add difficulty filter if provided
    if (req.query.difficulty) {
      whereClause.difficulty = req.query.difficulty;
    }
    
    const filter = Object.keys(whereClause).length > 0 ? { where: whereClause } : {};
    const wordsList = await words.findAll(filter);
    res.json(wordsList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single word by ID
exports.getWord = async (req, res) => {
  try {
    const word = await words.findByPk(req.params.id);
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json(word);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a word
exports.updateWord = async (req, res) => {
  try {
    const [updated] = await words.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Word not found' });
    const word = await words.findByPk(req.params.id);
    res.json(word);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a word
exports.deleteWord = async (req, res) => {
  try {
    const deleted = await words.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Word not found' });
    res.json({ message: 'Word deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
