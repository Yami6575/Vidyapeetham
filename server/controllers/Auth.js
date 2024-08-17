
const User=require("../models/User");
const OTP=require("../models/OTP");

exports.sendOTP=async (req,res)=>{
    try{
        const {email}=req.body;
        const checkUserPresent=await User.findOne({email});
        
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered'
            })
        }
        var otp=otpGenerator.generate(6,{
            upparCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log(otp);
        let result=await OTP.findOne({otp:otp});
        while(result){
            otp=otpGenerator(6,{
                upparCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,

            })
        }
        const otpPayload={email,otp};
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success:true,
            message:"otp successfully sent",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}
exports.signUp=async(req,res)=>{
    

}