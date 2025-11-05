// DOM elements
const promptTitleInput = document.getElementById('promptTitle');
const promptTextInput = document.getElementById('promptText');
const addPromptBtn = document.getElementById('addPromptBtn');
const promptsList = document.getElementById('promptsList');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Load prompts when popup opens
document.addEventListener('DOMContentLoaded', loadPrompts);

// Add prompt button click handler
addPromptBtn.addEventListener('click', addPrompt);

// Allow Enter key to add prompt (Ctrl+Enter in textarea)
promptTitleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addPrompt();
  }
});

promptTextInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    addPrompt();
  }
});

// Function to show toast notification
function showToast(message, duration = 2000) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Function to load prompts from Chrome storage
async function loadPrompts() {
  try {
    const result = await chrome.storage.sync.get(['prompts']);
    const prompts = result.prompts || [];
    
    renderPrompts(prompts);
  } catch (error) {
    console.error('Error loading prompts:', error);
    showToast('Error loading prompts');
  }
}

// Function to save prompts to Chrome storage
async function savePrompts(prompts) {
  try {
    await chrome.storage.sync.set({ prompts });
  } catch (error) {
    console.error('Error saving prompts:', error);
    showToast('Error saving prompts');
  }
}

// Function to add a new prompt
async function addPrompt() {
  const title = promptTitleInput.value.trim();
  const text = promptTextInput.value.trim();
  
  if (!title || !text) {
    showToast('Please fill in both title and text');
    return;
  }
  
  try {
    const result = await chrome.storage.sync.get(['prompts']);
    const prompts = result.prompts || [];
    
    const newPrompt = {
      id: Date.now().toString(),
      title,
      text,
      createdAt: new Date().toISOString()
    };
    
    prompts.unshift(newPrompt);
    await savePrompts(prompts);
    
    // Clear inputs
    promptTitleInput.value = '';
    promptTextInput.value = '';
    promptTitleInput.focus();
    
    // Re-render prompts
    renderPrompts(prompts);
    showToast('Prompt added successfully!');
  } catch (error) {
    console.error('Error adding prompt:', error);
    showToast('Error adding prompt');
  }
}

// Function to delete a prompt
async function deletePrompt(promptId) {
  try {
    const result = await chrome.storage.sync.get(['prompts']);
    const prompts = result.prompts || [];
    
    // Find the card element and add deleting animation
    const card = document.querySelector(`[data-prompt-id="${promptId}"]`);
    if (card) {
      card.classList.add('deleting');
      
      // Wait for animation to complete before removing
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const updatedPrompts = prompts.filter(p => p.id !== promptId);
    await savePrompts(updatedPrompts);
    
    renderPrompts(updatedPrompts);
    showToast('Prompt deleted');
  } catch (error) {
    console.error('Error deleting prompt:', error);
    showToast('Error deleting prompt');
  }
}

// Function to copy prompt to clipboard
async function copyPrompt(text, title) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`"${title}" copied to clipboard!`);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showToast('Error copying to clipboard');
  }
}

// Function to render prompts
function renderPrompts(prompts) {
  // Clear the list
  promptsList.innerHTML = '';
  
  if (prompts.length === 0) {
    // Show empty state
    promptsList.innerHTML = `
      <div class="empty-state" id="emptyState">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M32 20V44M20 32H44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>No prompts yet</p>
        <p class="empty-subtitle">Add your first prompt to get started</p>
      </div>
    `;
    return;
  }
  
  // Render each prompt
  prompts.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptsList.appendChild(card);
  });
}

// Function to create a prompt card element
function createPromptCard(prompt) {
  const card = document.createElement('div');
  card.className = 'prompt-card';
  card.setAttribute('data-prompt-id', prompt.id);
  
  card.innerHTML = `
    <div class="prompt-header">
      <div class="prompt-title">${escapeHtml(prompt.title)}</div>
      <div class="prompt-actions">
        <button class="icon-btn copy-btn" title="Copy to clipboard">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button class="icon-btn delete-btn" title="Delete prompt">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <div class="prompt-text">${escapeHtml(prompt.text)}</div>
  `;
  
  // Add event listeners
  const copyBtn = card.querySelector('.copy-btn');
  const deleteBtn = card.querySelector('.delete-btn');
  
  copyBtn.addEventListener('click', () => copyPrompt(prompt.text, prompt.title));
  deleteBtn.addEventListener('click', () => deletePrompt(prompt.id));
  
  return card;
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
