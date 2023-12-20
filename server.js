import mongoose from 'mongoose';

import app from "./app.js";

// xyTonLUkvRKvGWDp

const DB_HOST = "mongodb+srv://Som:xyTonLUkvRKvGWDp@cluster0.cgah7bk.mongodb.net/my-contacts?retryWrites=true&w=majority"
mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful")
})
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })

