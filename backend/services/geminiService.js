const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generatePaper = async (prompt) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        // Tell Gemini to output JSON
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Resposta bruta da Gemini:", text); // log para verificar

        if (!text || text.length < 10) {
            console.error("Resposta da Gemini muito curta ou vazia:", text);
            throw new Error('Texto gerado é muito curto ou vazio.');
        }

        return text; // RETORNA TEXTO PURO — sem JSON.parse()
    } catch (err) {
        console.error('Erro ao gerar ou interpretar resposta da Gemini:', err);
        throw new Error('Falha ao gerar conteúdo da IA.');
    }
};

module.exports = generatePaper;
