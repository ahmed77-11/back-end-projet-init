import {
    deleteExerciceById, findAllExercicesByAddedByUser,
    getExerciceById,
    getExercices,
    saveExercice,
    updateExerciceById
} from "../services/exercice.service.js";
import fs from "fs";
import {findAllCategories, findCategoryById} from "../services/category.service.js";
import {getUserById} from "../services/auth.service.js";

export const addExercice = async (req, res) => {
    const userId=req.userId;
    try{
        console.log(req.body)
        const user=await getUserById(userId)
        if(!user){
            return res.status(404).json("no user found")
        }
        const category=await findCategoryById(req.body.category);
        if(!category){
            return res.status(404).json("no category found")
        }
        const photo=req.body.image;
        if (!photo.startsWith("data:")) {
            return res.status(400).json({ error: "Invalid Profile Photo file provided." });
        }
        const base64Image = Buffer.from(photo.split(",")[1], 'base64');
        const photoPath = `uploads/${Date.now()}-exercicephoto_${userId}.png`;
        fs.writeFileSync(photoPath, base64Image);

        req.body.image = photoPath;
        console.log(photoPath)

        const exercice = await saveExercice(req.body,user,category)
        return res.status(200).json(exercice);
    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});

    }
};

export const getAllexercices = async (req, res) => {
    try{
        const exercices = await getExercices()
        if(!exercices){
            return res.status(404).json({message: "No exercices found"});
        }
        return res.status(200).json(exercices);

    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}
export const updateExercice=async (req,res)=>{
    const userId=req.userId;
    const exerciceId=parseInt(req.params.id);
    try{
        const exercice=await getExerciceById(exerciceId);
        if(req.body.image){
            const photo=req.body.image;
            if (!photo.startsWith("data:")) {
                return res.status(400).json({ error: "Invalid Profile Photo file provided." });
            }
            const base64Image = Buffer.from(photo.split(",")[1], 'base64');
            const photoPath = `uploads/${Date.now()}-exercicephoto_${userId}.png`;
            fs.writeFileSync(photoPath, base64Image);
            if (exercice.image && fs.existsSync(exercice.image)) {
                fs.unlinkSync(exercice.image);
            }

            req.body.image = photoPath;
        }else {
            req.body.image=exercice.image;
        }
        const updatedExercice=await updateExerciceById(exerciceId,req.body);
        return res.status(200).json(updatedExercice);

    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}
export const deleteExercice=async (req,res)=>{
    const exerciceId=parseInt(req.params.id);
    try{
        const exercice=await getExerciceById(exerciceId);
        if(!exercice){
            return res.status(404).json({message: "Exercice not found"});
        }
        if (exercice.image && fs.existsSync(exercice.image)) {
            fs.unlinkSync(exercice.image);
        }

        await deleteExerciceById(exerciceId);
        return res.status(200).json("Exercice deleted");

    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}
export const getExercice=async (req,res)=>{
    const exerciceId=parseInt(req.params.id);
    try{
        const exercice=await getExerciceById(exerciceId);
        if(!exercice){
            return res.status(404).json({message: "Exercice not found"});
        }
        return res.status(200).json(exercice);

    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}
export const getAllCategories=async (req,res)=>{
    try {
        const catgories=await findAllCategories();
        return  res.status(200).json(catgories)

    }catch (e){
        console.log(e)
        return res.status(500).json({message:e.message || "there is an error"})
    }
}

export const getExercicesByAddedByUser= async (req,res)=>{
    const userId=req.userId;
    try{
        const exercices=await findAllExercicesByAddedByUser(userId);
        if(!exercices){
            return res.status(404).json({message: "No exercices found"});
        }
        return res.status(200).json(exercices);
    }catch (e){
        console.log(e)
        return res.status(500).json({message: e.message});
    }
}