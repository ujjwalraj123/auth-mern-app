const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

// Add these new controller functions at the bottom before module.exports

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({
            message: "Account deleted successfully",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const changeUsername = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newName } = req.body;
        
        if (!newName) {
            return res.status(400).json({
                message: "New name is required",
                success: false
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name: newName },
            { new: true }
        );

        res.status(200).json({
            message: "Username updated successfully",
            success: true,
            newName: updatedUser.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Update exports
module.exports = {
    signup,
    login,
    deleteAccount,
    changeUsername
}