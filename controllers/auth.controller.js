import {
    getUserByEmail,
    getUserByRoleAndEmail,
    getUserRoles,
    saveClient,
    saveCoach,
    updatePassword,
    updateUserStatus,
    updateVerifCode
} from "../services/auth.service.js"
import bcryptjs from "bcryptjs";
import {sendEmail, sendEmailResetPassword} from "../helpers/emailSender.js";
import jwt from "jsonwebtoken";
import fs from "fs"

const expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 10);

export const signUpClient = async (req, res) => {
    const { nom, prenom, email, password, passwordConfirm, adr, pods, taille } = req.body;

    try {
        // Check if the client already exists
        const clientExist = await getUserByEmail(email);
        if (clientExist) {
            return res.status(400).json({ message: "Client already exists" });
        }

        // Password confirmation check
        if (password !== passwordConfirm) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt); // Use async version of hash

        // Generate verification code
        const verifCode = Math.floor(100000 + Math.random() * 900000);

        // Save client with the hashed password and verification code
        const client = {
            nom,
            prenom,
            email,
            password: hashedPassword,
            adr,
            pods,
            taille,
            verifCode,
        };

        // Save client to the database
        const addedClient = await saveClient(client);

        // Send verification email
        await sendEmail(email, verifCode);

        // Remove password from the response
        const { password: pass, ...clientData } = addedClient;

        // Send response with client data
        return res.status(200).json(clientData);

    } catch (error) {
        console.error(error);
    }
};

export const signUpCoach = async (req, res) => {
    const {nom, prenom, email, password, passwordConfirm, description, cv, diplome} = req.body;
    console.log(password)
    try {
        // Check if the coach already exists by email
        const coachExist = await getUserByEmail(email);
        if (coachExist) {
            return res.status(400).json({error: "Coach already exists"});
        }

        // Validate that passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({error: "Passwords do not match"});
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Generate a verification code
        const verifCode = Math.floor(100000 + Math.random() * 900000);

        // Send verification email
        await sendEmail(email, verifCode);

        // Decode and save Base64-encoded CV
        if (!cv || !cv.startsWith("data:")) {
            return res.status(400).json({error: "Invalid CV file provided."});
        }
        const cvBuffer = Buffer.from(cv.split(",")[1], "base64");
        const cvPath = `uploads/${Date.now()}-cv.pdf`; // Adjust extension if required
        fs.writeFileSync(cvPath, cvBuffer); // Save CV file to the server

        // Decode and save Base64-encoded Diploma
        if (!diplome || !diplome.startsWith("data:")) {
            return res.status(400).json({error: "Invalid Diploma file provided."});
        }
        const diplomaBuffer = Buffer.from(diplome.split(",")[1], "base64");
        const diplomaPath = `uploads/${Date.now()}-diploma.pdf`; // Adjust extension if required
        fs.writeFileSync(diplomaPath, diplomaBuffer); // Save Diploma file to the server
        // Create coach object for saving to the database
        const coach = {
            nom,
            prenom,
            email,
            password: hashedPassword,
            cv: cvPath, // Store the CV file path
            diplome: diplomaPath,
            description,
            verifCode,
        };

        // Save the coach to the database
        const addedCoach = await saveCoach(coach);

        // Exclude the password and verification code from the response
        const {password: pass, verifCode: code, ...coachData} = addedCoach;

        // Respond with the newly created coach's data
        return res.status(201).json(coachData);
    } catch (error) {
        console.error("Error in signUpCoach:", error);
        return res.status(500).json({error: "An error occurred while registering the coach."});
    }
}

    export const verifyEmail=async (req,res)=>{
    let {code,email}=req.body;
    code=parseInt(code)
    try {
        const unverifiedUser = await getUserByEmail(email);
        console.log(unverifiedUser)
        if(!unverifiedUser) return res.status(500).json("User not found");
        if(unverifiedUser.verifCode!==code) return res.status(500).json("Invalid code");
        const updatedUser=await updateUserStatus(unverifiedUser.id);
        console.log(updatedUser.roles)
        const token=jwt.sign({id:updatedUser.id,roles:updatedUser.roles},process.env.JWT_SECRET);
        res.cookie("access_token",token,{httpOnly:true,expires:expireDate}).status(200).json("User verified");
    }catch (error){
        console.log(error);
        return res.status(500).json({error:error});
    }

}

