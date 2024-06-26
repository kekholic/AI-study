import 'dotenv/config'
import OpenAI from 'openai'

const openAI = new OpenAI()

const results = await openAI.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content:
        'You are an AI assistant, answer any questions to the best of your ability.',
    },
    {
      role: 'user',
      content: 'Hi!',
    },
  ],
})

console.log(results.choices[0])
