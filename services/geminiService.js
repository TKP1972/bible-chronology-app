

import { GoogleGenAI } from "@google/genai";

// Store the instances globally within the module
let ai = null;
let chat = null;
let currentApiKey = null;

/**
 * Lazily initializes and returns the GoogleGenAI instance based on the key
 * stored in localStorage. Throws an error if the API key is not available.
 * This function also handles re-initialization if the API key changes.
 */
const getAiInstance = () => {
    const storedApiKey = localStorage.getItem('gemini_api_key');

    if (!storedApiKey) {
        throw new Error("Gemini API Key not set. Please add your key in the 'Reference & AI' tab to use AI features.");
    }

    // If the key has changed or if there's no AI instance, create a new one.
    if (storedApiKey !== currentApiKey || !ai) {
        console.log("Initializing or re-initializing Gemini AI instance.");
        currentApiKey = storedApiKey;
        ai = new GoogleGenAI({ apiKey: currentApiKey });
        chat = null; // IMPORTANT: Reset the chat session when the AI instance changes
    }

    return ai;
};

export const generateAnalysis = async (chronologyText) => {
    const prompt = `
        Based on the following timeline of biblical and historical events, provide a high-level summary and analysis. 
        **Please format your entire response using simple Markdown.** Use headings (e.g., '## Title'), bold text (e.g., '**key point**'), and lists (e.g., '* item 1').

        Structure your response into these logical sections:
        - The Patriarchal Age: From Adam to Joseph.
        - Exodus and Conquest: The era of Moses and Joshua.
        - The United and Divided Kingdom: The period of the kings like David, Solomon, and their successors.
        - Exile and Return: The Babylonian captivity and the subsequent rebuilding.
        - The Intertestamental and Roman Period: The time leading up to the Common Era.
        - The Life of Jesus: From his birth and ministry to his death and resurrection.
        - The Apostolic Age: The founding of the Christian congregation and the ministries of the apostles.
        - Post-Apostolic, Middle Ages, & Reformation: Key events following the death of the apostles up to the 1700s.
        - Bible Societies & Rediscovery of Bible Truth: The period from the late 18th century to the early 20th century.
        - The Kingdom is in Place: Key events from 1914 to the present day.

        In your analysis, focus on the major turning points, key figures, and the overarching narrative presented by this chronological data. Keep the tone scholarly and informative.

        Here is the data:
        ---
        ${chronologyText}
        ---
    `;

    try {
        const genAI = getAiInstance();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for analysis:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get analysis from Gemini API: ${error.message}`);
        }
        throw new Error("Failed to get analysis from Gemini API.");
    }
};

const initializeChat = (chronologyContext) => {
    const systemInstruction = `You are a factual and objective research assistant. Your sole purpose is to answer questions based on the provided chronological data and knowledge of the Holy Scriptures consistent with that data.

**Core Instructions:**
1.  **Persona & Tone:** Your tone must be neutral, scholarly, and direct. You are a tool for providing information. **Crucially, do not impersonate a member of any religious group.** Avoid using personal pronouns like 'we,' 'our,' or phrases like 'as we believe.' Stick to reporting the facts as presented in the provided context.
2.  **Vocabulary:** For consistency with the source material, you MUST use the specific terminology present in the provided chronology. This includes terms such as "Jehovah," "Hebrew Scriptures," "Christian Greek Scriptures," "anointed," "the great crowd," "Memorial," and "Kingdom Hall."
3.  **Primary Source & Citation:** For any question involving a date, age, or a specific historical event, the provided chronological data is your **absolute and only source of truth.** You MUST cite the reference that appears after the colon on the corresponding line in the data. For example, if the data says '1916, October 31, Russell dies (age 64): yb16 175; jv 63-64; sh 354', your answer must include that exact reference, like this: '(See yb16 175; jv 63-64; sh 354.)'. If a line has no reference, provide no citation.
4.  **Prioritizing Updated Beliefs:** The provided context includes a section titled 'Beliefs Clarified'. If a question touches upon a topic covered in this section, your answer **must** reflect the most recent clarification listed. For instance, the understanding of 'this generation' (Matthew 24:34) was updated in 1995. Your answer should present this latest view as the definitive one according to the provided data and cite its reference.
5.  **Reign Durations:** **Do not calculate reign durations by simply subtracting start and end dates.** This method is often inaccurate due to historical practices like accession years and coregencies. If asked for a reign's length, state the start and end years as recorded in the data. If the source text provides an explicit duration (like "for six years"), prioritize that information.
6.  **General Scriptural Knowledge:** For questions about biblical concepts not tied to a specific date in the data, base your answers on the New World Translation of the Holy Scriptures (2013 Edition), maintaining the same objective tone.
7.  **Synthesize Answers:** If a question requires both a date and a scriptural concept, present the fact from the chronological data first (with its citation), and then provide any relevant scriptural context.
8.  **Handling Unknowns:** If the information is not found in the provided chronological data, state clearly that the information is not available in the provided timeline.
9.  **Formatting:** Use simple Markdown (bolding, lists) to improve clarity.
10. **Further Research:** To aid the user, you may suggest further research at the Watchtower ONLINE LIBRARY by providing the link: https://wol.jw.org. This should be a general recommendation, separate from the direct, line-item citations.`;

    const genAI = getAiInstance();
    chat = genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
        history: [
            {
                role: "user",
                parts: [{ text: `Here is the chronological data table I will be asking questions about. Please use this as context for all my future questions:\n\n${chronologyContext}` }],
            },
            {
                role: "model",
                parts: [{ text: "I have received and understood the chronological data. I will function as an objective research assistant, using the provided data as the primary source for all event-specific questions and citing references as instructed. I am ready for your questions." }],
            }
        ],
    });
};

export const generateQueryResponse = async (
    query, 
    chronologyContext
) => {

    try {
        // Always try to get the instance first to ensure the key is validated
        // and the instance is up to date.
        getAiInstance();
        
        if (!chat) {
            initializeChat(chronologyContext);
        }

        const response = await chat.sendMessage({ message: query });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for query:", error);
        chat = null; // Reset chat on error in case the session is corrupted
        if (error instanceof Error) {
             throw new Error(`Failed to get query response from Gemini API: ${error.message}`);
        }
        throw new Error("Failed to get query response from Gemini API.");
    }
};