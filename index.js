const { exec } = require('child_process');
const axios = require('axios');

async function callOllama(prompt) {
    return new Promise((resolve, reject) => {
        exec(`ollama run llama2 "${prompt}"`, (error, stdout, stderr) => {
            console.log('Prompt enviado para o Ollama:', prompt);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            if (error) {
                console.error(`Erro ao chamar Ollama: ${error.message}`);
                reject(`Erro ao chamar Ollama: ${error.message}`);
            } else if (stderr) {
                console.error(`Erro no processamento do Ollama: ${stderr}`);
                reject(`Erro no processamento do Ollama: ${stderr}`);
            } else if (!stdout || stdout.trim() === "") {
                console.error('Ollama não retornou uma resposta válida.');
                reject('Ollama não retornou uma resposta válida.');
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

//funções

async function getBooks() {
    console.log("Buscando informações sobre livros...");
    const response = await axios.get('https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&format=json&jscmd=data');
    return response.data;
}

async function getMovies() {
    console.log("Buscando informações sobre filmes...");
    const response = await axios.get('http://www.https://www.omdbapi.com/?i=tt3896198&apikey=5d79603f');
    return response.data;
}

async function getMusic() {
    console.log("Buscando informações sobre músicas...");
    const response = await axios.get('https://api.lyrics.ovh/v1/Coldplay/Yellow');
    return response.data;
}

async function processUserInput(userInput) {
    console.log(`Processando a entrada do usuário: "${userInput}"`);
    try {
        const ollamaResponse = await callOllama(userInput);
        console.log("Resposta da IA:", ollamaResponse);

        if (ollamaResponse.includes('livro')) {
            return await getBooks();
        } else if (ollamaResponse.includes('filme')) {
            return await getMovies();
        } else if (ollamaResponse.includes('música')) {
            return await getMusic();
        } else {
            throw new Error('IA não conseguiu processar a solicitação.');
        }
    } catch (error) {
        throw new Error(`Erro no processamento da IA: ${error.message}`);
    }
}

// Função principal
async function main(userInput) {
    console.log("Iniciando o programa...");
    try {
        const result = await processUserInput(userInput);
        console.log('Resultado:', result);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Testando 
main('Me diga algo sobre livros.');
main('Eu gostaria de saber sobre filmes.');
main('Quais são as músicas populares?');

// Teste 
main('Me fale sobre culinária.');
