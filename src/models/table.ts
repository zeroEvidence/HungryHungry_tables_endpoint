import { model, Model, Schema } from "mongoose";
import { ITableDocument } from "./interfaces/tableDocument.interface";
import timestamp = require("mongoose-timestamp");

export class Table {
  private _model: Model<ITableDocument>;

  constructor() {
    const tableSchema = new Schema({
      room: {
        type: String,
        required: true,
      },
      tableID: {
        type: String,
        required: true,
      },
      tableName: {
        type: String,
        required: true,
      },
      visible: {
        type: Number,
        required: true,
      },
      QRCodePath: {
        type: String,
        required: true,
      },
    });

    tableSchema.plugin(timestamp);

    this._model = model<ITableDocument>("Tables", tableSchema);
  }

  public get model(): Model<ITableDocument> {
    return this._model;
  }
}
