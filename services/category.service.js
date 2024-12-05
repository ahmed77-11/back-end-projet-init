import prisma from "../connexion.js";


export const findAllCategories=()=>{
    return prisma.category.findMany({});
}
export const findCategoryById=(id)=>{
    return prisma.category.findUnique({
        where:{
            id
        }
    })
}