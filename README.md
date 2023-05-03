# Talkgpt-be
TalkGPT backend service

Frontend: https://github.com/nambk314/talkgpt-ui

To run locally:

Before running you will need to get OpenAI API key https://platform.openai.com/account/api-keys

You will also need a google application credentials as well as your google project ID for text-to-speech 
https://cloud.google.com/docs/authentication/application-default-credentials

and set these env variable in your .bash or .zshrc

```export OPENAI_ORG_ID="your-org"
export OPENAI_API_KEY="your-api-key"

export GOOGLE_TTS_PROJECT_ID="your-gg-project"
export GOOGLE_APPLICATION_CREDENTIALS="your-gg-credential"
```

After that run:

`npm i`

`npm run start:watch`

Server will be run @ localhost:3030
