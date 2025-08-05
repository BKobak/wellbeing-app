export function testHome() {
  const results = [];

  try {
    const items = ['Log Headache', 'View Reports', 'Chatbot'];
    const rendered = renderHomeMenu(items); // Simulated output

    results.push({
      name: 'Home screen includes all main menu items',
      pass: items.every(item => rendered.includes(item)),
      error: rendered,
    });
  } catch (err) {
    results.push({ name: 'Home screen logic', pass: false, error: err.message });
  }

  return results;
}

function renderHomeMenu(items) {
  return items.join(', '); // Replace with your real component logic
}
