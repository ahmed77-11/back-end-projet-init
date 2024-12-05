import prisma from "../connexion.js";
import {InvitationStatus} from "@prisma/client";

export const getClientById = async (id) => {
    return prisma.user.findUnique({
        where: { id: id },
        include: {
            client: true
        }
    });
};

export const upadateClientData = async (id, client) => {
    return prisma.user.update({
        where: { id: id },
        data: {
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            photo: client.photo,
            client: {
                update: {
                    adr: client.adr,
                    pods: parseInt(client.pods),
                    taille: parseInt(client.taille)
                }
            }
        },
        include: {
            client: true
        }
    });
}
export const deleteClient = async (id) => {
    await prisma.client.delete({
        where: { userId: id }
    });
    return prisma.user.delete({
        where: { id: id }
    });
}

export const updateCoachId=async (userId, coachId) => {
    return prisma.client.update({
        where:{userId:userId},
        data:{
            coachId:coachId
        }
    })
}

export const updateClientStatus = async (id, status) => {
    const client = await prisma.client.findUnique({
        where: { userId: id },
    });

    if (!client) {
        throw new Error(`Client with userId ${id} not found`);
    }

    return prisma.client.update({
        where: { userId: id },
        data: {
            status: status ? "accepted" : "rejected", // Use the exact enum string
        },
    });
};