const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak
} = require("docx");
const fs = require("fs");
const path = require("path");

const exportProjectToDocx = async (projectData) => {
  // The 'pg' driver automatically parses JSONB columns into objects.
  // If it's a string for some reason, we parse it. If it's an object, we use it directly.
  const parsedContent = typeof projectData.generated_content === 'string'
    ? JSON.parse(projectData.generated_content)
    : projectData.generated_content;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24 // = 12pt
          },
        },
      },
    },
  });

  // Helpers
  const heading = (text) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    });

  const bodyText = (text) =>
    new Paragraph({
      children: [new TextRun({ text })],
      alignment: AlignmentType.JUSTIFIED,
    });

  doc.addSection({
    children: [
      // Capa
      heading(projectData.university),
      heading(projectData.topic),
      new Paragraph(""),
      heading(`Aluno: ${projectData.student_name}`),
      heading(`Professor: ${projectData.professor_name}`),
      heading(`${projectData.created_at.toISOString().split("T")[0]}`),
      new Paragraph({ children: [new PageBreak()] }),

      // Índice (manual for now)
      heading("Índice"),
      bodyText("1. Introdução\n2. Desenvolvimento\n3. Conclusão\n4. Referências"),
      new Paragraph({ children: [new PageBreak()] }),

      // Introdução
      heading("1. Introdução"),
      bodyText(parsedContent.introducao),

      // Desenvolvimento
      heading("2. Desenvolvimento"),
      bodyText(parsedContent.desenvolvimento),

      // Conclusão
      heading("3. Conclusão"),
      bodyText(parsedContent.conclusao),

      // Referências
      heading("4. Referências"),
      ...parsedContent.referencias.map(ref => bodyText(ref)),
    ],
  });

  // Save .docx file
  const fileName = `${projectData.topic.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.docx`;
  const filePath = path.join(__dirname, `../exports/${fileName}`);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

module.exports = {
  exportProjectToDocx,
};
