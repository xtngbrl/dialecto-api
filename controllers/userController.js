const {users, roles, users_roles, permissions, user_progress} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { setTokens, clearTokens } = require('../utils/tokenUtils');
const JWT_SECRET = process.env.JWT_SECRET;
require('dotenv').config();

const getUsers = async (req, res) => {
  try {
    const user = await users.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: roles,
          attributes: ['role_name']
        },
      ],
      attributes: ['id', 'first_name', 'last_name', 'username', 'email']
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await users.findByPk(id, {
      include: [
        {
          model: roles,
          attributes: ['role_name']
        }
      ],
      attributes: ['id', 'first_name', 'last_name', 'username', 'email', 'password']
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in the request object

    // Fetch user with associated role and branch
    const user = await users.findByPk(userId, {
      include: [
        {
          model: roles,
          attributes: ['role_name'], 
        }
      ],
      attributes: ['id', 'first_name', 'last_name', 'username', 'email']
    });

    if (user) {
      // Extract and format the role and permissions data
      const roleName = user.roles.map(role => ({
        role_name: role.role_name,
      }));

      // Prepare the response object
      const response = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        sex: user.sex,
        username: user.username,
        email: user.email,
        role: roleName
      };

      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


const addUser = async (req, res) => {
  const { role_name, first_name, last_name, username, email, password} = req.body;
  try {
    const newUser = await users.create({first_name, last_name, username, email, password });
   
    const role = await roles.findOne({where: {role_name}});
    if(!role){
      return res.status(400).json({error: 'Role Not Found'});
    }
    await users_roles.create({
      user_id: newUser.id,
      role_id: role.id
    });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await users.findOne({ where: { username } ,
      include: [
        {
          model: roles,
          as: 'roles', 
          include: {
            model: permissions,
            as: 'permissions', 
            through: { attributes: [] } 
          }
        },
      ] 
    
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }   

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const roleName = user.roles.some(role => ['Admin', 'Teacher', 'Student'].includes(role.role_name)) 
    ? user.roles.find(role => ['Admin', 'Teacher', 'Student'].includes(role.role_name)).role_name 
    : 'Unknown';


    setTokens(res, accessToken, refreshToken);
    res.cookie('role_name', roleName, { httpOnly: true, secure: true });

    const roleAndpermission = user.roles.map(role => ({
      role_name: role.role_name,
      permission: role.permissions.map(permission => permission.permission_name)
    }));

    res.status(200).json({ 
      accessToken, 
      refreshToken,
      roleName,
      message: 'Logged in successfully'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try{
    const user_id = req.user.id;

    clearTokens(res);

    res.status(200).json({message: 'Logged out successfully'});
  } catch(error){
    res.status(500).json({error: error.message});
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const newAccessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '2h' });
      setTokens(res, newAccessToken, refreshToken);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { first_name, last_name, username, email, password, role_name,} = req.body;
  try {
    const user = await users.findByPk(id);

    if (user) {
      user.first_name = first_name;
      user.last_name = last_name;
      user.username = username;
      user.email = email;
      if (password) {
        user.password = password; 
      }
      await user.save();

      if (role_name) {
        const role = await roles.findOne({ where: { role_name } });
        if (role) {
          await users_roles.update(
            { role_id: role.id },
            { where: { user_id: user.id } }
          );
        } else {
          return res.status(404).json({ error: 'Role not found' });
        }
      }
      res.status(200).json({message: 'User Updated Successfully'});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await users.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: `User deleted with ID: ${id}` });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { first_name, last_name, username, email, oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.id;
    const user = await users.findByPk(userId);

    // Ensure the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

     if (newPassword) {
      // Only check the old password if a new password is provided
      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Old password is incorrect.' });
      }

      // Update the password directly; the hook will hash it
      user.password = newPassword;
    }

    // Update username and email if provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


const updateProgress = async (req, res) => {
  try {
    const { user_id, level, progress } = req.body;
    const record = await user_progress.findOne({ where: { user_id, level } });

    if (record) {
      record.progress = progress;
      await record.save();
    } else {
      await user_progress.create({ user_id, level, progress });
    }

    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const { user_id } = req.params;
    const progress = await user_progress.findAll({ where: { user_id } });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  addUser,
  refresh,
  login,
  logout,
  updateUser,
  deleteUser,
  updateProfile,
  updateProgress, getUserProgress 
};