import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import _ from 'lodash';
import { TEST_IMAGE } from './fixture';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const GPT_4o = 'gpt-4o';
const GPT3 = 'gpt-3.5-turbo';
const openai = new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const getChatGPTResponse = async (model, messages) => {
    if (_.isEmpty(messages)) {
        return null;
    }
    const completion = await openai.chat.completions.create({
        model,
        messages,
    });
    return completion.choices[0];
};
app.post('/gpt4o/chatCompletion', async (req, res) => {
    const { content } = req.body;
    try {
        const response = await getChatGPTResponse(GPT_4o, content);
        res.send(response);
    }
    catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error getting chat completion from chatGPT');
    }
});
app.post('/gpt3/chatCompletion', async (req, res) => {
    const { content } = req.body;
    try {
        const response = await getChatGPTResponse(GPT3, content);
        res.send(response);
    }
    catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error getting chat completion from chatGPT');
    }
});
app.post('/gpt4o/images', async (req, res) => {
    // const { images } = req.body;
    const images = [TEST_IMAGE];
    const imagesContent = images.map((i) => {
        return {
            type: "image_url",
            image_url: {
                "url": `data:image/jpeg;base64,${i}`
            }
        };
    });
    if (images.length > 4) {
        throw new Error("Cannot process more than 4 images");
    }
    try {
        const body = {
            model: GPT_4o,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Rate these pictures from 0.0-10.0 in the context of dating profile pictures" },
                        ...imagesContent
                    ]
                }
            ]
        };
        const completion = await openai.chat.completions.create(body);
        res.send(completion.choices[0]);
    }
    catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error getting chat completion from chatGPT');
    }
});
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map