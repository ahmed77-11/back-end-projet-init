import {
    deleteCoach,
    findAllCoaches,
    findFollowPending,
    getCoachById,
    updateCoachData
} from "../services/coach.service.js";
import fs from "fs";
import {updateClientStatus} from "../services/client.service.js";

export const getLoggedCoach=async (req,res)=>{
    const userId=req.userId;
    console.log(userId)
    const user=await getCoachById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json(user);
}

export const findCoachById=async (req,res)=>{
    const coachId=parseInt(req.params.id);
    try {


        const coach = await getCoachById(coachId);
        if (!coach) {
            return res.status(404).json({message: "Coach not found"});
        }
        return res.status(200).json(coach);
    }catch (e) {
        return res.status(500).json({message: e.message});
    }
}

export const updateCoach = async (req, res) => {
    const userId = req.userId;
    const user = await getCoachById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const defaultPhotoPath = "uploads/photo-du-profile.png"

    try {
        const handleFileUpdate = (newFile, oldFile, fileType, userId) => {
            if (newFile) {
                if (!newFile.startsWith("data:")) {
                    throw new Error(`Invalid ${fileType} file provided.`);
                }

                const base64Data = Buffer.from(newFile.split(",")[1], 'base64');
                const newPath = `uploads/${Date.now()}-${fileType}_${userId}.${fileType === 'photo' ? 'png' : 'pdf'}`;
                fs.writeFileSync(newPath, base64Data);

                if (
                    oldFile &&
                    fileType === 'photo' &&
                    oldFile !== defaultPhotoPath &&
                    fs.existsSync(oldFile)
                ) {
                    fs.unlinkSync(oldFile);
                }

                return newPath;
            }
            return oldFile;
        };

        // Update files
        req.body.photo = handleFileUpdate(req.body.photo, user.photo, "photo", userId);
        req.body.cv = handleFileUpdate(req.body.cv, user.cv, "cv", userId);
        req.body.diplome = handleFileUpdate(req.body.diplome, user.diplome, "diplome", userId);

        // Update user data
        const updatedCoach = await updateCoachData(user.id, req.body);
        return res.status(200).json(updatedCoach);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};


export const deleteLoggedInCoach=async (req,res)=>{
    const userId=req.userId;
    const user=await getCoachById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    try {
        const deletedCoach = await deleteCoach(user.id);
        return res.status(200).json("deleted Coach");
    }catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllCoaches=async (req,res)=>{
    try{
        const coaches=await findAllCoaches();
        return res.status(200).json(coaches);
    }catch (error) {
        return res.status(500).json({message: error.message});
    }
}
export const acceptClient=async (req,res)=>{
    const clientId=parseInt(req.params.clientId);
    try {
        const updatedClient=await updateClientStatus(clientId,true);
        return res.status(200).json("Client accepted");
    }catch (e) {
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}

export const rejectClient=async (req,res)=>{
    const clientId=parseInt(req.params.clientId);
    try {
        const updatedClient=await updateClientStatus(clientId,false);

        return res.status(200).json("Client rejected");
    }catch (e) {
        return res.status(500).json({message: e.message});
    }
}
export const getClientPending=async (req,res)=>{
    const userId=req.userId;
    try {
        const coach = await getCoachById(userId);
        if (!coach) {
            return res.status(404).json({message: "Coach not found"});
        }
        const clients=await findFollowPending(coach.coach.id);
        console.log(clients)

        return res.status(200).json(clients);
    }catch (e) {
        return res.status(500).json({message: e.message});
    }
}