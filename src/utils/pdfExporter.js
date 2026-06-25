import { jsPDF } from 'jspdf';

export const exportToPDF = (project) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const colors = {
    primary: [15, 23, 42],
    secondary: [71, 85, 105],
    accent: [59, 130, 246],
    text: [30, 41, 59],
    muted: [100, 116, 139],
    border: [226, 232, 240],
    bg: [248, 250, 252],
    success: [22, 163, 74],
    warning: [234, 179, 8],
    error: [220, 38, 38],
  };

  // Portada
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, pageWidth, 80, 'F');
  doc.setDrawColor(...colors.accent);
  doc.setLineWidth(1);
  doc.line(margin, 20, margin + 40, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...colors.primary);
  doc.text(project.name, margin, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...colors.secondary);
  doc.text('Informe de Revisión Técnica', margin, 50);
  doc.setFontSize(10);
  doc.setTextColor(...colors.muted);
  const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Generado el ${fecha}`, margin, 65);

  const totalDocs = project.documents.length;
  const totalObs = project.documents.reduce((sum, doc) => sum + doc.observations.length, 0);
  const approvedObs = project.documents.reduce((sum, doc) => sum + doc.observations.filter(o => o.status === 'aprobada').length, 0);
  const pendingObs = project.documents.reduce((sum, doc) => sum + doc.observations.filter(o => o.status === 'pendiente').length, 0);

  y = 100;
  const stats = [
    { label: 'Documentos', value: totalDocs, color: colors.accent },
    { label: 'Observaciones', value: totalObs, color: colors.primary },
    { label: 'Aprobadas', value: approvedObs, color: colors.success },
    { label: 'Pendientes', value: pendingObs, color: colors.warning },
  ];

  const cardWidth = (contentWidth - 10) / stats.length;
  stats.forEach((stat, i) => {
    const x = margin + (i * (cardWidth + 3));
    doc.setFillColor(...colors.bg);
    doc.roundedRect(x, y, cardWidth, 25, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...stat.color);
    doc.text(String(stat.value), x + cardWidth / 2, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(stat.label, x + cardWidth / 2, y + 20, { align: 'center' });
  });

  // Páginas de documentos
  let docIndex = 1;
  project.documents.forEach((docItem) => {
    if (docItem.observations.length === 0) return;
    doc.addPage();
    y = margin;
    doc.setFillColor(...colors.bg);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colors.accent);
    doc.text(`Documento ${docIndex}`, margin, 12);
    doc.setFontSize(20);
    doc.setTextColor(...colors.primary);
    doc.text(docItem.name, margin, 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...colors.secondary);
    doc.text(docItem.discipline, pageWidth - margin, 22, { align: 'right' });
    y = 45;

    const grouped = {
      'Coherencia Global': docItem.observations.filter(o => o.type === 'Coherencia Global' && o.status === 'aprobada'),
      'Coherencia Interna': docItem.observations.filter(o => o.type === 'Coherencia Interna' && o.status === 'aprobada'),
      'Observación Propia': docItem.observations.filter(o => o.type === 'Observación Propia' && o.status === 'aprobada'),
    };

    Object.entries(grouped).forEach(([type, obs]) => {
      if (obs.length === 0) return;
      if (y > pageHeight - 60) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(...colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 30, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...colors.primary);
      doc.text(type, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(`(${obs.length})`, margin + doc.getTextWidth(type) + 3, y);
      y += 8;

      obs.forEach((o, i) => {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...colors.accent);
        doc.text(o.id, margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        const textLines = doc.splitTextToSize(o.text, contentWidth);
        doc.text(textLines, margin, y);
        y += textLines.length * 5;
        doc.setFontSize(9);
        doc.setTextColor(...colors.muted);
        doc.setFont('helvetica', 'italic');
        doc.text(`Fuente: ${o.source}`, margin, y);
        y += 8;

        if (i < obs.length - 1) {
          doc.setDrawColor(...colors.border);
          doc.setLineWidth(0.2);
          doc.line(margin, y, pageWidth - margin, y);
          y += 5;
        }
      });
      y += 5;
    });
    docIndex++;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(project.name, margin, pageHeight - 10);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_informe_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
