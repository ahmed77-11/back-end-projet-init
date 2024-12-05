import prisma from "../connexion.js";
export const saveExercice = async (exercice, user, category) => {
    return prisma.exercice.create({
        data: {
            nom: exercice.nom, // Replace `nom` with the field name for the exercise's name
            description: exercice.description,
            diffuculte: exercice.difficulty,
            repetion: exercice.repetion, // Ensure the field matches your schema
            image: exercice.image,
            video: exercice.video,
            categoryId: category.id, // Link by category ID
            addedBy: user.id, // Link by user ID
        },
        include: {
            category: true,
            addedByUser: true,
        },
    });
};


export const updateExerciceById=async (id,exercice)=>{
    return prisma.exercice.update({
        where:{
            id
        },
        data:{
            nom: exercice.nom, // Replace `nom` with the field name for the exercise's name
            description: exercice.description,
            diffuculte: exercice.difficulty,
            repetion: parseInt( exercice.repetion), // Ensure the field matches your schema
            image: exercice.image,
            video: exercice.video,
            categoryId: parseInt(exercice.categoryId), // Link by category ID
            addedBy:exercice.addedBy, // Link by user ID
        },
        include: {
            category: true,
            addedByUser: true,
        },
    })
}

export const getExercices=async ()=>{
    return prisma.exercice.findMany({
        include:{
            addedByUser:true,
            category:true
        }
    })
}
export const getExerciceById=async (id)=>{
    return prisma.exercice.findUnique({
        where:{
            id,
        },
        include:{
            addedByUser:true,
            category:true
        }
    })
}
export const deleteExerciceById=async (id)=>{
    return prisma.exercice.delete({
        where:{
            id
        }
    })
}

export const findAllExercicesByAddedByUser=async (userId)=>{
    return prisma.exercice.findMany({
        where:{
            addedBy:userId
        },
        include:{
            category:true,
            addedByUser:true
        }
    })
};