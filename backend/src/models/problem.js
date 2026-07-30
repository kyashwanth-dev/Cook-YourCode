const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true, trim: true },
    output: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      index: true,
    },
    statement: { type: String, required: true, trim: true },
    constraints: { type: String, required: true, trim: true },
    sampleTestCases: { type: [testCaseSchema], default: [] },
    hiddenTestCases: { type: [testCaseSchema], default: [], select: false },
  },
  { timestamps: true },
);

problemSchema.methods.toPublicProblem = function toPublicProblem() {
  return {
    id: this._id,
    title: this.title,
    difficulty: this.difficulty,
    statement: this.statement,
    constraints: this.constraints,
    sampleTestCases: this.sampleTestCases,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Problem', problemSchema);
