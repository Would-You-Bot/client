import { usedQuestionModel } from "../Models/usedModel";

export async function markQuestionAsUsed(guildID: number, question: string, type: string) {
    const validTypes = ["truth", "dare", "wwyd", "wyr", "nhie"];

    if (!validTypes.includes(type.toLowerCase())) {
        throw new Error("Invalid question type");
    }

    try {
        let questionDoc = await usedQuestionModel.findOneAndUpdate(
            { 
                guildID, 
                [`${type}Questions`]: { $ne: question } // Check for non-existence 
            },
            { $push: { [`${type}Questions`]: question } },
            { new: true, upsert: true }
        );

        return questionDoc;
    } catch (error) {
        return true;
        console.error("Error marking question as used:", error);
    }
}