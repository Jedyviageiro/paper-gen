function humanizeText(text) {
  return text
    .replace(/Além disso,/gi, "Pra completar,")
    .replace(/Portanto,/gi, "Então, pra resumir,")
    .replace(/Este trabalho tem como objetivo/gi, "A ideia desse projeto é")
    .replace(/Em conclusão,/gi, "Pra fechar a ideia,")
    .replace(/\butilizado\b/gi, "usado")
    .replace(/\bserá\b/gi, "vai ser");
}

module.exports = {
  humanizeText,
};
