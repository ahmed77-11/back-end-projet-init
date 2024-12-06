// Assuming these functions are defined as above
import prisma from "../connexion.js";
const getUserByEmail = async (email) => {
    return prisma.user.findFirst({
        where: { email: email },
        include: {
            roles: true, // Include roles
            client: true, // Include client-specific data, if it exists
            coach: true, // Include coach-specific data, if it exists
            admin: true, // Include admin-specific data, if it exists
        },
    });
};

export async function getUserById(id) {
    return prisma.user.findUnique({
        where: { id: id },
        include: {
            roles: true, // Include roles
            client: true, // Include client-specific data, if it exists
            coach: true, // Include coach-specific data, if it exists
            admin: true, // Include admin-specific data, if it exists
        },
    });
}

const getUserRoles=async (id)=>{
    const user=await getUserById(id);
    return user.roles;
}
const checkUserRole=(user,role)=>{
    return user.roles.some(r=>r.role===role);
}

const getUserByRoleAndEmail = async (role, email) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email,
            roles: {
                some: {
                    role: role.toUpperCase() // Ensure role is in uppercase to match the database
                }
            }
        },
        select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            photo: true,
            password: true,
            verifCode: true,
            enabled: true,
            roles: {
                select: {
                    role: true // Select the role name
                }
            },
            // Conditionally include related data based on role
            client: role === 'client' ? {
                select: {
                    adr: true,
                    pods: true,
                    taille: true,
                    coachId: true,
                    coach:true,
                    status: true,
                }
            } : false, // If not 'client', don't select this field

            coach: role === 'coach' ? {
                select: {
                    cv: true,
                    diplome: true,
                    description: true,
                    verified: true
                }
            } : false, // If not 'coach', don't select this field

            admin: role === 'admin' ? {
                select: {
                    id: true, // Add other admin-specific fields if needed
                }
            } : false, // If not 'admin', don't select this field
        },
    });

    return user || null; // Return null if no user is found
};





const saveClient = async (client) => {
    return prisma.user.create({
        data: {
            nom: client.nom,
            prenom: client.prenom,
            email: client.email, // Use `client.email` not `client.prenom`
            password: client.password,
            verifCode:client.verifCode,
            roles: {
                connect: { role: "CLIENT" }
            },
            client: {
                create: {
                    adr: client.adr,
                    pods: client.pods,
                    taille: client.taille
                }
            }
        },
        include: {
            client: true
        }
    });
};

const saveCoach = async (coach) => {
    return prisma.user.create({
        data: {
            nom: coach.nom,
            prenom: coach.prenom,
            email: coach.email, // Use `coach.email` not `coach.prenom`
            password: coach.password,
            verifCode:coach.verifCode,
            roles: {
                connect: { role: "COACH" }
            },
            coach: {
                create: {
                    cv: coach.cv,
                    diplome: coach.diplome,
                    description: coach.description
                }
            }
        },
        include: {
            coach: true
        }
    });
};

 const updateUserStatus=async (id)=>{
    return prisma.user.update({
        where: { id: id },
        data: { enabled: true },
    });
}
const updateVerifCode=async (id,code)=>{
    return prisma.user.update({
        where: { id: id },
        data: { verifCode: code },
    });
}
const updatePassword=async (id,password)=>{
    return prisma.user.update({
        where: { id: id },
        data: { password: password },
    });

}


// Export as named exports
export { getUserByEmail, saveClient, saveCoach,updateUserStatus,getUserByRoleAndEmail,updateVerifCode,updatePassword,getUserRoles };
