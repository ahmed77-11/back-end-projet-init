import prisma from "../connexion.js"
import {VerificationStatus} from "@prisma/client";

export const getCoachById = async (id) => {
    return prisma.user.findUnique({
        where: { id: id },
        include: {
            coach: true,
        }
    });
}
export const updateCoachData=async (id, coach) => {
    console.log(coach)
    return prisma.user.update({
        where:{id:id},
        data:{
            nom:coach.nom,
            prenom:coach.prenom,
            email:coach.email,
            photo:coach.photo,
            coach:{
                update:{
                    cv:coach.cv,
                    diplome:coach.diplome,
                    description:coach.description,
                }
            }
        },
        include:{
            coach:true
        }
    })
}
export const deleteCoach=async (id)=>{
    await prisma.coach.delete({
        where:{userId:id}
    });
    return prisma.user.delete({
        where:{id:id}
    });
}
export const findAllCoaches=async ()=>{
    return prisma.user.findMany({
        where:{roles:{
                some:{role:"COACH"}
            }
        },
        include:{
            coach:true,
        }
    })
}
export const findAllCoachesVerfied=async ()=>{
    return prisma.user.findMany({
        where:{roles:{
                some:{role:"COACH"}
            }, AND:{
                coach:{verified:"verified"}
            }
        },
        include:{
            coach:true,
        }
    })
}
export const findAllCoachesNotverfied=async ()=>{
    return prisma.user.findMany({
        where:{roles:{
                some:{role:"COACH"}
            }, AND:{
                coach:{verified:"pending"}
            }
        },
        include:{
            coach:true,
        }
    })
}
export const updateCoachStatus=async (id,status)=>{
    return prisma.user.update({
        where:{id:id},
        data:{
            coach:{
                update:{
                    verified:status?"verified":"rejected"
                }
            }
        },
        include:{
            coach:true
        }
    })
}
export const checkCoachStatus = async (id) => {
    const verifStatus = await prisma.coach.findUnique({
        where: { id: id },
        select: {
            verified: true, // Only fetch the `verified` field
        },
    });

    return verifStatus.verified ==="verified";

};
export const findFollowPending = async (id) => {
    const clients = await prisma.client.findMany({
        where: {
            coachId: id,
            status: "pending", // Assuming this is valid
        },
        include: {
            user: true, // Fetch the associated user details
        },
    });

    return clients.map(client => ({
        ...client.user,
        client: {
            id: client.id,
            adr: client.adr,
            pods: client.pods,
            taille: client.taille,
            coachId: client.coachId,
            status: client.status,
        },
    }));
};

export const findFollowAccepted = async (id) => {
    const clients = await prisma.client.findMany({
        where: {
            coachId: id,
            status: "accepted", // Assuming this is valid
        },
        include: {
            user: true, // Fetch the associated user details
        },
    });

    return clients.map(client => ({
        ...client.user,
        client: {
            id: client.id,
            adr: client.adr,
            pods: client.pods,
            taille: client.taille,
            coachId: client.coachId,
            status: client.status,
        },
    }));
};

export const findCoachByNomPrenomContain=async (search)=>{
    return prisma.user.findMany({
        where:{
            roles:{
                some:{role:"COACH"},
            },
            coach: {
                verified: "verified", // Filtering the `coach` relation
            },
            OR:[
                {nom:{contains:search}},
                {prenom:{contains:search}}
            ]
        },
        include:{
            coach:true
        }
    })
}