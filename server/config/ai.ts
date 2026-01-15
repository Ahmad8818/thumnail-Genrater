import {GoogleGenAI} from '@google/genai'

const ai = new GoogleGenAI({
    apiKey:process.env.GEMNI_API_KEY as string
})
export default ai


