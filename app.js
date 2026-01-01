const form = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');
const ENTRY_KEY = 'manager-log-entries';

const loadEntries = () => {
  try {
    const stored = localStorage.getItem(ENTRY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Could not parse saved entries', error);
    return [];
  }
};

const persistEntries = (entries) => {
  try {
    localStorage.setItem(ENTRY_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Could not save entries', error);
  }
};

const renderEntries = () => {
  const entries = loadEntries();
  entryList.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No entries yet. Add one above!';
    empty.className = 'entry-item';
    entryList.appendChild(empty);
    return;
  }

  entries
    .slice()
    .reverse()
    .forEach(({ text, date }) => {
      const li = document.createElement('li');
      li.className = 'entry-item';

      const time = document.createElement('time');
      time.textContent = new Date(date).toLocaleString();

      const content = document.createElement('p');
      content.textContent = text;

      li.appendChild(time);
      li.appendChild(content);
      entryList.appendChild(li);
    });
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const entry = document.getElementById('entry');
  if (!entry?.value.trim()) return;

  const entries = loadEntries();
  entries.push({
    text: entry.value.trim(),
    date: Date.now(),
  });
  persistEntries(entries);
  entry.value = '';
  renderEntries();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .catch((error) => console.warn('Service worker registration failed', error));
  });
}

renderEntries();
