import { openAI } from './openai.js'
import math from 'advanced-calculator'
const QUESTION = process.argv[2] || 'hi'

const messages = [
  {
    role: 'user',
    content: QUESTION,
  },
]

const functions = {
  calculate({ expression }) {
    return math.evaluate(expression)
  },
  async generateImage({prompt}) {
    const result =  await openAI.images.generate({prompt})
    console.log(result)
    return result.data[0].url
  }
}

const getComplition = (messages) => {
  return openAI.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0,
    functions: [
      {
        name: 'calculate',
        description: 'Run a math expression',
        parameters: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description:
                'Then math expression to evaluate like "2 * 3 + (21 / 2) ^ 2"',
            },
          },
          required: ['expression'],
        },
      },
      {
        name: 'generateImage',
        description: 'Create or generate image based on the description',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description:
                'The description of the image to generate',
            },
          },
          required: ['prompt'],
        },
      },
    ],
  })
}

let response
while (true) {
  response = await getComplition(messages)

  if (response.choices[0].finish_reason === 'stop') {
    console.log(response.choices[0].message.content)
    break
  } else if (response.choices[0].finish_reason === 'function_call') {
    const fName = response.choices[0].message.function_call.name
    const args = response.choices[0].message.function_call.arguments

    const fnToCall = functions[fName]
    const params = JSON.parse(args)

    const result = fnToCall(params)

    messages.push({
      role: 'assistant',
      content: null,
      function_call: {
        name: fName,
        arguments: args,
      },
    })

    messages.push({
      role: 'function',
      name: fName,
      content: JSON.stringify({ result }),
    })
  }
}
