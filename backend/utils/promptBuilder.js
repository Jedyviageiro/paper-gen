const fs = require('fs');
const path = require('path');

const buildPrompt = (data) => {
  const promptTemplate = fs.readFileSync(path.join(__dirname, '../config/promptTemplate.txt'), 'utf-8');

  let prompt = promptTemplate;
  for (const key in data) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    prompt = prompt.replace(placeholder, data[key]);
  }

  return prompt;
};

module.exports = { buildPrompt };
