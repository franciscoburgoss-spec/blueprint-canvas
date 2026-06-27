import type { Project } from '../types';

// ============================================
// EXPORTACIÓN A MARKDOWN
// ============================================

export const exportToMarkdown = (project: Project): string => {
  let content = `# ${project.name}\n\n`;
  content += `**Informe de Revisión Técnica**\n\n`;
  content += `Generado el ${new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}\n\n`;
  content += `---\n\n`;

  // Estadísticas
  const totalDocs = project.documents.length;
  const totalObs = project.documents.reduce((sum, doc) => sum + doc.observations.length, 0);
  const approvedObs = project.documents.reduce((sum, doc) => 
    sum + doc.observations.filter(o => o.status === 'aprobada').length, 0
  );
  const pendingObs = project.documents.reduce((sum, doc) => 
    sum + doc.observations.filter(o => o.status === 'pendiente').length, 0
  );
  const rejectedObs = project.documents.reduce((sum, doc) => 
    sum + doc.observations.filter(o => o.status === 'rechazada').length, 0
  );

  content += `## Resumen\n\n`;
  content += `- **Documentos:** ${totalDocs}\n`;
  content += `- **Observaciones totales:** ${totalObs}\n`;
  content += `  - Aprobadas: ${approvedObs}\n`;
  content += `  - Pendientes: ${pendingObs}\n`;
  content += `  - Rechazadas: ${rejectedObs}\n\n`;
  content += `---\n\n`;

  // Contenido por documento
  project.documents.forEach((doc) => {
    if (doc.observations.length === 0) return;

    content += `## ${doc.name} - ${doc.discipline}\n\n`;

    // Agrupar por tipo
    const grouped = {
      'Coherencia Global': doc.observations.filter(o => o.type === 'Coherencia Global' && o.status === 'aprobada'),
      'Coherencia Interna': doc.observations.filter(o => o.type === 'Coherencia Interna' && o.status === 'aprobada'),
      'Observación Propia': doc.observations.filter(o => o.type === 'Observación Propia' && o.status === 'aprobada'),
    };

    Object.entries(grouped).forEach(([type, obs]) => {
      if (obs.length === 0) return;

      content += `### ${type}\n\n`;

      obs.forEach((o) => {
        content += `#### ${o.id}\n\n`;
        content += `${o.text}\n\n`;
        content += `**Fuente:** ${o.source}\n\n`;
        
        if (o.tags && o.tags.length > 0) {
          content += `**Etiquetas:** ${o.tags.join(', ')}\n\n`;
        }
        
        if (o.priority) {
          content += `**Prioridad:** ${o.priority}\n\n`;
        }

        if (o.comments && o.comments.length > 0) {
          content += `**Comentarios:**\n`;
          o.comments.forEach(c => {
            content += `- ${c.text}\n`;
          });
          content += `\n`;
        }

        content += `---\n\n`;
      });
    });

    // Notas del documento
    if (doc.notes && doc.notes.length > 0) {
      content += `### Notas\n\n`;
      doc.notes.forEach(note => {
        content += `- ${note.text}\n`;
      });
      content += `\n`;
    }
  });

  return content;
};

// ============================================
// EXPORTACIÓN A JSON
// ============================================

export const exportToJSON = (project: Project): string => {
  return JSON.stringify(project, null, 2);
};

// ============================================
// DESCARGA DE ARCHIVOS
// ============================================

export const downloadFile = (
  content: string,
  fileName: string,
  mimeType: string
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
