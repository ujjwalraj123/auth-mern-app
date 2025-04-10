const TaskModel = require('../Models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    const newTask = new TaskModel({ title, description, user: userId });
    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      success: true,
      task: newTask
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, user: userId },
      { title, description },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found", success: false });

    res.status(200).json({ message: "Task updated", success: true, task });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await TaskModel.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found", success: false });

    res.status(200).json({ message: "Task deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const markTaskAsDone = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, user: userId },
      { status: true },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found", success: false });

    res.status(200).json({ message: "Task marked as done", success: true, task });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ✅ NEW: Get tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      message: "Tasks fetched successfully",
      success: true,
      tasks
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
  getTasks, // ✅ Make sure it's exported
};
