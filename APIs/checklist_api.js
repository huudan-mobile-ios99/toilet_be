const express = require('express');
const router = express.Router();
const checkListModel = require('../model/checklist');
const fs = require('fs');
const Excel = require('exceljs');
const path = require('path')



// Create new checklist
router.post('/create', async (req, res) => {
    try {
      const { title, body, username, username_en, is_finish, createAt } = req.body;
      // Check if a checklist with the same title and username already exists
      // const existingChecklist = await checkListModel.findOne({title, body, username, username_en});
      // if (existingChecklist) {
      //   return res.status(409).json({ error: 'Checklist with the same title and username already exists' });
      // }
  
      // Create and save the new checklist
      const newChecklist = new checkListModel({ title, body, username, username_en, is_finish, createAt, });
      await newChecklist.save();
  
      res.status(201).json({status:true, message: 'CheckList created successfully',data:newChecklist });
    } catch (error) {
      res.status(500).json({ message: 'Checklist creation failed' });
    }
  });
//List CheckList
router.get('/list', async (req, res) => {
    try {
        checkListModel.find({})
        .sort({ updateAt: -1 }) // Sort by createdAt in descending order
        // .limit(15) // Limit the results to 15 records
        .exec(function (err, data) {
          if (err) {
            console.log(err);
            res.status(500).send({ "status": false, "message": "An error occurred" });
          } else {
            if (data == null || data.length == 0) {
              res.status(200).json({ "status": false, "message": "find list checklist fail", "totalResult": null, "data": data });
            } else {
              res.json({ "status": true, "message": "find checklist user success", "totalResult": data.length, "data": data });
            }
          }
        });
    } catch (error) {
    res.status(500).json({ error: 'get list checklist failed' });
    }
});
// List CheckList with Pagination
router.get('/list/paging', async (req, res) => {
  try {
      const { start = 0, limit = 10 } = req.query;
      checkListModel.find({})
          .sort({ updateAt: -1 }) // Sort by createdAt in descending order
          .skip(parseInt(start))    // Skip records based on the 'start' parameter
          .limit(parseInt(limit))   // Limit the results to the 'limit' parameter
          .exec(function (err, data) {
              if (err) {
                  console.log(err);
                  res.status(500).send({ "status": false, "message": "An error occurred" });
              } else {
                  if (data == null || data.length == 0) {
                      res.status(200).json({ "status": false, "message": "find list checklist fail", "totalResult": null, "data": data });
                  } else {
                      res.json({ "status": true, "message": "find checklist user success", "totalResult": data.length, "data": data });
                  }
              }
          });
  } catch (error) {
      res.status(500).json({ error: 'get list checklist failed' });
  }
});    
router.get('/list_simple/paging', async (req, res) => {
  try {
      const { start = 0, limit = 10 } = req.query;
      checkListModel.find({})
          .sort({ updateAt: -1 }) // Sort by createdAt in descending order
          .skip(parseInt(start))    // Skip records based on the 'start' parameter
          .limit(parseInt(limit))   // Limit the results to the 'limit' parameter
          .exec(function (err, data) {
              if (err) {
                  console.log(err);
                  res.status(500).send({ "status": false, "message": "An error occurred" });
              } else {
                  if (data == null || data.length == 0) {
                      res.status(200).json([]);
                  } else {
                      res.json( data );
                  }
              }
          });
  } catch (error) {
      res.status(500).json({ error: 'get list checklist failed' });
  }
});
    
    
//UPDATE user by _id
router.put('/update/:id', async (req, res) => {
        try {
          const checklistId = req.params.id;
          const { title,body,username, username_en,is_finish,updateAt } = req.body;
      
          // Check if the user exists
          const existingUser = await checkListModel.findById(checklistId);
          if (!existingUser) {
            return res.status(404).json({ error: 'Checklist not found' });
          }
      
          // Update user fields
          existingUser.username = username || existingUser.username;
          existingUser.username_en = username_en || existingUser.username_en;
          existingUser.title = title || existingUser.title;
          existingUser.body = body || existingUser.body;
          existingUser.title = is_finish || existingUser.is_finish;
          existingUser.updateAt = updateAt || existingUser.updateAt;
      
          // Save the updated user
          await existingUser.save();
      
          res.status(200).json({ status: true, message: 'Checklist updated successfully',data:existingUser });
        } catch (error) {
          res.status(500).json({ error: 'Update failed' });
        }
});



