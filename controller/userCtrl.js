const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwtToken");
// const httpStatus = require("http-status");
// const { generateToken } = require("../config/refreshtoken");

// REGISTER
const createUser = async (req, res) => {

  try {
    bcrypt.hash(req.body.password, 5, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        let existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
          return res.status(400).json({ message: "User Already Exists, Try Login!" })
        } else {
          const newUser = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: hash,
          })
          await newUser.save()
          return res.status(201).json({ message: "New User Added", user: newUser })
        }
      }
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: `Registration Error: - ${e}` })
  }


  // try{
  //   const email = req.body.email;
  //   const findUser = await User.find({ email});
  //   if(findUser){
  //     return res.status(404).json({message: "User already exist"});
  //   }
  //   const newUser = new User ({email: req.body.email,
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     mobile: req.body.mobile
  //   });
  // }catch(error){

  // }
};

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exist or not
  const findUser = await User.findOne({ email });
  // const userUnblock = await User.isBlocked
  if (findUser && await findUser.isPasswordMatched(password)) {
    // const refreshToken = await generateToken(findUser?.id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findUser.id,{
    //     refreshToken: refreshToken,
    //   },
    //   {
    //     new: true,
    //   }
    // )
    res.json({
      message: "User login successfully.",
      success: true,
      body: {
        _id: findUser?._id,
        name: findUser?.name,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      }
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//Get all user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get user by id
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const getUserById = await User.findById(id);
    res.json({
      getUserById,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});


const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked"
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Unblocked"
    });
  } catch (error) {
    throw new Error(error);
  }
});

// const updatePassword = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { password } = req.body;
//   validateMongoDbId(_id);
//   const user = await User.findById(_id);
//   if (password) {
//     user.password = password;
//     const updatedPassword = await user.save();
//     res.json(updatedPassword);
//   } else {
//     res.json(user);
//   }
// });

// Get user by id

module.exports = { createUser, loginUserCtrl, getAllUser, getUserById, deleteUser, updatedUser, blockUser, unblockUser };