/* ============================================
   ADMIN LOGIN SCRIPT
   ============================================ */

(function initLogin() {
  const form     = document.getElementById('loginForm');
  const errorEl  = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      errorEl.textContent = 'Completa todos los campos';
      errorEl.style.display = 'block';
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando...';

    try {
      await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Credenciales incorrectas');
        return data;
      });

      window.location.href = '/admin';
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
      loginBtn.disabled = false;
      loginBtn.textContent = 'Iniciar sesión';
    }
  });
})();
