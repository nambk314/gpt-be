import express from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import cors from 'cors';
import bodyParser from 'body-parser';

import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai';
import _ from 'lodash';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GG text to speech config
const client = new TextToSpeechClient({
    projectId: process.env.GOOGLE_TTS_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// OPEN AI config
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get('/synthesize-speech', async (req, res) => {
    const { text, voice, audioConfig, ssmlGender, languageName } = req.query;
    const request = {
      input: { text },
      voice: { name: languageName, languageCode: voice || 'en-US', ssmlGender: ssmlGender || 'MALE' },
      audioConfig: { audioEncoding: audioConfig || 'MP3' },
    };
    try {
      const [response] = await client.synthesizeSpeech(request);
      const { audioContent } = response;
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioContent);
    } catch (err) {
      console.error('ERROR:', err);
      res.status(500).send('Error generating audio');
    }
});

const getChatGPTResponse = async (
  content: ChatCompletionRequestMessage[]
): Promise<CreateChatCompletionResponse | null> => {
  if (_.isEmpty(content)) {
    return null;
  }
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: content,
  });

  return completion.data;
};

app.post('/gpt/chatCompletion', async (req, res) => {
  const { content } = req.body;
  try {
    const response = await getChatGPTResponse(content);
    res.send(response);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).send('Error getting chat completion from chatGPT');
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});