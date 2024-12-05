import prisma from "../connexion.js";


export const saveProgramme= async (programme)=>{
    const { nom, addedBy, addedFor, exercices } = programme;

    try {
        // Start a transaction to ensure all operations succeed or fail together
        return await prisma.$transaction(async (prisma) => {
            // Step 1: Create the program
            const createdProgramme = await prisma.programe.create({
                data: {
                    nom,
                    addedBy,
                    addedFor,
                },
            });

            // Step 2: Link the exercises to the program
            if (exercices && exercices.length > 0) {
                const exerciceProgrameData = exercices.map((exerciceId) => ({
                    exerciceId,
                    programmeId: createdProgramme.id,
                }));

                await prisma.exercicePrograme.createMany({
                    data: exerciceProgrameData,
                });
            }

            return createdProgramme;
        });
    } catch (error) {
        console.error("Error saving programme:", error);
        throw error;
    }
};
export const getProgrammeById = async (id) => {
    return prisma.programe.findUnique({
        where: {
            id,
        },
        include: {
            exercicePrograme: {
                include: {
                    exercice:{
                        include:{
                            category:true
                        }
                    } , // Include related exercises
                },
            },
            addedByUser: {
                include: {
                    coach: true,
                    roles:true// Include related Coach data
                },
            },
            addedForUser: {
                include: {
                    client: true,
                    roles:true// Include related Client data
                },
            }, // Include user for whom the program was added
        },
    });
};
export const getProgrammesByClient = async (clientId) => {
    return prisma.programe.findMany({
        where: {
            addedFor: clientId,
        },
        include: {
            exercicePrograme: {
                include: {
                    exercice: {
                        include: {
                            category: true,
                        }
                    }, // Include related exercises
                },
            },
            addedByUser: {
                include: {
                    coach: true,
                    roles:true// Include related Coach data
                },
            },
        },
    });
};

export const addExercicesToProgrammes = async (programmeId, exercices) => {
    try {
        return await prisma.$transaction(async (prisma) => {
            const exerciceProgrameData = exercices.map((exerciceId) => ({
                exerciceId,
                programmeId,
            }));

            await prisma.exercicePrograme.createMany({
                data: exerciceProgrameData,
            });

            return true;
        });
    } catch (error) {
        console.error("Error adding exercises to programme:", error);
        throw error;
    }
}
export const deleteExerciceFromProgramme = async (programmeId, exerciceId) => {
    try {
        return await prisma.exercicePrograme.deleteMany({
            where: {
                programmeId,
                exerciceId,
            },
        });
    } catch (error) {
        console.error("Error removing exercise from programme:", error);
        throw error;
    }
}
export const completeExercice = async (programmeId, exerciceId) => {
    return prisma.$transaction([
        prisma.exercicePrograme.update({
            where: {
                exerciceId_programmeId:{
                    exerciceId,
                    programmeId
                }
            },
            data: {
                completed: true,
            },
        }),
        prisma.programe.update({
            where: {
                id: programmeId,
            },
            data: {
                terminer: {
                    increment: 1, // Increment the `terminer` field by 1
                },
            },
        }),
    ]);
};

export const decompleteExercice = async (programmeId, exerciceId) => {
    return prisma.$transaction([
        prisma.exercicePrograme.update({
            where: {
                exerciceId_programmeId:{
                    exerciceId,
                    programmeId
                }
            },
            data: {
                completed: false,
            },
        }),
        prisma.programe.update({
            where: {
                id: programmeId,
            },
            data: {
                terminer: {
                    decrement: 1, // Increment the `terminer` field by 1
                },
            },
        }),
    ]);
};