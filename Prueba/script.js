const STORAGE_KEY = 'dentalflow.orders.v1';
const stages = [
  { id: 'received', label: 'Recibida', className: 'received' },
  { id: 'design', label: 'Diseño', className: 'design' },
  { id: 'production', label: 'En producción', className: 'production' },
  { id: 'quality', label: 'Control de calidad', className: 'quality' },
  { id: 'ready', label: 'Lista para entrega', className: 'ready' },
  { id: 'delivered', label: 'Entregada', className: 'delivered' },
];

const daysFromNow = (amount) => {
  const date = new Date();
  date.setDate(date.getDate() + amount);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const sampleOrders = [
  { id: 'DF-1048', patient: 'Camila Torres', clinic: 'Clínica Sonrisa', work: 'Corona zirconio', dueDate: daysFromNow(2), stage: 'production', priority: 'urgent', notes: 'Color A2, pieza 16.' },
  { id: 'DF-1047', patient: 'Mateo Rodríguez', clinic: 'Dental Norte', work: 'Prótesis parcial', dueDate: daysFromNow(3), stage: 'quality', priority: 'normal', notes: '' },
  { id: 'DF-1046', patient: 'Valentina Ríos', clinic: 'OdontoVital', work: 'Carilla', dueDate: daysFromNow(4), stage: 'design', priority: 'normal', notes: '' },
  { id: 'DF-1045', patient: 'Juan David López', clinic: 'Clínica Sonrisa', work: 'Puente', dueDate: daysFromNow(1), stage: 'ready', priority: 'urgent', notes: 'Confirmar entrega con la clínica.' },
  { id: 'DF-1044', patient: 'Isabella Gómez', clinic: 'Dental Norte', work: 'Implante', dueDate: daysFromNow(6), stage: 'received', priority: 'normal', notes: '' },
  { id: 'DF-1043', patient: 'Santiago Pérez', clinic: 'OdontoVital', work: 'Prótesis total', dueDate: daysFromNow(-1), stage: 'delivered', priority: 'normal', notes: '' },
];

function loadOrders() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn('No se pudieron cargar las órdenes guardadas.', error);
  }
  return sampleOrders;
}

let orders = loadOrders();
const tableBody = document.querySelector('#ordersTableBody');
const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const modal = document.querySelector('#orderModal');
const form = document.querySelector('#orderForm');
const toast = document.querySelector('#toast');
let toastTimer;

function saveOrders() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    showToast('No fue posible guardar en este navegador.');
    console.warn('No se pudieron guardar las órdenes.', error);
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  const [year, month, day] = dateString.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(new Date(year, month - 1, day));
}

function renderOrders() {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  const selectedStage = statusFilter.value;
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = [order.id, order.patient, order.clinic, order.work]
      .some((value) => String(value || '').toLocaleLowerCase('es').includes(query));
    return matchesSearch && (selectedStage === 'all' || order.stage === selectedStage);
  });

  if (filteredOrders.length === 0) {
    tableBody.innerHTML = `<tr><td class="empty-state" colspan="8">No hay órdenes que coincidan con la búsqueda.</td></tr>`;
  } else {
    tableBody.innerHTML = filteredOrders.map((order) => {
      const stage = stages.find((item) => item.id === order.stage) || stages[0];
      const stageIndex = stages.findIndex((item) => item.id === stage.id);
      const initials = order.clinic.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
      const action = stage.id === 'delivered'
        ? '<span class="priority" title="Orden completada">✓ Completada</span>'
        : `<button class="action-button" type="button" data-action="advance" data-id="${escapeHtml(order.id)}" aria-label="Avanzar orden ${escapeHtml(order.id)}" title="Avanzar a ${escapeHtml(stages[stageIndex + 1]?.label || 'Entregada')}">→</button>`;
      const notesTitle = order.notes ? ` title="${escapeHtml(order.notes)}"` : '';
      return `<tr>
        <td><span class="order-id">${escapeHtml(order.id)}</span></td>
        <td><span class="patient">${escapeHtml(order.patient)}</span><span class="subtext">Caso clínico</span></td>
        <td><div class="clinic-cell"><span class="clinic-avatar">${escapeHtml(initials)}</span><span>${escapeHtml(order.clinic)}</span></div></td>
        <td${notesTitle}>${escapeHtml(order.work)}</td>
        <td>${formatDate(order.dueDate)}</td>
        <td><span class="status ${stage.className}">${stage.label}</span></td>
        <td><span class="priority ${order.priority === 'urgent' ? 'urgent' : ''}">${order.priority === 'urgent' ? '↑ Urgente' : 'Normal'}</span></td>
        <td>${action}</td>
      </tr>`;
    }).join('');
  }

  const active = orders.filter((order) => order.stage !== 'delivered');
  const clinicCount = new Set(active.map((order) => order.clinic.trim().toLocaleLowerCase('es'))).size;
  document.querySelector('#activeMetric').textContent = active.length;
  document.querySelector('#productionMetric').textContent = orders.filter((order) => order.stage === 'production').length;
  document.querySelector('#readyMetric').textContent = orders.filter((order) => order.stage === 'ready').length;
  document.querySelector('#clinicsMetric').textContent = clinicCount;
  document.querySelector('#sidebarCount').textContent = active.length;
  document.querySelector('#ordersSummary').textContent = `${filteredOrders.length} ${filteredOrders.length === 1 ? 'orden visible' : 'órdenes visibles'}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

function openModal() {
  modal.classList.add('open');
  document.querySelector('#patientInput').focus();
}

function closeModal() {
  modal.classList.remove('open');
  form.reset();
  document.querySelector('#dueInput').min = daysFromNow(0);
  document.querySelector('#dueInput').value = daysFromNow(5);
}

document.querySelector('#newOrderButton').addEventListener('click', openModal);
document.querySelector('#closeModalButton').addEventListener('click', closeModal);
document.querySelector('#cancelModalButton').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
searchInput.addEventListener('input', renderOrders);
statusFilter.addEventListener('change', renderOrders);

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="advance"]');
  if (!button) return;
  const order = orders.find((item) => item.id === button.dataset.id);
  if (!order) return;
  const currentIndex = stages.findIndex((stage) => stage.id === order.stage);
  if (currentIndex < 0 || currentIndex >= stages.length - 1) return;
  order.stage = stages[currentIndex + 1].id;
  saveOrders();
  renderOrders();
  showToast(`${order.id} avanzó a ${stages[currentIndex + 1].label.toLowerCase()}.`);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const highestId = orders.reduce((highest, order) => {
    const number = Number(order.id.split('-').pop());
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 1000);
  const newOrder = {
    id: `DF-${highestId + 1}`,
    patient: formData.get('patient').trim(),
    clinic: formData.get('clinic').trim(),
    work: formData.get('work'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
    stage: formData.get('stage'),
    notes: formData.get('notes').trim(),
  };
  orders.unshift(newOrder);
  saveOrders();
  searchInput.value = '';
  statusFilter.value = 'all';
  renderOrders();
  closeModal();
  showToast(`Orden ${newOrder.id} creada correctamente.`);
});

const today = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
document.querySelector('#todayLabel').textContent = today.charAt(0).toLocaleUpperCase('es') + today.slice(1);
document.querySelector('#dueInput').min = daysFromNow(0);
document.querySelector('#dueInput').value = daysFromNow(5);
renderOrders();
