const express = require("express");
const router = express.Router();
const feedbackCustomerModelv2 = require("../model/feedback_customer_v2");
const app = express();
const fs = require("fs");
const functions = require("../functions");
const Excel = require('exceljs');
const path= require('path')

// feedback item registration
router.post("/create", async (req, res) => {
  try {
    const {
      statusName,
      customerNumber,
      customerName,
      customerCode,
      customerNatinality,
      note,
      hasNote,
      service_good,
      service_bad,
      staffNameEn,
      staffName,
      staffCode,
      staffRole,
      tag,
    } = req.body;
    const newFeedbackItem = new feedbackCustomerModelv2({
      statusName,
      customerNumber,
      customerName,
      customerCode,
      customerNatinality,
      note,
      hasNote,
      service_good,
      service_bad,
      staffNameEn,
      staffName,
      staffCode,
      staffRole,
      tag,
    });
    const savedItem = await newFeedbackItem.save();
    res.status(201).json({
      status: true,
      message: "Feedback customer  created successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("Error creating feedback customer v2 item:", error);
    res.status(500).json({ status: false, message: "Internal server error", data: null });
  }
});

//list item
router.get("/list", async (req, res) => {
  try {
    feedbackCustomerModelv2
      .find()
      .sort({ createAt: 1 }) // Sort by createdAt in descending order
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            return res.status(200).json({
              status: false,
              message: "find list feedback customer v2 fail",
              totalResult: null,
              data: data,
            });
          } else {
            return res.json({
              status: true,
              message: "find feedback customer v2  success",
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





router.get("/list/paging", async (req, res) => {
  try {
      const { start = 0, limit = 10 } = req.query;
      
      console.log(`Fetching data with start: ${start} and limit: ${limit}`);
      
      const data = await feedbackCustomerModelv2
          .find()
          .sort({ createAt: 1 }) // Sort by updateAt in descending order
          .skip(parseInt(start)) // Skip records based on the 'start' parameter
          .limit(parseInt(limit)) // Limit the results to the 'limit' parameter
          .exec();

      // console.log('Sorted Data:', data);

      if (data.length === 0) {
        return res.status(200).json({
          status: false,
          message: "find list feedback customer v2 fail",
          totalResult: null,
          data: data,
        });
      } else {
          return res.json({
            status: true,
            message: "find feedback customer v2  success",
            totalResult: data.length,
            data: data,
          });
          
      }
  } catch (error) {
      console.error("Error occurred while fetching data:", error);
      res.status(500).json({ status: false, message: "An error occurred" });
  }
});



router.get("/export_feedback", async (req, res) => {
  try {
    const workbook = new Excel.Workbook();
    const sheet1 = workbook.addWorksheet("Sheet1");
    const rowTitle = sheet1.addRow([
      "#",
      "STATUS",
      "CUSTOMER NUMBER",
      "CUSTOMER NAME",
      "COUNTY",
      "SERVICE(S)",
      "NOTE",
      "STAFF NAME EN",
      "STAFF NAME",
      "STAFF CODE",
      "STAFF ROLE",
      "DATETIME CREATED",
    ]);
    rowTitle.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00FF00" }, // Light blue color for the header row
      };
    });
    const checkEmpty = (value) => {
      return (value === 'empty' || value === 'EMPTY' || value ==="Empty") ? "" : value;
  };
   feedbackCustomerModelv2
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
                item.statusName,
                item.customerName,
                item.customerNumber,
                item.customerNatinality,
                Array.isArray(item.service_good)
                  ? item.service_good.join(", ").replace(/[\[\]"]/g, "")
                  : null,
                  checkEmpty(item.note),
                  checkEmpty(item.staffNameEn),
                  checkEmpty(item.staffName),
                  checkEmpty(item.staffCode),
                  checkEmpty(item.staffRole),
                createdAtDate ? `${createdAtDate.getHours().toString().padStart(2, '0')}:${createdAtDate.getMinutes().toString().padStart(2, '0')} ${createdAtDate.getDate().toString().padStart(2, '0')}-${(createdAtDate.getMonth() + 1).toString().padStart(2, '0')}-${createdAtDate.getFullYear()}` : "",
                
              ]);
            });
            
        
            const formattedTimestamp = functions.getFormattedTimestamp();
            const randomString = functions.generateRandomString(3);
            const excelFileName = `feedback_customer_v2_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
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


// User delete by _id
router.delete('/delete/:id', async (req, res) => {
  try {
    const feedback = req.params.id;
    // Check if the user exists
    const existingUser = await feedbackCustomerModelv2.findById(feedback);
    if (!existingUser) {
      return res.status(404).json({ error: 'feedback v2 not found' });
    }
    // Delete the user
    await existingUser.remove();

    res.status(200).json({ status: true, message: 'feedback v2 deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete feedback v2 failed' });
  }
});



// User delete by an array of customerNumbers
router.delete('/delete_many', async (req, res) => {
  try {
    const customerNumbers = req.body.customerNumbers; // Assuming the customerNumbers are passed in the request body as an array

    if (!Array.isArray(customerNumbers) || customerNumbers.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty array of customerNumbers' });
    }

    // Check if any feedbacks exist for the provided customerNumbers
    const existingFeedbacks = await feedbackCustomerModelv2.find({ customerNumber: { $in: customerNumbers } });
    if (existingFeedbacks.length === 0) {
      return res.status(404).json({ error: 'No feedbacks found for the provided customerNumbers' });
    }

    // Delete the feedbacks
    await feedbackCustomerModelv2.deleteMany({ customerNumber: { $in: customerNumbers } });

    res.status(200).json({ status: true, message: 'Feedbacks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete feedbacks failed' });
  }
});

module.exports = router;
