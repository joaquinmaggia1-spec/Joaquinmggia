// DOM Elements
const form = document.getElementById('generatorForm');
const submitBtn = document.getElementById('submitBtn');
const resultContainer = document.getElementById('resultContainer');
const presentationsList = document.getElementById('presentationsList');
const resultTitle = document.getElementById('resultTitle');
const resultPreview = document.getElementById('resultPreview');

let currentPresentation = null;

// Form Submission
form.addEventListener('submit', async (e) => {
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
});

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
  document.getElementById('viewBtn').onclick = () => {
    console.log('Ver presentación:', presentation);
    alert('Presentación generada. La puedes editar directamente en Gamma.');
  };

  document.getElementById('copyBtn').onclick = () => {
    const text = `${presentation.title}\n${presentation.description}`;
    navigator.clipboard.writeText(text);
    alert('Información copiada al portapapeles');
  };
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
      item.innerHTML = `
        <h4>${pres.title}</h4>
        <div class="presentation-meta">
          ${new Date(pres.createdAt).toLocaleDateString('es-AR')}
        </div>
        <div class="presentation-idea">
          <strong>Idea:</strong> ${pres.originalIdea}
        </div>
        <button class="btn btn-secondary" onclick="viewPresentation('${pres.id}')">
          Ver Detalle
        </button>
      `;
      presentationsList.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading presentations:', error);
  }
}

// View Presentation Details
function viewPresentation(id) {
  console.log('Viewing presentation:', id);
}

// Load presentations on page load
window.addEventListener('load', loadPresentations);

// Scroll to result
form.addEventListener('submit', () => {
  setTimeout(() => {
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }, 500);
});
