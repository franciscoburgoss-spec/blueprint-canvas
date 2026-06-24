export const exportToMarkdown = (project) => {
  let markdown = `# PROYECTO: ${project.name}\n\n`;
  markdown += `**Fecha de generación:** ${new Date().toLocaleDateString()}\n\n`;
  
  project.documents.forEach(doc => {
    markdown += `## DOCUMENTO: ${doc.name}\n`;
    markdown += `**Disciplina:** ${doc.discipline}\n\n`;
    
    const approvedObs = doc.observations.filter(obs => obs.status === 'aprobada');
    
    if (approvedObs.length > 0) {
      // Coherencia Global
      const globalObs = approvedObs.filter(obs => obs.type === 'Coherencia Global');
      if (globalObs.length > 0) {
        markdown += `### [COHERENCIA GLOBAL]\n\n`;
        globalObs.forEach(obs => {
          markdown += `**${obs.id}**\n`;
          markdown += `- **Texto:** ${obs.text}\n`;
          markdown += `- **Fuente:** ${obs.source}\n`;
          if (obs.tags.length > 0) {
            markdown += `- **Etiquetas:** ${obs.tags.join(', ')}\n`;
          }
          if (obs.priority !== 'media') {
            markdown += `- **Prioridad:** ${obs.priority}\n`;
          }
          markdown += '\n';
        });
      }
      
      // Coherencia Interna
      const internalObs = approvedObs.filter(obs => obs.type === 'Coherencia Interna');
      if (internalObs.length > 0) {
        markdown += `### [COHERENCIA INTERNA]\n\n`;
        internalObs.forEach(obs => {
          markdown += `**${obs.id}**\n`;
          markdown += `- **Texto:** ${obs.text}\n`;
          markdown += `- **Fuente:** ${obs.source}\n`;
          if (obs.tags.length > 0) {
            markdown += `- **Etiquetas:** ${obs.tags.join(', ')}\n`;
          }
          if (obs.priority !== 'media') {
            markdown += `- **Prioridad:** ${obs.priority}\n`;
          }
          markdown += '\n';
        });
      }
      
      // Observaciones Propias
      const ownObs = approvedObs.filter(obs => obs.type === 'Observación Propia');
      if (ownObs.length > 0) {
        markdown += `### [OBSERVACIONES PROPIAS]\n\n`;
        ownObs.forEach(obs => {
          markdown += `**${obs.id}**\n`;
          markdown += `- **Texto:** ${obs.text}\n`;
          markdown += `- **Fuente:** ${obs.source}\n`;
          if (obs.tags.length > 0) {
            markdown += `- **Etiquetas:** ${obs.tags.join(', ')}\n`;
          }
          if (obs.priority !== 'media') {
            markdown += `- **Prioridad:** ${obs.priority}\n`;
          }
          markdown += '\n';
        });
      }
    } else {
      markdown += `*Sin observaciones aprobadas*\n\n`;
    }
    
    // Notas
    if (doc.notes.length > 0) {
      markdown += `### NOTAS\n\n`;
      doc.notes.forEach(note => {
        markdown += `- ${note.text}\n`;
      });
      markdown += '\n';
    }
  });
  
  return markdown;
};

export const exportToJSON = (project) => {
  return JSON.stringify(project, null, 2);
};

export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
