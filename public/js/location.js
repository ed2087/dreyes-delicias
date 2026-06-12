/* ============================================
   LOCATION PAGE SCRIPT
   ============================================ */

(function initLocation() {
  // Copy address to clipboard
  const copyBtn = document.getElementById('copyAddressBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const address = copyBtn.dataset.address;
      try {
        await navigator.clipboard.writeText(address);
        const original = copyBtn.textContent;
        copyBtn.textContent = '¡Copiado!';
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = address;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    });
  }
})();
