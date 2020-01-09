import { createQuestion } from "./question.api";

export const createTestQuestion = async (text: string, popularity: number, category: string) => {
    const params = {
        text: text,
        popularity: popularity,
        category: category
    };
    const { data } = await createQuestion(params);
    return data.data.createQuestion;
};
