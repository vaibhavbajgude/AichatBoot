import express from "express";
import { config } from "dotenv";
import cors from "cors"
import OpenAI from 'openai';
config();

const app = express();
const PORT = 3000 || process.env.PORT;
app.use(cors({
    origin:["http://localhost:5173","*"],
    credentials:true,
    methods:["GET","POST"]
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY,
});
console.log(process.env.API_KEY)
app.get("/health", (req, res) => {
    try {
        return res.json({ data: null, message: "server running helthy." });
    } catch (error) {
        return res.json({ data: null, message: error.message || "something went wrong" });
    }
})

app.post("/askai", async (req, res) => {
    try {
        let { question } = req.body;
        if (!question) {
            return res.json({ data: null, message: "please ask a question" });
        }


            const completion = await openai.chat.completions.create({
                model: "mistralai/ministral-3b",
                messages: [
                    {
                        "role": "user",
                        "content": question 
                    }
                ]
            });

            let ans =  completion.choices[0].message;
            return res.json({data:ans,message:"ans load successfully"})

    } catch (error) {
       console.log(error)
    }
})






app.listen(PORT, () => {
    console.log(`server is running on the port ${PORT}`);
})