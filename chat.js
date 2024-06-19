import { openAI } from "./openai.js";
import readline from 'node:readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const newMessage = async (history, message) => {
    const results = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...history, message],
        temperature: 0
    })

    return results.choices[0].message
}

const formatsMessage = (userInput) => ({role: 'user', content: userInput})

const chat = () => {
    const history = [
        {
            role: 'system',
            content: 'You are AI assistant. Answer questions or else'
        }
    ]

    const start = () => {
        rl.question('You: ', async (userInput) => {
            if (userInput.toLocaleLowerCase() === 'exit') {
                rl.close();
                return;
            }

            const message = formatsMessage(userInput);
            const response = await newMessage(history, message)

            history.push(message, response)
            console.log(`\n\nAI: ${response.content}\n\n`)
            start()

        })
    }

    start()
}

console.log('Chatbot initialized. Input "exit" to end the chat.')
chat()