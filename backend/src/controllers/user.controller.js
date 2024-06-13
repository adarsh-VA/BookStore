const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await user.generateAuthToken();

        const currentUser = await User.findById(user._id).select("-password");

        return res
        .status(200)
        .json({ currentUser,token });
        // .cookie("accessToken", token, { secure: true})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, is_admin=false} = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ name, email, password, gender, is_admin});
        const user = await newUser.save();

        const token = await user.generateAuthToken();

        return res
        .status(200)
        .json({ user,token });
        // .cookie("accessToken", token, { secure: true})
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, gender, is_admin=true} = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ name, email, password, gender, is_admin});
        const user = await newUser.save();

        const token = await user.generateAuthToken();

        return res
        .status(200)
        .json({ user, token });
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    return res
    // .clearCookie('accessToken')
    .json({ message: 'Logout successful' });
}

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({data: req.user})
}

const testUser = async(req,res) => {
    return res.
    status(200)
    .json({ message: 'user route successfull' });
}

module.exports = {
    loginUser,
    registerUser,
    registerAdmin,
    logoutUser,
    getCurrentUser,
    testUser
}