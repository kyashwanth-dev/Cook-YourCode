const mongoose = require('mongoose');
const Problem = require('../models/problem');

const isValidProblemId = (id) => mongoose.isValidObjectId(id);
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const listProblems = async (_req, res, next) => {
  try {
    const problems = await Problem.find({}, 'title difficulty').sort({ createdAt: -1 });
    res.json(
      problems.map((problem) => ({
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
      })),
    );
  } catch (error) {
    next(error);
  }
};

const getProblem = async (req, res, next) => {
  try {
    if (!isValidProblemId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid problem id' });
    }

    const problem = await Problem.findOne({ _id: toObjectId(req.params.id) });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    return res.json(problem.toPublicProblem());
  } catch (error) {
    return next(error);
  }
};

const upsertProblem = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      difficulty: req.body.difficulty,
      statement: req.body.statement,
      constraints: req.body.constraints,
      sampleTestCases: req.body.sampleTestCases || [],
      hiddenTestCases: req.body.hiddenTestCases || [],
    };

    if (req.params.id && !isValidProblemId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid problem id' });
    }

    if (req.params.id) {
      const problem = await Problem.findOne({ _id: toObjectId(req.params.id) });

      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      Object.assign(problem, payload);
      await problem.save();
      return res.json(problem.toPublicProblem());
    }

    const problem = await Problem.create(payload);
    return res.status(201).json(problem.toPublicProblem());
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProblems,
  getProblem,
  upsertProblem,
};