// User delete by _id
router.delete('/delete/:id', async (req, res) => {
    try {
      const checklistId = req.params.id;
  
      // Check if the user exists
      const existingUser = await checkListModel.findById(checklistId);
      if (!existingUser) {
        return res.status(404).json({ error: 'Checklist not found' });
      }
  
      // Delete the user
      await existingUser.remove();
  
      res.status(200).json({ status: true, message: 'Checklist deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Delete checklist failed' });
    }
});
//download Checklist Export Excel

// Define a route for downloading Excel files
router.get('/download_excel/:fileName',async (req, res) => {
  const fileName = req.params.fileName;
  const excelFolderPath = 'public/excel'; // Replace with your folder path

  // Create the full path to the Excel file
  const excelFilePath = path.join(excelFolderPath, fileName);

  // Check if the file exists
  if (fs.existsSync(excelFilePath)) {
    // Set the response headers to specify the file type and attachment
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Create a read stream to send the file content to the response
    const fileStream = fs.createReadStream(excelFilePath);

    // Log when the download starts
    console.log(`Downloading file: ${fileName}`);

    // Pipe the file stream to the response
    fileStream.pipe(res);

    // Log when the download is complete
    fileStream.on('end', () => {
      console.log(`Downloaded file: ${fileName}`);
    });
  } else {
    // If the file does not exist, send a 404 response
    console.log(`File not found: ${fileName}`);
    res.status(404).send('File not found');
  }
});


//List CheckList Export Excel
router.get('/export_data', async (req, res) => {
  try {
    checkListModel.find(function (err, data) {
      if (err) {
        console.log(err);
        res.send({ "status": false, "message": "Failed to retrieve checklist  data", "totalResult": null, "data": null });
      } else {
        if (data == null || data.length === 0) {
          res.send({ "status": false, "message": "No checklist  found", "totalResult": 0, "data": null });
        } else {
          const workbook = new Excel.Workbook();
          const sheet = workbook.addWorksheet('Sheet1');
          sheet.addRow(["STT",  "USER NAME", "USERNAME ENGLISH", "TITLE","TIME",  "DATE",]); // Add header row
          data.forEach((item, index) => {
            const createdAt = new Date(item.createdAt);
            const date = createdAt.toLocaleDateString(); // Extract date component
            const time = createdAt.toLocaleTimeString(); 
            if (item.isCorrect === true) {
              row.getCell('F').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'C6EFCE' } // Set background color to light green
              };
            }
            const row = sheet.addRow([index + 1, item.username, item.username_en, item.title, time, date,]); // Add data rows
          });
          const headerRow = sheet.getRow(1);
          const greenAccentColor = { argb: '6EB4F7' };
          ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
            headerRow.getCell(col).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: greenAccentColor // Set background color to green-accent
            };
          });
          sheet.getRow(1).height = 15; // Set row height of row 1 to 40
          sheet.getColumn(1).width = 5; // Set column width of column A to 15
          sheet.getColumn(2).width = 30; // Set column width of column B to 10
          sheet.getColumn(3).width = 30; // Set column width of column B to 10
          sheet.getColumn(4).width = 30; // Set column width of column B to 10
          sheet.getColumn(5).width = 30; // Set column width of column B to 10
          sheet.getColumn(6).width = 30; // Set column width of column B to 10
          sheet.getColumn(7).width = 30; // Set column width of column B to 10
          
          sheet.eachRow((row) => {
            row.eachCell((cell) => {
              cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text to left and vertically centered
            });
          });
  
          const formattedTimestamp = getFormattedTimestamp();
          const randomString = generateRandomString(3); // Generate a random string with length 5
          const excelFileName = `checklist_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
          const excelFolderPath = 'public/excel'; // Replace with your desired folder path for saving the Excel file
          if (!fs.existsSync(excelFolderPath)) {
            fs.mkdirSync(excelFolderPath, { recursive: true });
          }
          const excelFilePath = path.join(excelFolderPath, excelFileName); // Use an absolute path for the file path
          workbook.xlsx.writeFile(excelFilePath)
            .then(() => {
              console.log(`Excel file was saved at: ${excelFilePath}`); // Log the file location
              res.send({ "status": true, "message": "checklist Excel file generated and saved on server", "filePath": excelFileName });
            })
            .catch((err) => {
              console.error(err);
              res.send({ "status": false, "message": "Failed to generate checklist excel file", "filePath": null });
            });
        }
      }
    });
  } catch (error) {
  res.status(500).json({ error: 'export list checklist failed' });
  }
});

module.exports = router;



function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function getFormattedTimestamp() {
  const timestamp = new Date().getTime(); // Get current timestamp
  // Format the timestamp
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(4, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  // Create formatted timestamp string
  const formattedTimestamp = `${day}-${month}-${year}_${hours}-${minutes}`;
  return formattedTimestamp;
}