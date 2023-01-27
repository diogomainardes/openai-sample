import { Configuration } from "openai";
import { CreateCompletionRequest, OpenAIApi } from "openai/dist/api";
import { OPENAI_APIKEY, OPENAI_ORGANIZATION_ID } from "./config";
import { CSVToJson } from "./util";

const config = new Configuration({
  organization: OPENAI_ORGANIZATION_ID,
  apiKey: OPENAI_APIKEY
});

const openai = new OpenAIApi(config);

(async () => {
    
    const baseQuestion: string = `[@nome] está viajando para [@cidade]. Poderia citar 3 lugares para visitar? Seja direto.`;

    const dados = await CSVToJson('./src/dados-clientes.csv');

    for(let pessoa of dados) {
      
      const question = baseQuestion.replace('[@nome]', pessoa.Nome).replace('[@cidade]', pessoa.Cidade).trim();

      const requestBody: CreateCompletionRequest = {
        prompt: question,
        model: 'text-davinci-003',
        max_tokens: 1000,
        temperature: 0
      }

      const response = await openai.createCompletion(requestBody);

      const data = response.data;

      if (data.choices) {
        console.log('-'.repeat(60))
        console.log(`Para ${pessoa.Nome} o ChatGPT sugeriu os seguintes locais na cidade de ${pessoa.Cidade} escreveu isso:\n ${ JSON.stringify(data.choices[0].text?.replace(/(\r\n|\n|\r)/gm, "  ")) }`);
        console.log('-'.repeat(60))
      }
    }
})();



