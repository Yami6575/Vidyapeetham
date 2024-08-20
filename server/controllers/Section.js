const Section=require("../models/Section")
const Course=require("../models/Course")

exports.createSection=async(req,res)=>{
    try{
        const {sectionName,courseId}=req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        const newSection=await Section.create({sectionName});

        const updateCourse=await Course.findIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
                {new:true},

            
        )
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();


    res.status(200).json({
        success: true,
        message: "Section created successfully",
        updatedCourse,
    });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to create section"
        })

    }
}
exports.updateSection=async (req,res)=>{
    try{
        const {sectionName,sectionId}=req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        } 
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully"
        })


    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update section,please try again",
            error:err.message
        })
    }
}
exports.deleteSection=async(req,res)=>{
    try{
        const {sectionId}=req.params;
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section,please try again",
            error:error.message
        })
    }
}