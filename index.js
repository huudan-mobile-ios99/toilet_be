var express = require('express')
var morgan = require('morgan');
var app = express();
var path = require('path')
const mongoose = require('mongoose');
var cors = require('cors');
var router = express.Router();
app.use(express.json());
var crypto = require('crypto')
const fs = require('fs');
const bodyparser = require('body-parser');
const Excel = require('exceljs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json())
const logStream = fs.createWriteStream('log.txt', { flags: 'a' });
const functions = require('./functions')
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream: logStream }));
app.use(cors({
  origin: '*'
}));

const { db1, db2 } = require('./config_mongodb/configmain');
db1.once('open', () => {
  console.log('Connection to db1 established successfully');
});
db2.once('open', () => {
  console.log('Connection to db2 established successfully');
});


const axios = require('axios');
app.use('/', router);
//USER APIs
const userRoute = require('./APIs/user_api');
app.use('/user', userRoute);
//CHECKLIST APIs
const checklistRoute = require('./APIs/checklist_api')
app.use('/checklist', checklistRoute);
//ACCOUNT APIs
const accountRoute = require('./APIs/account_api');
app.use('/account', accountRoute);

//STAFF APIs
const staffRoute = require('./APIs/staff_api');
app.use('/staff',staffRoute);

//FEED BACK APIS
const feedbackCustomerRoute = require('./APIs/feedback_customer_api');
app.use('/feedback', feedbackCustomerRoute);
//FEED BACK APIS
const feedbackCustomerRouteV2 = require('./APIs/feedback_customer_api_v2');
app.use('/feedback_v2', feedbackCustomerRouteV2);

//UPLOAD FILES
const upload_service = require('./uploads/upload_service');
app.post("/upload_photo", upload_service.uploadFiles);
app.get('/files', upload_service.getListFiles);
app.get("/files/:name", upload_service.download);




var port = process.env.PORT || 8095;
app.listen(port);
console.log('app running at port toilet server: ' + port);


//APIs USERS



// RUN WEB
const compression = require('compression');
app.use(compression());
const oneDay = 86400000; // 24 hours in milliseconds
app.use(express.static(path.join(__dirname, 'public-flutter'), { maxAge: oneDay }));
// app.use(express.static(path.join(__dirname, 'public-flutter')));
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'public-flutter', 'index.html'));
});


//WEB RESOURCE
app.use(express.static('web/web'));
app.use(express.static('web/web/assets'));


//FIREBASE 
var admin = require('./firebase_config');
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};
const { getMessaging } = require("firebase-admin/messaging");
const serverKey = 'AAAA4zxFWx4:APA91bHtA8m3hXdBsBGHSkHnpzI4aFSFmplU_PP3MCFPs24NFeP-aFaED0cxtTvWZ6NyGW1K6qYlIpNEo_8nrA4y693wFCYM86zQ4EiNzPvwo0C46BJSpGsJZDlrMVMBLw6Wh_CiQ1T7'; // Replace with your FCM server key
const { formatDatetime, getCurrentDatetime } = require('./datetimeUtils');
const tokenModel = require('./model/token')
let messageCounter = 0;

app.post('/firebase/notification/all', async (req, res) => {
  try {
    const tokens = await tokenModel.find({}).exec();

    if (!tokens || tokens.length === 0) {
      return res.send({ "status": false, "message": "No tokens found" });
    }

    const message = req.body.message;
    const title = req.body.title || 'Default Title';
    const body = req.body.body || 'Default Body';
    const data = req.body.data || {};
    const datetime = getCurrentDatetime();
    const options = notification_options;
    const star = req.body.star;
    const feedback = req.body.feedback;

    const payload = {
      data: {
        message: message,
        datetime: datetime,
        star: star,
        feedback: JSON.stringify(feedback),
      },
      notification: {
        title: title,
        body: body,
        sound: "iphone_notification.aiff"
      },
    };

    if (!payload.data && !payload.notification) {
      return res.status(400).send("Invalid payload. Must have 'data' or 'notification'.");
    }

    const sendNotifications = tokens.map(async (token) => {
      try {
        await admin.admin_role.messaging().sendToDevice(token.value, payload, options);
        console.log(`Notification sent successfully to ${token.value}`);
      } catch (error) {
        console.error(`Error sending notification to ${token.value}:`, error);
      }
    });

    await Promise.all(sendNotifications);

    res.status(200).send("Notifications sent successfully to all tokens");
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).send("Error fetching tokens");
  }
});





