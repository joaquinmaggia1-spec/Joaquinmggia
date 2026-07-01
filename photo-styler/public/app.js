const FORMAT_LABELS = {
  original: 'Original optimizado',
  square: 'Cuadrado (1:1)',
  feed: 'Feed vertical (4:5)',
  story: 'Historia/Reel (9:16)',
};

let styles = [];
let selectedStyleId = 'hyperreal-base';
let selectedPhotoFile = null;
let pendingReferenceFiles = [];

const styleListEl = document.getElementById('styleList');
const newStyleForm = document.getElementById('newStyleForm');
const styleReferenceInput = document.getElementById('styleReferenceInput');
const dropzone = document.getElementById('dropzone');
const photoInput = document.getElementById('photoInput');
const browseBtn = document.getElementById('browseBtn');
const photoPreview = document.getElementById('photoPreview');
const processBtn = document.getElementById('processBtn');
const statusMsg = document.getElementById('statusMsg');
const resultsPanel = document.getElementById('resultsPanel');
const resultsGrid = document.getElementById('resultsGrid');
const extraInstructionsEl = document.getElementById('extraInstructions');

async function loadStyles() {
  const res = await fetch('/api/styles');
  styles = await res.json();
  renderStyleList();
}

function renderStyleList() {
  styleListEl.innerHTML = '';
  for (const style of styles) {
    const card = document.createElement('div');
    card.className = 'style-card' + (style.id === selectedStyleId ? ' selected' : '');
    card.addEventListener('click', () => {
      selectedStyleId = style.id;
      renderStyleList();
    });

    const thumbs = document.createElement('div');
    thumbs.className = 'thumbs';
    for (const ref of style.referenceImages || []) {
      const img = document.createElement('img');
      img.src = `/api/styles/${style.id}/reference/${ref}`;
      thumbs.appendChild(img);
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<strong>${style.name}</strong><span>${style.description}</span>`;

    card.appendChild(thumbs);
    card.appendChild(info);

    if (!style.protected) {
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = '🗑';
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`¿Eliminar el estilo "${style.name}"?`)) return;
        await fetch(`/api/styles/${style.id}`, { method: 'DELETE' });
        if (selectedStyleId === style.id) selectedStyleId = 'hyperreal-base';
        loadStyles();
      });
      card.appendChild(delBtn);
    }

    styleListEl.appendChild(card);
  }
}

newStyleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('styleName').value.trim();
  const description = document.getElementById('styleDescription').value.trim();

  const res = await fetch('/api/styles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  const style = await res.json();

  if (!res.ok) {
    alert(style.error || 'No se pudo crear el estilo');
    return;
  }

  for (const file of styleReferenceInput.files) {
    const formData = new FormData();
    formData.append('reference', file);
    await fetch(`/api/styles/${style.id}/reference`, { method: 'POST', body: formData });
  }

  newStyleForm.reset();
  selectedStyleId = style.id;
  await loadStyles();
});

browseBtn.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', () => {
  if (photoInput.files[0]) setSelectedPhoto(photoInput.files[0]);
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '#d4572a';
});
dropzone.addEventListener('dragleave', () => {
  dropzone.style.borderColor = '';
});
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '';
  if (e.dataTransfer.files[0]) setSelectedPhoto(e.dataTransfer.files[0]);
});

function setSelectedPhoto(file) {
  selectedPhotoFile = file;
  photoPreview.src = URL.createObjectURL(file);
  photoPreview.hidden = false;
  processBtn.disabled = false;
}

processBtn.addEventListener('click', async () => {
  if (!selectedPhotoFile) return;

  processBtn.disabled = true;
  statusMsg.textContent = 'Generando tu foto hiperreal... esto puede tardar unos segundos.';
  resultsPanel.hidden = true;

  try {
    const formData = new FormData();
    formData.append('photo', selectedPhotoFile);
    formData.append('styleId', selectedStyleId);
    formData.append('extraInstructions', extraInstructionsEl.value.trim());

    const res = await fetch('/api/process', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.details || data.error || 'Error desconocido');
    }

    renderResults(data.files);
    statusMsg.textContent = '¡Listo! Descargá las versiones que necesites.';
  } catch (error) {
    statusMsg.textContent = `Error: ${error.message}`;
  } finally {
    processBtn.disabled = false;
  }
});

function renderResults(files) {
  resultsGrid.innerHTML = '';
  for (const [variantId, info] of Object.entries(files)) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const img = document.createElement('img');
    img.src = info.downloadUrl;

    const infoRow = document.createElement('div');
    infoRow.className = 'result-info';
    infoRow.innerHTML = `<span>${FORMAT_LABELS[variantId] || variantId}</span>`;

    const link = document.createElement('a');
    link.href = info.downloadUrl;
    link.download = `${variantId}.jpg`;
    link.textContent = 'Descargar';

    infoRow.appendChild(link);
    card.appendChild(img);
    card.appendChild(infoRow);
    resultsGrid.appendChild(card);
  }
  resultsPanel.hidden = false;
}

loadStyles();
