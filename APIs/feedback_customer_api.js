const express = require("express");
const router = express.Router();
const feedbackCustomerTtemsModel = require("../model/feedback_customer_item");
const feedbackCustomerModel = require("../model/feedback_customer");
const app = express();
const Excel = require('exceljs');
const fs = require('fs');
const path= require('path')

const functions = require("../functions");

// feedback item registration
router.post("/create", async (req, res) => {
  try {
    const { id, content, experience, tag } = req.body;
    const newFeedbackItem = new feedbackCustomerModel({
      id,
      content,
      experience,
      tag,
    });
    const savedItem = await newFeedbackItem.save();
    res
      .status(201)
      .json({
        status: true,
        message: "Feedback item created successfully",
        data: savedItem,
      });
  } catch (error) {
    console.error("Error creating feedback item:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  }
});

//list item
router.get("/list", async (req, res) => {
  try {
    feedbackCustomerModel
      .find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      // .limit(15) // Limit the results to 15 records
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            return res
              .status(200)
              .json({
                status: false,
                message: "find list feedbackCustomerTtemsModel fail",
                totalResult: null,
                data: data,
              });
          } else {
            return res.json({
              status: true,
              message: "find feedbackCustomeModel  success",
              totalResult: data.length,
              data: data,
            });
          }
        }
      });
  } catch (error) {
    res.status(500).json({ error: "get list checklist failed" });
  }
});
// feedback item list
router.get("/test", async (req, res) => {
  return res.json({ status: false, message: "test" });
});

router.get("/list/paging", async (req, res) => {
  try {
    const { start = 0, limit = 10 } = req.query;
    feedbackCustomerModel
      .find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(parseInt(start)) // Skip records based on the 'start' parameter
      .limit(parseInt(limit)) // Limit the results to the 'limit' parameter
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            res.status(200).json([]);
          } else {
            res.json(data);
          }
        }
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "get list feedbackCustomerTtemsModel failed" });
  }
});

router.get("/export_feedback", async (req, res) => {
  try {
    const workbook = new Excel.Workbook();
    const sheet1 = workbook.addWorksheet("Sheet1");
    const rowTitle = sheet1.addRow([
      "#",
      "INDEX",
      "CONTENT",
      "TIME",
      "DATE",
      "EXPERIENCE",
    ]);
    rowTitle.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00FF00" }, // Light blue color for the header row
      };
    });
   feedbackCustomerModel
      .find({})
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec(function (err, feedback) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (feedback == null || feedback.length == 0) {
            res.status(200).json([]);
          } else {
            feedback.forEach((item, index) => {
              const createdAtDate = new Date(item.createdAt);
              const rowItem = sheet1.addRow([
                index + 1,
                item.id,
                item.content,
                createdAtDate ? `${createdAtDate.getHours().toString().padStart(2, '0')}:${createdAtDate.getMinutes().toString().padStart(2, '0')}` : "",
                createdAtDate ? `${createdAtDate.getDate().toString().padStart(2, '0')}-${(createdAtDate.getMonth() + 1).toString().padStart(2, '0')}-${createdAtDate.getFullYear()}` : "",
                Array.isArray(item.experience)
                  ? item.experience.join(", ").replace(/[\[\]"]/g, "")
                  : null,
                
              ]);
            });
            
        
            const formattedTimestamp = functions.getFormattedTimestamp();
            const randomString = functions.generateRandomString(3);
            const excelFileName = `feedback_customer_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
            const excelFolderPath = 'public/excel'; // Replace with your desired folder path for saving the Excel file
            if (!fs.existsSync(excelFolderPath)) {
              fs.mkdirSync(excelFolderPath, { recursive: true });
            }
            const excelFilePath = path.join(excelFolderPath, excelFileName); // Use an absolute path for the file path
            workbook.xlsx.writeFile(excelFilePath)
              .then(() => {
                console.log(`Excel file was saved at: ${excelFilePath}`); // Log the file location
                res.send({ "status": true, "message": "Feedback Excel file generated and saved on server", "filePath": excelFileName });
              })
              .catch((err) => {
                console.error(err);
                res.send({ "status": false, "message": "Failed to generate feedback excel file", "filePath": null });
              });
          }
        }
      });
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "get list feedbackCustomerTtemsModel failed" });
  }
});


router.get('/download_excel/:fileName', async (req, res) => {
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
    console.log(`Downloading file: ${fileName}`);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      console.log(`Downloaded file: ${fileName}`);
    });
  } else {
    // If the file does not exist, send a 404 response
    console.log(`File not found: ${fileName}`);
    res.status(404).send('File not found');
  }
});

module.exports = router;