app.post('/firebase/notification', (req, res) => {
  const registrationToken = req.body.registrationToken;
  const message = req.body.message;
  const title = req.body.title || 'Default Title'; // Default title if not provided
  const body = req.body.body || 'Default Body'; // Default body if not provided
  const data = req.body.data || {}; // Default empty object for data
  const datetime = getCurrentDatetime(); // Format or use current datetime if not provided
  const options = notification_options;
  const star = req.body.star;
  const feedback = req.body.feedback;
  const badge = ++messageCounter;

  const payload = {
    data: {
      message: message,
      datetime: datetime, // Include datetime in data
      star: star,
      feedback: JSON.stringify(feedback),
    },
    notification: {
      title: title,
      body: body,
      sound: "iphone_notification.aiff"
    },
  };


  // Check if the payload has either "data" or "notification" property
  if (!payload.data && !payload.notification) {
    return res.status(400).send("Invalid payload. Must have 'data' or 'notification'.");
  }

  admin.admin_role.messaging().sendToDevice(registrationToken, payload, options)
    .then(response => {
      console.log('Notification sent successfully:', response);
      res.status(200).json({
        message: "Notification sent successfully",
        // payload: payload,
      });
    })
    .catch(error => {
      console.error('Error sending notification:', error);
      res.status(500).json({
        error: "Error sending notification",
        // payload: payload,
      });
    });
});




//NOT WORK
app.post('/firebase/notification2', async (req, res) => {
  const deviceToken = req.body.registrationToken;
  const message = req.body.message;

  const notificationData = {
    to: deviceToken,
    notification: {
      title: 'Notification Title',
      body: 'Notification Body',
    },
    data: {
      message: message,
    },
  };

  try {
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', notificationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${serverKey}`,
      },
    });

    console.log('Notification sent successfully:', response.data);
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ success: false, message: 'Error sending notification' });
  }
});













app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;

  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: "YOUR FCM TOKEN HERE",
  };

  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
});







































const feedbackModel = require('./model/feedback');
const feedbackModel2 = require('./model/feedback_w_status')
// //create feedback
app.post('/create_feedback', async (req, res) => {
  const id_string = generateId(4);
  try {
    let feedback = new feedbackModel({
      "id": id_string,
      "driver": req.body.driver,
      "star": req.body.star,
      "content": req.body.content,
      "experience": req.body.experience,
      "createdAt": req.body.createdAt,
    });
    feedbackModel.findOne({ id: feedback.id }, async function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        if (data != null) {
          res.send({ "status": false, "message": "fail create feedback", "data": null });
        } else {
          feedback.save(function (err, data) {
            if (err) {
              console.log(err)
            } else {
              console.log(err)
            }
          });
          res.send({ "status": true, "message": 'Created feedback, Thank You! ', "data": feedback });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: `error ${message} ${error}` });
  }
});

app.put('/update_feedback', async (req, res) => {
  try {
    const feedbackID = req.body.id; // Assuming you have a field to specify the feedback ID in the request body
    // Create a new tripData object with the updated values
    const updatedTripData = tripModel({
      "driver": req.body.driver,
      "customer_name": req.body.customer_name,
      "customer_number": req.body.customer_number,
      "from": req.body.from,
      "to": req.body.to,
      "feedback_id": feedbackID,
      "createdAt": req.body.createdAt,
    });

    // Find the feedback document by its ID
    feedbackModel.findOne({ id: feedbackID }, async function (err, feedback) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: `Error finding feedback: ${err}` });
      } else {
        if (!feedback) {
          res.send({ "status": false, "message": "No feedback found with the specified ID", "data": null });
          return;
        }

        // Update the feedback's trip information
        feedback.trip = updatedTripData;

        // Create a new tripModel instance with the updatedTripData
        const updatedTripModel = new tripModel(updatedTripData);

        // Save the updated tripModel
        updatedTripModel.save(async (err, savedTripModel) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: `Error updating trip: ${err}` });
          } else {
            // Save the updated feedback
            feedback.save((err, updatedFeedback) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: `Error updating feedback: ${err}` });
              } else {
                res.send({ "status": true, "message": 'Updated trip information successfully', "data": updatedFeedback });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({ message: `Error: ${error}` });
  }
});

