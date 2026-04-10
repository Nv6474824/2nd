// ================== CONFIG ==================
const BASE_URL = "https://booking-backend-y988.onrender.com";
const STORE_KEY = 'smart-campus-storage';

// ================== STATE ==================
const defaultState = {
  user: null,
  demoMode: false,
  persona: 'Student',
  bookings: []
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || defaultState;

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

// ================== HELPERS ==================
function getToken() {
  return localStorage.getItem("token");
}

function showNotification(message, type = 'info') {
  alert(message); // simple for now
}

// ================== AUTH ==================
function checkAuth() {
  const isLoginPage = window.location.pathname.includes('login.html');

  if (!getToken() && !isLoginPage) {
    window.location.href = 'login.html';
  }

  if (getToken() && isLoginPage) {
    window.location.href = 'index.html';
  }
}

// ================== LOGIN ==================
async function handleLogin() {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      localStorage.setItem("token", data.token);

      state.user = data.user;
      saveState();

      window.location.href = "index.html";

    } catch (err) {
      showNotification("Invalid credentials ❌");
    }
  };
}

// ================== FETCH BOOKINGS ==================
async function fetchBookings() {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    const data = await res.json();
    state.bookings = data;
    saveState();

  } catch (err) {
    console.log("Error fetching bookings");
  }
}

// ================== BOOK RESOURCE ==================
async function handleBooking() {
  const btn = document.getElementById('bookBtn');
  if (!btn) return;

  btn.onclick = async () => {
    const date = document.getElementById('dateSelect').value;
    const slot = document.getElementById('slotSelect').value;
    const type = document.getElementById('resourceType').value;
    const name = document.getElementById('resourceName').value;

    if (!date || !slot) {
      showNotification("Select date & slot");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          resourceName: name,
          resourceType: type,
          date,
          timeSlot: slot
        })
      });

      if (!res.ok) throw new Error();

      showNotification("Booking successful ✅");

      await fetchBookings();
      renderUI();

    } catch {
      showNotification("Booking failed ❌");
    }
  };
}

// ================== RENDER ==================
function renderUI() {
  const path = window.location.pathname;

  if (path.includes('index.html')) {
    const stats = document.getElementById('dashboardStats');

    if (stats) {
      stats.innerHTML = `
        <div>Bookings: ${state.bookings.length}</div>
      `;
    }
  }

  if (path.includes('history.html')) {
    const tbody = document.getElementById('historyTableBody');

    if (tbody) {
      tbody.innerHTML = state.bookings.map(b => `
        <tr>
          <td>${b.id}</td>
          <td>${b.resourceName}</td>
          <td>${b.date}</td>
          <td>${b.timeSlot}</td>
          <td>${b.status}</td>
        </tr>
      `).join('');
    }
  }
}

// ================== LOGOUT ==================
function setupLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;

  btn.onclick = () => {
    localStorage.removeItem("token");
    state.user = null;
    saveState();
    window.location.href = "login.html";
  };
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();
  handleLogin();
  setupLogout();

  if (!window.location.pathname.includes("login.html")) {
    await fetchBookings();
  }

  handleBooking();
  renderUI();
});
