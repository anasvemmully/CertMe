const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Status = new Schema(
  {
    userid: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    status: [
      {
        type: Object,
      },
    ],
    fields: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Status", Status);