export const signInAdmin=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const admin=await getUserByRoleAndEmail("admin",email);
        if(!admin) return res.status(404).json("Admin not found");
        if(!admin.enabled) return res.status(401).json("Client not verified");
        const validPassword=bcryptjs.compareSync(password,admin.password);
        if(!validPassword) return res.status(401).json("Wrong password");
        const token=jwt.sign({id:admin.id,roles:admin.roles},process.env.JWT_SECRET);
        const {password:pass,...rest}=admin;
        return res.cookie("access_token",token,{httpOnly:true,expires:expireDate}).status(200).json(rest);

    }catch (error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}
export const signInClient=async (req,res)=>{
    const {email,password}=req.body;
    console.log(password)
    try{
        const client=await getUserByRoleAndEmail("client",email);
        if(!client) return res.status(404).json("Client not found");
        if(!client.enabled) return res.status(401).json("Client not verified");
        const validPassword=bcryptjs.compareSync(password,client.password);
        if(!validPassword) return res.status(401).json("Wrong password");

        const token=jwt.sign({id:client.id,roles:client.roles},process.env.JWT_SECRET);
        const {password:pass,...rest}=client;
        return res.cookie("access_token",token,{httpOnly:true,expires:expireDate}).status(200).json(rest);

    }catch (error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}

export const signInCoach=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const coach=await getUserByRoleAndEmail("coach",email);
        if(!coach) return res.status(404).json("Coach not found");
        if(!coach.enabled) return res.status(401).json("Coach not verified");
        const validPassword=bcryptjs.compareSync(password,coach.password);
        if(!validPassword) return res.status(401).json("Wrong password");
        const token=jwt.sign({id:coach.id,roles:coach.roles},process.env.JWT_SECRET);
        const {password:pass,...rest}=coach;
        return res.cookie("access_token",token,{httpOnly:true,expires:expireDate}).status(200).json(rest);

    }catch (error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}

export const sentVerifCodeForForgatePassword=async (req,res)=>{
    const {email}=req.body;
    try{
        const verifCode=Math.floor(100000 + Math.random() * 900000);
        await sendEmailResetPassword(email, verifCode);
        const user=await getUserByEmail(email);
        await updateVerifCode(user.id,verifCode);
        return res.status(200).json("Verification code sent");
    }catch (error){

        console.log(error);
        return res.status(500).json({error:error});
    }
}
export const verifCodeForgotPassword=async (req,res)=>{
    const {email,code}=req.body;
    try{
        const user=await getUserByEmail(email);
        if(!user) return res.status(404).json("User not found");
        if(user.verifCode!==code) return res.status(401).json("Invalid code");
        return res.status(200).json("Code valid");
    }catch (error){
        console.log(error)
        return res.status(500).json({error:error});
    }
}
export const resetPassword=async (req,res)=>{
    const {email,password,confirmPassword}=req.body;
    try{
        const user=await getUserByRoleAndEmail("client",email)?await getUserByRoleAndEmail("client",email):await getUserByRoleAndEmail("coach",email);
        if (!user) return res.status(404).json("User not found");
        if(password!==confirmPassword) return res.status(401).json("Passwords do not match");
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hashSync(password, salt);
        const token=jwt.sign({id:user.id,roles:user.roles},process.env.JWT_SECRET);
        await updatePassword(user.id,hashedPassword);

        return res.cookie("access_token",token,{httpOnly:true,expires:expireDate}).status(200).json("Password updated");

    }catch (error){
        console.log(error);
        return res.status(500).json({error:error});
    }
}
export const authMiddleware=async (req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token) return res.status(401).json("Unauthorized");
    jwt.verify(token,process.env.JWT_SECRET,async (err, user) => {
        if (err) return res.status(401).json("Unauthorized");
        req.userId = user.id;
        if (!user.roles) {
            user.roles = await getUserRoles(user.id);
        }
        req.roles = user.roles;
        next();
    })
}
// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.roles[0].role)) {
//             return res.status(403).json("Forbidden");
//         }
//
//         next();
//     };
// };



export const signOut=async (req,res)=>{
    res.clearCookie("access_token");
    return res.status(200).json("Signed out");
}