const { exec } = require('child_process');

// Helper to run sequelize CLI commands
function runSequelizeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}

exports.migrateUp = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:migrate');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.migrateDown = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:migrate:undo');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.migrateUndoAll = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:migrate:undo:all');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.seedUp = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:seed:all');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.seedDown = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:seed:undo');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.seedUndoAll = async (req, res) => {
  try {
    const output = await runSequelizeCommand('npx sequelize db:seed:undo:all');
    res.status(200).json({ success: true, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};
