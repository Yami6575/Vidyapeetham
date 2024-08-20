const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt")

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
    try{
        const {password,confirmPassword,token}=req.body;
    if(password!=confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching"
        })
    }
    const userDetails=await User.fineOne({token:token});
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        })
    }
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:'Token is expired,please regenerate your token  '
        })

    }
    const hashedPassword=await bcrypt.hash(password,10);
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true}
    )
    return res.status(200).json({
        success:true,
        message:'password reset successful'
    })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'did not work reset password'
        })

    }

}