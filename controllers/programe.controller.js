import {getClientById} from "../services/client.service.js";
import {
    addExercicesToProgrammes, completeExercice, decompleteExercice, deleteExerciceFromProgramme,
    getProgrammeById,
    getProgrammesByClient,
    saveProgramme
} from "../services/programe.service.js";

export const addPrograme= async (req,res)=>{
    const userId=req.userId;
    const clientId=parseInt(req.params.id);
    const {nom,exercices}=req.body;
    try{
        const client=await getClientById(clientId);
        if(!client){
            return res.status(404).json({message:"Client not found"});
        }
        const programme=await saveProgramme({nom,addedBy:userId,addedFor:clientId,exercices});
        res.status(201).json(programme);
    }catch (e) {
        console.log(e)
        res.status(500).json({message: "Error adding programme to client"});
    }

}
export const findProgrammeById=async (req,res)=>{
    const programmeId=parseInt(req.params.id);
    try{
        const programme=await getProgrammeById(programmeId);
        if(!programme){
            return res.status(404).json({message:"Programme not found"});
        }
        return res.status(200).json(programme);
    }catch (e) {
        console.log(e)
        res.status(500).json({message: "Error getting programme"});
    }
}
export const findProgrammesByClient = async (req, res) => {
    try {
        console.log('Request params:', req.params); // Debugging: Check what is being passed

        const clientId = parseInt(req.params.clientId); // Access clientId from req.params
        if (isNaN(clientId)) {
            return res.status(400).json({ message: "Invalid client ID" }); // Handle invalid ID
        }

        const client = await getClientById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const programmes = await getProgrammesByClient(clientId);
        return res.status(200).json(programmes);
    } catch (e) {
        console.error("Error in findProgrammesByClient:", e); // Improved error logging
        res.status(500).json({ message: "Error getting programmes" });
    }
};

export const updateExercicesInProgramme=async (req,res)=>{
    const programmeId=parseInt(req.params.id);
    const {exercices}=req.body;
    try {
        const programme = await getProgrammeById(programmeId);
        if (!programme) {
            return res.status(404).json({message: "Programme not found"});
        }
        const updatedProgramme = await addExercicesToProgrammes(programmeId, exercices);
        return res.status(200).json({updatedProgramme});
    }catch (e) {
        console.log(e)
        res.status(500).json({message: "Error updating programme"});
    }
}
export const removeExerciceFromProgramme=async (req,res)=>{
    const {exerciceId}=req.body;
    const programmeId=parseInt(req.params.id);
    try{
        const programme=await getProgrammeById(programmeId);
        if(!programme){
            return res.status(404).json({message:"Programme not found"});
        }
        const updatedProgramme=await deleteExerciceFromProgramme(programmeId,exerciceId);
        return res.status(200).json("exercice deleted");
    }catch (e){
        console.log(e)
        res.status(500).json({message: "Error removing exercice from programme"});
    }
}

export const completeAnExercice=async (req,res)=>{
    const {exerciceId}=req.body;
    const programmeId=parseInt(req.params.id);
    try{
        const programme=await getProgrammeById(programmeId);
        if(!programme){
            return res.status(404).json({message:"Programme not found"});
        }
        const updatedProgramme=await completeExercice(programmeId,exerciceId);
        return res.status(200).json("exercice completed");

    }catch (e) {
        console.log(e)
        res.status(500).json({message: "Error completing exercice"});

    }
}
export const uncompleteExercice=async (req,res)=>{
    const {exerciceId}=req.body;
    const programmeId=parseInt(req.params.id);
    try{
        const programme=await getProgrammeById(programmeId);
        if(!programme){
            return res.status(404).json({message:"Programme not found"});
        }
        const updatedProgramme=await decompleteExercice(programmeId,exerciceId);
        return res.status(200).json("exercice uncompleted");

    }catch (e) {
        console.log(e)
        res.status(500).json({message: "Error uncompleting exercice"});

    }
}