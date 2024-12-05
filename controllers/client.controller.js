import {deleteClient, getClientById, upadateClientData, updateCoachId,} from "../services/client.service.js";
import fs from "fs";
import {checkCoachStatus, findAllCoachesVerfied, findCoachByNomPrenomContain} from "../services/coach.service.js";

export const getLoggedClient= async (req, res) => {
    const userId=req.userId;
    const user=await getClientById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json(user);

}


export const updateClient = async (req, res) => {
    const userId = req.userId;
    const user = await getClientById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const defaultPhotoPath = "uploads/photo-du-profile.png"// Path to the default photo

    try {
        if (req.body.photo) {
            const photo = req.body.photo;
            if (!photo.startsWith("data:")) {
                return res.status(400).json({ error: "Invalid Profile Photo file provided." });
            }

            const base64Image = Buffer.from(photo.split(",")[1], 'base64');
            const photoPath = `uploads/${Date.now()}-photo_${userId}.png`;
            fs.writeFileSync(photoPath, base64Image);

            if (user.photo && user.photo !== defaultPhotoPath && fs.existsSync(user.photo)) {
                fs.unlinkSync(user.photo);
            }

            req.body.photo = photoPath;
        } else {
            req.body.photo = user.photo;
        }

        const updatedClient = await upadateClientData(user.id, req.body);
        return res.status(200).json(updatedClient);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
};

export const deleteLoggedInClient=async (req,res)=>{
    const userId=req.userId;
    const user=await getClientById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    try {
        const deletedClient = await deleteClient(user.id);
        return res.status(200).json("deleted Client");
    }catch (error) {
        return res.status(500).json({message: error.message});
    }
}
export const getAllCoachs=async (req,res)=>{
    try {
        const coachs = await findAllCoachesVerfied();
        return res.status(200).json(coachs);
    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message});
    }
}
export const followCoach=async (req,res)=>{
    const coachId=parseInt(req.params.coachId)
    const userId=req.userId;
    try{
        if(!await checkCoachStatus(coachId)) {
            return res.status(400).json({message: "Coach not verified"});
        }
        const updatedClient=await updateCoachId(userId,coachId);

        return res.status(200).json("follow Sent to coach");
    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message});
    }
}
export const findClientById=async (req,res)=>{
    const {id}=req.params;

    try {
        const client=await getClientById(parseInt(id));
        if (!client || !client.client){
            return res.status(404).json({message:"Client not found"});
        }
        return res.status(200).json(client);
    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message});
    }
}
export const searchCoach=async (req,res)=>{
    const {search}=req.query;
    console.log(search)
    try {
        const clients=await findCoachByNomPrenomContain(search);
        if(!clients){
            return res.status(404).json({message:"No clients found"});
        }
        return res.status(200).json(clients);
    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message});
    }
}