var admin = require("firebase-admin");


var serviceAccount = require("./toiletapp-dc08e-firebase-adminsdk-j73bq-96ad1df87c.json");
const databaseURL ='https://console.firebase.google.com/u/0/project/toiletapp-dc08e/database/toiletapp-dc08e-default-rtdb/data/';


const admin_role =  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
})
  
module.exports  = {
    admin_role:admin_role
}