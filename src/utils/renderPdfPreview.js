// src/utils/renderPdfPreview.js
import { getDocument } from 'pdfjs-dist';

const renderTasks = {}; // To track ongoing renders

export const renderPdfPreview = async (pdfUrl, canvasId) => {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Cancel any previous render
    if (renderTasks[canvasId]) {
      renderTasks[canvasId].cancel();
    }

    const pdf = await getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport,
    };

    const renderTask = page.render(renderContext);
    renderTasks[canvasId] = renderTask;

    await renderTask.promise;
    renderTasks[canvasId] = null;
  } catch (error) {
    console.error('PDF render error:', error);
  }
};
