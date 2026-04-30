// DOM Elements
const form = document.getElementById('generatorForm');
const submitBtn = document.getElementById('submitBtn');
const resultContainer = document.getElementById('resultContainer');
const presentationsList = document.getElementById('presentationsList');
const resultTitle = document.getElementById('resultTitle');
const resultPreview = document.getElementById('resultPreview');

// Settings Panel
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeBrandingBtn = document.getElementById('closeBrandingBtn');
const saveBrandingBtn = document.getElementById('saveBrandingBtn');

let currentPresentation = null;
let currentConfig = null;

// Initialize
async function init() {
  await loadConfig();
  setupEventListeners();
  await loadPresentations();
}

// Load Config
async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    currentConfig = await response.json();
    populateSettings();
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

// Populate Settings
function populateSettings() {
  if (!currentConfig?.branding) return;

  document.getElementById('brandName').value = currentConfig.branding.name || '';
  document.getElementById('brandTagline').value = currentConfig.branding.tagline || '';
  document.getElementById('brandPrimary').value = currentConfig.branding.colors?.primary || '#000000';
  document.getElementById('brandSecondary').value = currentConfig.branding.colors?.secondary || '#FFFFFF';
  document.getElementById('brandEmail').value = currentConfig.branding.contact?.email || '';
  document.getElementById('brandPhone').value = currentConfig.branding.contact?.phone || '';
  document.getElementById('googleDriveEnabled').checked = currentConfig.googleDrive?.enabled || false;
}

// Settings Panel Events
settingsBtn.addEventListener('click', () => {
  settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

closeBrandingBtn.addEventListener('click', () => {
  settingsPanel.style.display = 'none';
});

saveBrandingBtn.addEventListener('click', async () => {
  const updatedConfig = {
    ...currentConfig,
    branding: {
      ...currentConfig.branding,
      name: document.getElementById('brandName').value,
      tagline: document.getElementById('brandTagline').value,
      colors: {
        ...currentConfig.branding.colors,
        primary: document.getElementById('brandPrimary').value,
        secondary: document.getElementById('brandSecondary').value
      },
      contact: {
        ...currentConfig.branding.contact,
        email: document.getElementById('brandEmail').value,
        phone: document.getElementById('brandPhone').value
      }
    },
    googleDrive: {
      ...currentConfig.googleDrive,
      enabled: document.getElementById('googleDriveEnabled').checked
    }
  };

  try {
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig)
    });

    if (response.ok) {
      alert('✓ Configuración guardada');
      currentConfig = updatedConfig;
      settingsPanel.style.display = 'none';
    }
  } catch (error) {
    alert('Error al guardar: ' + error.message);
  }
});

// Setup Event Listeners
function setupEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
}

// Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const idea = document.getElementById('idea').value;
  const context = document.getElementById('context').value;
  const numSlides = parseInt(document.getElementById('numSlides').value);

  if (!idea.trim()) {
    alert('Por favor ingresa una idea');
    return;
  }

  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loader').style.display = 'inline';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, context, numSlides })
    });

    if (!response.ok) throw new Error('Error generando presentación');

    const data = await response.json();
    currentPresentation = data.presentation;

    displayResult(data.presentation);
    await loadPresentations();

    // Clear form
    form.reset();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al generar la presentación: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display = 'inline';
    submitBtn.querySelector('.btn-loader').style.display = 'none';
  }
}

// Display Result
function displayResult(presentation) {
  resultTitle.textContent = presentation.title;

  // Show slide previews
  resultPreview.innerHTML = '';
  presentation.slides.slice(0, 5).forEach(slide => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide-preview';
    slideDiv.innerHTML = `
      <h4>Diapositiva ${slide.slideNumber}: ${slide.title}</h4>
      <p>${slide.content.substring(0, 100)}...</p>
    `;
    resultPreview.appendChild(slideDiv);
  });

  if (presentation.slides.length > 5) {
    const moreDiv = document.createElement('p');
    moreDiv.style.marginTop = '10px';
    moreDiv.style.fontSize = '12px';
    moreDiv.style.color = '#999';
    moreDiv.textContent = `+ ${presentation.slides.length - 5} diapositivas más`;
    resultPreview.appendChild(moreDiv);
  }

  resultContainer.style.display = 'block';

  // Setup buttons
  document.getElementById('downloadPptxBtn').onclick = () => {
    if (presentation.downloadUrls?.pptx) {
      downloadFile(presentation.downloadUrls.pptx, presentation.pptxFile);
    }
  };

  document.getElementById('downloadPdfBtn').onclick = () => {
    if (presentation.downloadUrls?.pdf) {
      downloadFile(presentation.downloadUrls.pdf, presentation.pdfFile);
    }
  };

  document.getElementById('copyBtn').onclick = () => {
    const text = `${presentation.title}\n${presentation.description}`;
    navigator.clipboard.writeText(text);
    alert('✓ Información copiada al portapapeles');
  };

  // Show Google Drive status if available
  const googleDriveStatus = document.getElementById('googleDriveStatus');
  if (presentation.googleDriveLinks) {
    googleDriveStatus.style.display = 'block';
  }
}

// Download File
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Load Presentations
async function loadPresentations() {
  try {
    const response = await fetch('/api/presentations');
    const presentations = await response.json();

    if (!presentations || presentations.length === 0) {
      presentationsList.innerHTML = '<p class="empty-state">No hay presentaciones aún</p>';
      return;
    }

    presentationsList.innerHTML = '';
    presentations.reverse().forEach(pres => {
      const item = document.createElement('div');
      item.className = 'presentation-item';

      const downloadBtns = [];
      if (pres.downloadUrls?.pptx) {
        downloadBtns.push(`<button class="btn btn-secondary" onclick="downloadFile('${pres.downloadUrls.pptx}', '${pres.pptxFile}')">📊 PPTX</button>`);
      }
      if (pres.downloadUrls?.pdf) {
        downloadBtns.push(`<button class="btn btn-secondary" onclick="downloadFile('${pres.downloadUrls.pdf}', '${pres.pdfFile}')">📄 PDF</button>`);
      }

      item.innerHTML = `
        <h4>${pres.title}</h4>
        <div class="presentation-meta">
          ${new Date(pres.createdAt).toLocaleDateString('es-AR')}
        </div>
        <div class="presentation-idea">
          <strong>Idea:</strong> ${pres.originalIdea}
        </div>
        <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
          ${downloadBtns.join('')}
          ${pres.googleDriveLinks ? '<span style="color: #4caf50; font-size: 12px; align-self: center;">☁️ GD</span>' : ''}
        </div>
      `;
      presentationsList.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading presentations:', error);
  }
}

// Load on page load
window.addEventListener('load', init);

// Scroll to result
form.addEventListener('submit', () => {
  setTimeout(() => {
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }, 500);
});
