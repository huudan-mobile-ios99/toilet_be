const express = require('express');
const router = express.Router();
const userModel = require('../model/user');
const app = express();
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, username_en, image_url, isActive } = req.body;
    
    // Check if the username or username_en already exists
    const existingUser = await userModel.findOne({ $or: [{ username }, { username_en }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Username_en already exists' });
    }

    // Create a new user if no duplicates found
    const user = new userModel({ username, password, username_en, image_url, isActive });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
try {
const { username, password } = req.body;
const user = await userModel.findOne({ username });
if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
}
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
    return res.status(401).json({ message: 'Authentication failed' });
}
const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
    expiresIn: '1h',
});
 res.status(200).json({status:true,message:"login successfully",token: token,});
} catch (error) {
    res.status(500).json({ message: 'Login failed' });
}
});


// User registration
router.get('/list', async (req, res) => {
    try {
        userModel.find({isActive: true})
        .sort({ createdAt: -1, }) // Sort by createdAt in descending order
        .limit(40) // Limit the results to 15 records
        .exec(function (err, data) {
          if (err) {
            console.log(err);
            res.status(500).send({ "status": false, "message": "An error occurred" });
          } else {
            if (data == null || data.length == 0) {
              res.json({ status: false, message: "find list user fail", "totalResult": null, "data": data });
            } else {
              res.json({ status: true, message: "find list user success", "totalResult": data.length, "data": data });
            }
          }
        });
    // res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    }
    });
 
// User registration with pagination
router.get('/list/paging', async (req, res) => {
  const { start = 0, limit = 10 } = req.query;

  try {
      userModel.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(parseInt(start))    // Skip records based on the 'start' parameter
      .limit(parseInt(limit))   // Limit the results to the 'limit' parameter
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            res.send(data );
          } else {
            res.send(data);
          }
        }
      });
  // res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
  res.status(500).json({ message: 'Registration failed' });
  }
  });   
    
    
    //UPDATE user by _id
    router.put('/update/:id', async (req, res) => {
        try {
          const userId = req.params.id;
          const { username, password, username_en,image_url,is_active } = req.body;
      
          // Check if the user exists
          const existingUser = await userModel.findById(userId);
          if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          // Update user fields
          existingUser.username = username || existingUser.username;
          existingUser.username_en = username_en || existingUser.username_en;
          existingUser.image_url = image_url || existingUser.image_url;
          existingUser.isActive = is_active || existingUser.isActive;
      
          // Update password if provided
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
          }
      
          // Save the updated user
          await existingUser.save();
      
          res.status(200).json({ status: true, message: 'User updated successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Update failed' });
        }
});

// Route to update isActive status
router.put('/update_active/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get isActive value from the request body
    const { isActive } = req.body;

    // Update isActive status based on the value provided
    if (isActive !== undefined) {
      existingUser.isActive = isActive; // Assuming isActive is a boolean value
    }

    // Save the updated user
    await existingUser.save();
    
    res.status(200).json({ status: true, message: 'User isActive status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});


// User delete by _id
router.delete('/delete/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user
      await existingUser.remove();
  
      res.status(200).json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Delete failed' });
    }
});

module.exports = router;