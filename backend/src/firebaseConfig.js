var admin = require("firebase-admin");
  
//firebase app
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
    }),
    storageBucket:'gs://bookstore-5e70b.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = { bucket };