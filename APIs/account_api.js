const express = require('express');
const router = express.Router();
const accountModel = require('../model/account');
const app = express();


// Account registration
router.post('/register', async (req, res) => {
  try {
    const {username, password} = req.body;
    
    // Check if the username or username_en already exists
    const existingUser = await accountModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists'});
    }
    
    // Create a new user if no duplicates found
    const user = new accountModel({ username, password });
    await user.save();
    res.status(201).json({ message: 'Account registered successfully'});
  } catch (error) {
    // Handle specific errors if needed
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


// Account Login
router.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await accountModel.findOne({ username });
      if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Authentication failed' });
      }
      res.status(200).json({ status: true, message: "Login successful" });
  } catch (error) {
      res.status(500).json({ message: 'Login failed' });
  }
});





// Account registration
router.get('/list', async (req, res) => {
    try {
        accountModel.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
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
    res.status(500).json({ error: 'Account list failed' });
    }
});
 

module.exports = router;