
const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

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
    try{
        const {
            firstName,
            lastName,
            email,
             password,
             confirmPassword,
             accountType,
             contactNumber,
             otp
        }=req.body;
        if(!firstName||!lastName||!email||!password||!confirmPassword||!contackNumber||!otp){
            return res.status(403).json({
                success:false,
                message:"All field are required"
            });
        }
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and Confirm Password are not matching,please try again'
            });
        }
        const existingUser=await User.fineOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered'
            }); 
        }
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp!=recentOtp){
            return res.status(400).json({
                success:false,
                message:"invalid otp"
            })
        }
    
        const hashedPassword=await bcrypt.hash(password,10);
    
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })
        const user= await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    
    
        })
        return res.status(200).json({
            success:true,
            message:"user is registered successbully",
            user
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered,please try again"
        })

    }
}
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"all fields are required,please try again "
            })
        }
        const user=await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,sign up first"
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                role:user.role,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })

            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+3*24*60*60*100)
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:   "password is incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json(
            {
                success:false,
                message:"login failed please try again"
            }
        )

    }

}
exports.changePassword=async(req,res)=>{

}