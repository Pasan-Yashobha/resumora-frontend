/**
 * usePDF - generates pixel-perfect PDFs from the resume preview.
 *
 * Core insight: html2canvas fails when:
 *   1. The element is off-screen (left: -9999px) - browser skips layout
 *   2. The element is hidden (display:none / visibility:hidden) - same issue
 *   3. Google Fonts are loaded but blocked by canvas CORS - fonts fall back to Arial
 *
 * Solution:
 *   - Temporarily append a full-size clone of the resume directly to document.body
 *     at position fixed, top:0, left:0, high z-index, behind a loading overlay
 *   - This forces the browser to compute real layout AND load fonts (same page context)
 *   - Wait for document.fonts.ready to guarantee font loading before capture
 *   - Capture with html2canvas, then immediately remove the clone
 *   - Convert canvas → jsPDF → Blob
 *
 * For DOWNLOAD: generate blob → create object URL → trigger <a> download click
 * For EMAIL: same blob returned for FormData attachment
 */

export interface PDFOptions {
  filename?: string;
}

// A4 dimensions in pixels at 96dpi
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/**
 * Core PDF generator — renders resume HTML into an on-screen overlay,
 * captures with html2canvas, converts to jsPDF blob.
 */
async function generateBlob(resumeElement: HTMLElement): Promise<Blob> {
  // Dynamically import to avoid bundle bloat on initial load
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  // Create a loading overlay so the user sees something while we render
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99998;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  `;
  overlay.innerHTML = `
    <div style="
      background: white;
      border-radius: 16px;
      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      font-family: DM Sans, sans-serif;
    ">
      <div style="
        width: 40px; height: 40px;
        border: 3px solid #e0e7ff;
        border-top-color: #636B2F;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      "></div>
      <p style="color: #374151; font-weight: 600; font-size: 14px; margin: 0;">Generating PDF…</p>
      <p style="color: #9CA3AF; font-size: 12px; margin: 0;">This will take a moment</p>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
  document.body.appendChild(overlay);

  // Create a clone of the resume element rendered visibly at center of screen
  // The source element is at opacity:0.01 / left:-9999px - we clone it to
  // a proper visible position so html2canvas captures it with full browser rendering
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${A4_WIDTH_PX}px;
    background: #ffffff;
    z-index: 99999;
    opacity: 1;
    pointer-events: none;
    overflow: hidden;
  `;

  // Deep clone the resume content
  const clone = resumeElement.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    width: ${A4_WIDTH_PX}px;
    min-height: ${A4_HEIGHT_PX}px;
    background: #ffffff;
    display: block;
    position: static;
    transform: none;
  `;
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Wait for fonts to fully load - critical for correct text rendering
    await document.fonts.ready;

    // Extra wait to ensure any async font rendering finishes
    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(container, {
      scale: 2, // High DPI for crisp text
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: A4_WIDTH_PX,
      height: container.scrollHeight,
      windowWidth: A4_WIDTH_PX,
      // Ignore elements that shouldn't be captured
      ignoreElements: (el) => {
        const tag = el.tagName?.toLowerCase();
        return tag === 'button' || tag === 'input' || tag === 'textarea';
      },
    });

    // Build PDF - A4 size in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidthMM = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeightMM = pdf.internal.pageSize.getHeight(); // 297mm

    // Convert canvas pixels → mm
    const canvasWidthMM = pageWidthMM;
    const canvasHeightMM = (canvas.height / canvas.width) * pageWidthMM;

    if (canvasHeightMM <= pageHeightMM) {
      // Single page - fits exactly
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98),
        'JPEG',
        0, 0,
        canvasWidthMM,
        canvasHeightMM
      );
    } else {
      // Multi-page - slice the canvas into A4-height sections
      const ratio = canvas.width / pageWidthMM; // pixels per mm
      const pageHeightPx = pageHeightMM * ratio;
      let offsetPx = 0;

      while (offsetPx < canvas.height) {
        const sliceHeightPx = Math.min(pageHeightPx, canvas.height - offsetPx);

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.ceil(sliceHeightPx);

        const ctx = sliceCanvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(canvas, 0, -offsetPx);

        if (offsetPx > 0) pdf.addPage();

        pdf.addImage(
          sliceCanvas.toDataURL('image/jpeg', 0.98),
          'JPEG',
          0, 0,
          pageWidthMM,
          (sliceHeightPx / ratio)
        );

        offsetPx += sliceHeightPx;
      }
    }

    return pdf.output('blob');
  } finally {
    // Always clean up - even if an error occurs
    if (document.body.contains(container)) document.body.removeChild(container);
    if (document.body.contains(overlay)) document.body.removeChild(overlay);
  }
}

/**
 * Hook that exposes downloadPDF and getPDFBlob.
 */
export function usePDF() {
  /**
   * Generate PDF and trigger browser download.
   */
  const downloadPDF = async (resumeElement: HTMLElement, filename: string): Promise<void> => {
    const blob = await generateBlob(resumeElement);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    // Small delay before cleanup so browser has time to start download
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  };

  /**
   * Generate PDF and return as Blob (for email attachment).
   */
  const getPDFBlob = async (resumeElement: HTMLElement): Promise<Blob> => {
    return generateBlob(resumeElement);
  };

  return { downloadPDF, getPDFBlob };
}
