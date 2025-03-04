import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        // console.log(user)
        const accessToken=user.generateAccessToken()
        // console.log(accessToken)
        const refreshToken=user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        
        console.log("done")
        return {accessToken, refreshToken}
    } catch (error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async (req,res)=>{

    const {fullName, email, password,role } = req.body;

    if(
        [fullName, email, password, role].some((field)=>field?.trim()=="")
    ){
        throw new ApiError(400,"All fields is required")
    }


    const existedUser= await User.findOne({email})

    if(existedUser){
        throw new ApiError(409, "User with email already exists")

    }

    const {phone} = req.body;
    
    const user = await User.create({
        fullName,
        email,
        password,
        role,
        phone
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
} )

const loginUser = asyncHandler( async (req,res)=>{
    const {email, password} = req.body;

    if(!email){
        throw new ApiError(400, "Email is required ")
    }
    
    const user =  await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordValid= await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    // console.log(req)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {
                
            },
            "User logged out Successfully"
        )
    )
})

const refreshAccessToken= asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken!== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {newAccessToken, newRefreshToken}=await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {newAccessToken, refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
}