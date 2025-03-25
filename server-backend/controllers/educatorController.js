import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js ';
import {v2 as cloudinary} from 'cloudinary'


//update role to educator
export const updateRoleToEducator = async (req,res)=>{
  try {

    console.log("Request Auth Data:", req.auth); // Debugging line
    if (!req.auth || !req.auth.userId) {
      return res.status(400).json({ success: false, message: "A valid resource ID is required." });
    }


    const userId = req.auth.userId

    await clerkClient.users.updateUserMetadata(userId,{
      publicMetadata:{
        role:'educator',
      }
    })
    res.json({success:true,message:'You can a publish course now'})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

// Add New Course
export const addCourse = async (req,res)=>{
  try {
    const {courseData} = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId

    // Validate if image is attached
    if(!imageFile)
    {
      return res.json({success:false,message:'Thumbnail Not Attached'})
    }
    const parsedCourseData = await JSON.parse(courseData)
    parsedCourseData.educator = educatorId
    const newCourse = await Course.create(parsedCourseData)
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url
    await newCourse.save()

    res.json({success:true,message:'Course Added'})

  } catch (error) {
    res.json({success:false,message:error.message})
  }
}