app.get('/list_feedback', async (req, res) => {
  feedbackModel.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred" });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list feedback fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list feedback success", "totalResult": data.length, "data": data });
        }
      }
    });
});

app.get('/export_feedback_status_all', async (req, res) => {
  try {
    const feedbackStatusPromise = feedbackModel2.find({}).sort({ createdAt: -1 }).exec();
    const feedbackPromise = feedbackModel.find({}).sort({ createdAt: -1 }).exec();
    // Wait for both promises to resolve
    const [feedbackStatus, feedback] = await Promise.all([feedbackStatusPromise, feedbackPromise]);
    // Combine the results
    const allFeedback = { feedbackStatus, feedback };
    const totalResult = feedbackStatus.length + feedback.length;

    const workbook = new Excel.Workbook();
    const sheet1 = workbook.addWorksheet('Sheet1');
    const sheet2 = workbook.addWorksheet('Sheet2');
    const row1 = sheet1.addRow(`TOTAL RESULT: ${totalResult}`);
    const rowTitle = sheet1.addRow(["#", "ID", "RATING STAR", "FEEDBACK", "CONTENT", "IS_PROCESSED", "PROCESS_DATETIME", "DATETIME CREATED"]);
    rowTitle.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00FF00' }, // Light blue color for the header row
      };
    });

    feedbackStatus.forEach((item, index) => {
      const rowItem1 = sheet1.addRow([index + 1, item.id, item.star,
      Array.isArray(item.experience) ? item.experience.join(', ').replace(/[\[\]"]/g, '') : null,
      item.content, item.isprocess, item.processcreateAt ? item.processcreateAt.toLocaleString() : null, item.createdAt ? item.createdAt.toLocaleString() : null]);
      if (item.isprocess) {
        rowItem1.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ADD8E6' }, // Green color for the row
          };
        });
      }
    });
    const rowTitle2 = sheet2.addRow(["#", "ID", "RATING STAR", "FEEDBACK", "CONTENT", "IS_PROCESSED", "PROCESS_DATETIME", "DATETIME CREATED"]);
    rowTitle2.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00FF00' }, // Light blue color for the header row
      };
    });

    feedback.forEach((item, index) => {
      const rowItem2 = sheet2.addRow([index + 1, item.id, item.star,
        Array.isArray(item.experience) ? item.experience.join(', ').replace(/[\[\]"]/g, '') : null, 
         item.content, item.isprocess, item.processcreateAt ? item.processcreateAt.toLocaleString() : '', item.createdAt ? item.createdAt.toLocaleString() : '']);

      if (item.isprocess) {
        rowItem2.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ADD8E6' }, // Green color for the row
          };
        });
      }
    });

    const formattedTimestamp = functions.getFormattedTimestamp();
    const randomString = functions.generateRandomString(3);
    const excelFileName = `feedback_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
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


  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve & export feedback data',
      totalResult: null,
      data: null,
    }
  );
  }
});





//LIST APP FEEDBACK WITH STATUS 
app.get('/list_feedback_status', async (req, res) => {
  feedbackModel2.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred " });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list feedback with status fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list feedback with status success", "totalResult": data.length, "data": data });
        }
      }
    });
});
app.delete('/delete_feedback_status/:id', async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const result = await feedbackModel2.findByIdAndDelete(feedbackId).exec();

    if (result) {
      res.send({ "status": true, "message": "Feedback deleted successfully", "deletedId": feedbackId });
    } else {
      res.status(404).send({ "status": false, "message": "Feedback not found", "deletedId": feedbackId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ "status": false, "message": "An error occurred while deleting the feedback", "deletedId": feedbackId });
  }
});


//CREATE APP FEEDBACK WITH STATUS
app.post('/create_feedback_status', async (req, res) => {
  const id_string = generateId(8);
  try {
    let feedback = new feedbackModel2({
      "id": id_string,
      "driver": req.body.driver,
      "star": req.body.star,
      "content": req.body.content,
      "experience": req.body.experience,
      "createdAt": req.body.createdAt,
      "isprocess": req.body.isprocess,
      "processcreateAt": req.body.processcreateAt
    });
    feedbackModel2.findOne({ id: feedback.id }, async function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        if (data != null) {
          res.send({ "status": false, "message": "fail create feedback", "data": null });
        } else {
          feedback.save(function (err, data) {
            if (err) {
              console.log(err)
            } else {
              console.log(err)
            }
          });
          res.send({ "status": true, "message": 'Created feedback, Thank You. ! ', "data": feedback });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: `error ${message} ${error}` });
  }
});

// UPDATE FEEDBACK (isprocess and processcreateAt)
app.post('/update_feedback_status', async (req, res) => {
  try {
    const existingFeedback = await feedbackModel2.findOne({ id: req.body.id });
    if (!existingFeedback) {
      return res.status(404).send({ "status": false, "message": "Feedback not found", "data": null });
    }
    if (req.body.isprocess !== undefined) {
      existingFeedback.isprocess = req.body.isprocess;
    }
    existingFeedback.processcreateAt = new Date();
    // Save the updated feedback
    await existingFeedback.save();

    return res.send({ "status": true, "message": 'Feedback was comfirmed successfully!', "data": existingFeedback });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ "status": false, "message": "Internal Server Error", "data": null });
  }
});

function generateId(length) {
  const id = crypto.randomBytes(length).toString('hex');
  return typeof id === 'string' ? id : '';
}





















app.post('/get_trip_by_id', async (req, res) => {
  try {
    const objectIdString = req.body.objectId; // Get the ObjectId string from the request body

    // Use mongoose.Types.ObjectId to convert the string into an ObjectId
    const objectId = mongoose.Types.ObjectId(objectIdString);

    // Find the tripData by its ObjectId
    tripModel.findById(objectId, (err, tripData) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: `Error finding tripData: ${err}` });
      } else {
        if (!tripData) {
          res.status(404).json({ message: 'No tripData found with the specified ObjectId' });
        } else {
          res.status(200).json({ message: 'Found tripData', data: tripData });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error}` });
  }
});








