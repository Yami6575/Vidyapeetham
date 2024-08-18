const User=require("../models/User");
const mailSender=require("../utils/mailSender");

exports.resetPasswordToken=async(req,res)=>{
    try{
        const email=req.body.email;
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:"your email is not register with us"
        })
    }
    const token=crypto.randomUUID();
    const updatedDetails=await User.findOneAndUpdate({email},{token:token,resetPasswordExpires:Date.now()+5*60*1000},new:true)//have to figure out whats the use of new
    await mailSender(email,"Password Reset link",`Password Reset link: ${url}`);
    return res.json({
        success:true,
        message:'Email sent successfully,please check email and change password'
    })
    const url=`http://localhost:3000/update-password/${token}`;
    return res.json({
        success:true,
        message:"Email sent successfully,please check email and change pwd"
    })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while reset'
        })
    }
    
}
exports.resetPassword= async (req,res)=>{
    const {password,confirmPassword,token}=req.body;
    if(password!=confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching"
        })
    }

}