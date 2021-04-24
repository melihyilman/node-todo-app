const status= require('./TaskStatus');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let todoScheme = new Schema(
  {
    name: {
      type: String
    },
    status: {
      type: Number,
      enum: Object.values(status), 
       default: status.toDo, required: true
    },
  },
);

module.exports = mongoose.model("todos", todoScheme);