app.get('/list_token', async (req, res) => {
  tokenModel.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).send({ "status": false, "message": "An error occurred" });
      } else {
        if (data == null || data.length == 0) {
          res.send({ "status": false, "message": "find list tokens fail", "totalResult": null, "data": data });
        } else {
          res.send({ "status": true, "message": "find list tokens success", "totalResult": data.length, "data": data });
        }
      }
    });
});


// POST API to add a new token
app.post('/add_token', async (req, res) => {
  const { value, name } = req.body;

  if (!value || !name) {
    return res.status(400).json({ "status": false, "message": "Both 'value' and 'name' are required fields." });
  }

  // Check for duplicate token
  const existingToken = await tokenModel.findOne({ value });
  if (existingToken) {
    return res.status(409).json({ "status": false, "message": "Token with the provided 'value' already exists." });
  }

  const newToken = new tokenModel({ value, name });

  try {
    const savedToken = await newToken.save();
    res.status(201).json({ "status": true, "message": "Token added successfully", "data": savedToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "status": false, "message": "Failed to add token", "error": error.message });
  }
});










//EXPORT FEEDBACK
app.get('/export_feedback_all', async (req, res) => {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.addRow(["#", "ID", "RATING STAR", "CONTENT", "FEEDBACK", "DATETIME", "IS_PROCESSED", "PROCRESS DATETIME"]);
  try {
    const data = await feedbackModel2.find();
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No feedback found',
        totalResult: 0,
        data: null,
      });
    }

    data.forEach((item, index) => {
      sheet.addRow([index + 1, item.id, item.star, item.content, item.experience, item.createdAt.toLocaleString(), item.isprocess, item.processcreateAt.toLocaleString()]);
    });
    const formattedTimestamp = functions.getFormattedTimestamp();
    const randomString = functions.generateRandomString(3);
    const excelFileName = `feedback_history_${formattedTimestamp}_${randomString}.xlsx`; // Generate a unique file name
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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve & export feedback data',
      totalResult: null,
      data: null,
    });
  }
});

//DOWNLOAD FEEDBACK
app.get('/download_excel/:fileName', (req, res) => {
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