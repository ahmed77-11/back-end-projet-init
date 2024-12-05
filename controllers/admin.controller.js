import {findAllCoachesNotverfied, getCoachById, updateCoachStatus} from "../services/coach.service.js";


export const getNotVerifiedCoaches = async (req, res) => {
    try {
        const coaches = await findAllCoachesNotverfied();
        return res.status(200).json(coaches);
    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message});
    }
};
export const verifierCoach = async (req, res) => {
    const coachId = parseInt(req.params.id);

    try{
        const coach=await getCoachById(coachId);
        if (!coach){
            return res.status(404).json({message:"Coach not found"});
        }
        const updatedCoach=await updateCoachStatus(coachId,true);
        return res.status(200).json(updatedCoach);
    }catch (e) {
        console.log(e)
        return res.status(500).json({message:e.message});
    }

};
export const rejectCoach = async (req, res) => {
    const coachId = parseInt(req.params.id);

    try{
        const coach=await getCoachById(coachId);
        console.log(coach)
        if (!coach){
            return res.status(404).json({message:"Coach not found"});
        }
        const updatedCoach=await updateCoachStatus(coachId,false);
        return res.status(200).json(updatedCoach);
    }catch (e) {
        console.log(e)
        return res.status(500).json({message:e.message});
    }

};