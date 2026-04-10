// State Management
const STORE_KEY = 'smart-campus-storage';

const defaultState = {
  user: null,
  demoMode: false,
  persona: 'Student',
  bookings: [],
  notifications: []
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || defaultState;
if (!state.bookings) state.bookings = [];
if (!state.notifications) state.notifications = [];

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  renderUI();
}

// Notification System
function showNotification(message, type = 'info') {
  let panel = document.getElementById('notificationPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    document.body.appendChild(panel);
  }

  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <div style="flex: 1;">
      <p style="margin: 0; font-size: 0.875rem; font-weight: 500;">${message}</p>
    </div>
    <button style="background: none; border: none; color: white; cursor: pointer; font-size: 1.25rem;" onclick="this.parentElement.remove()">&times;</button>
  `;

  panel.appendChild(notif);

  // Trigger animation
  setTimeout(() => notif.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}

// Common Layout Injection
function injectLayout() {
  if (window.location.pathname.includes('login.html')) return;

  const sidebarHTML = `
    <aside class="sidebar glass-panel">
      <div class="sidebar-header">
        <div class="logo-icon">S</div>
        <h1 class="text-gradient" style="font-size: 1.25rem; font-weight: bold;">SmartCampus</h1>
      </div>
      <nav class="nav-links">
        ${state.user?.role === 'Admin' ? `
          <a href="admin.html" class="nav-item ${window.location.pathname.includes('admin') ? 'active' : ''}" style="color: var(--color-danger)">Admin Dashboard</a>
        ` : `
          <a href="index.html" class="nav-item ${window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 'active' : ''}">Dashboard</a>
          <a href="gym.html" class="nav-item ${window.location.pathname.includes('gym') ? 'active' : ''}">Gym</a>
          <a href="auditorium.html" class="nav-item ${window.location.pathname.includes('auditorium') ? 'active' : ''}">Auditorium</a>
          <a href="labs.html" class="nav-item ${window.location.pathname.includes('labs') ? 'active' : ''}">Labs</a>
          <a href="equipment.html" class="nav-item ${window.location.pathname.includes('equipment') ? 'active' : ''}">Equipment</a>
          <a href="library.html" class="nav-item ${window.location.pathname.includes('library') ? 'active' : ''}">Library</a>
          <a href="pass.html" class="nav-item ${window.location.pathname.includes('pass') ? 'active' : ''}">My Pass</a>
          <a href="card.html" class="nav-item ${window.location.pathname.includes('card') ? 'active' : ''}">ID Card</a>
          <a href="history.html" class="nav-item ${window.location.pathname.includes('history') ? 'active' : ''}">History</a>
          <a href="map.html" class="nav-item ${window.location.pathname.includes('map') ? 'active' : ''}">Campus Map</a>
          ${state.user?.role === 'Faculty' ? `<a href="faculty.html" class="nav-item ${window.location.pathname.includes('faculty') ? 'active' : ''}" style="color: var(--color-secondary)">Faculty Portal</a>` : ''}
        `}
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile-mini">
          <div class="avatar">${state.user?.name?.charAt(0) || 'U'}</div>
          <div>
            <div style="font-size: 0.875rem; font-weight: 500;">${state.user?.name || 'Guest'}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${state.user?.role || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  `;

  const topbarHTML = `
    <header class="topbar glass-panel">
      <div style="flex: 1;">
        <input type="text" placeholder="Search resources..." style="background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); padding: 0.5rem 1rem; border-radius: 9999px; color: white; width: 300px;">
      </div>
      <div class="topbar-actions">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Demo</span>
          <button id="demoToggle" style="width: 40px; height: 20px; border-radius: 10px; background: ${state.demoMode ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}; border: none; position: relative; cursor: pointer;">
            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${state.demoMode ? '22px' : '2px'}; transition: left 0.3s;"></div>
          </button>
        </div>
        <select id="personaSelect" style="background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); padding: 0.25rem 0.5rem; border-radius: 8px; color: white;">
          <option value="Student" ${state.persona === 'Student' ? 'selected' : ''}>Student</option>
          <option value="Faculty" ${state.persona === 'Faculty' ? 'selected' : ''}>Faculty</option>
          <option value="Staff" ${state.persona === 'Staff' ? 'selected' : ''}>Staff</option>
          <option value="Admin" ${state.persona === 'Admin' ? 'selected' : ''}>Admin</option>
        </select>
        <button id="logoutBtn" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Logout</button>
      </div>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', topbarHTML);
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Event Listeners
  document.getElementById('demoToggle')?.addEventListener('click', () => {
    state.demoMode = !state.demoMode;
    if (state.demoMode) {
      state.bookings.push({
        id: 'BKG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        resourceId: 'gym-1',
        resourceType: 'gym',
        resourceName: 'Main Campus Gym',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '18:00 - 19:00',
        status: 'active',
        userId: state.user?.id || 'demo-user',
        qrCodeData: 'DEMO-QR-DATA'
      });
    } else {
      state.bookings = [];
    }
    saveState();
    window.location.reload();
  });

  document.getElementById('personaSelect')?.addEventListener('change', (e) => {
    state.persona = e.target.value;
    saveState();
    window.location.reload();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    state.user = null;
    saveState();
    window.location.href = 'login.html';
  });
}

// Auth Check
function checkAuth() {
  const isLoginPage = window.location.pathname.includes('login.html');
  if (!state.user && !isLoginPage) {
    window.location.href = 'login.html';
  } else if (state.user && isLoginPage) {
    window.location.href = 'index.html';
  }
}

// Page Specific Logic
function renderUI() {
  const path = window.location.pathname;

  if (path.includes('login.html')) {
    const form = document.getElementById('loginForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        let role = 'Student';
        if (email.includes('admin')) role = 'Admin';
        else if (email.includes('faculty')) role = 'Faculty';
        
        state.user = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role,
          points: 150
        };
        saveState();
        if (role === 'Admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      };
    }
  }

  if (path.includes('index.html') || path === '/') {
    if (state.user?.role === 'Admin') {
      window.location.href = 'admin.html';
      return;
    }
    // Render Dashboard Stats
    const activeBookings = state.bookings.filter(b => b.status === 'active' && b.userId === state.user?.id).length;
    const statsContainer = document.getElementById('dashboardStats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="glass-panel stat-card">
          <p>Active Bookings</p>
          <h3>${activeBookings}</h3>
        </div>
        <div class="glass-panel stat-card">
          <p>Reward Points</p>
          <h3>${state.user?.points || 0}</h3>
        </div>
        <div class="glass-panel stat-card">
          <p>Campus Busyness</p>
          <h3>78%</h3>
        </div>
      `;
    }
  }

  if (path.includes('history.html')) {
    const tbody = document.getElementById('historyTableBody');
    if (tbody) {
      const userBookings = state.bookings.filter(b => b.userId === state.user?.id);
      tbody.innerHTML = userBookings.map(b => `
        <tr>
          <td style="font-family: monospace; color: var(--color-text-muted);">${b.id}</td>
          <td>
            <div style="font-weight: 500;">${b.resourceName}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: capitalize;">${b.resourceType}</div>
          </td>
          <td>
            <div>${b.date}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${b.timeSlot}</div>
          </td>
          <td><span class="badge ${b.status}">${b.status}</span></td>
          <td>
            ${(b.status === 'active' || b.status === 'pending') ? `<button class="btn btn-outline" onclick="cancelBooking('${b.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--color-danger); border-color: var(--color-danger);">Cancel</button>` : ''}
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No bookings found.</td></tr>';
    }
  }

  if (path.includes('pass.html')) {
    const container = document.getElementById('passesContainer');
    if (container) {
      const activeBookings = state.bookings.filter(b => b.status === 'active' && b.userId === state.user?.id);
      container.innerHTML = activeBookings.map(b => `
        <div class="glass-panel pass-card">
          <div style="padding: 1.5rem; background: rgba(99, 102, 241, 0.1); border-bottom: 1px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
              <span class="badge active">Active</span>
              <span style="font-family: monospace; font-size: 0.75rem; color: var(--color-text-muted);">${b.id}</span>
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${b.resourceName}</h3>
            <p style="font-size: 0.875rem; color: var(--color-text-muted);">Main Campus</p>
          </div>
          <div style="padding: 1.5rem; display: flex; gap: 2rem;">
            <div>
              <p style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Date</p>
              <p style="font-weight: 500;">${b.date}</p>
            </div>
            <div>
              <p style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Time</p>
              <p style="font-weight: 500;">${b.timeSlot}</p>
            </div>
          </div>
          <div style="padding: 1.5rem; border-top: 1px solid var(--color-border); text-align: center; background: rgba(255,255,255,0.02);">
            <div id="qr-${b.id}" style="background: white; padding: 1rem; border-radius: 12px; display: inline-block; margin-bottom: 1rem;"></div>
            <p style="font-size: 0.75rem; color: var(--color-text-muted);">Scan at entrance</p>
          </div>
        </div>
      `).join('') || '<div style="text-align: center; color: var(--color-text-muted); grid-column: 1/-1; padding: 3rem;">No active passes.</div>';

      // Generate QR Codes
      activeBookings.forEach(b => {
        if (window.QRCode) {
          new window.QRCode(document.getElementById(`qr-${b.id}`), {
            text: b.qrCodeData,
            width: 128,
            height: 128
          });
        }
      });
    }
  }

  if (path.includes('card.html')) {
    const container = document.getElementById('cardContainer');
    if (container && state.user) {
      container.innerHTML = `
        <div class="glass-panel" style="max-width: 350px; margin: 0 auto; overflow: hidden; border-radius: 24px;">
          <div style="height: 120px; background: linear-gradient(to bottom right, var(--color-primary), var(--color-secondary)); position: relative;">
            <div style="position: absolute; top: 1rem; left: 1rem; font-weight: bold; letter-spacing: 0.1em;">SMARTCAMPUS</div>
          </div>
          <div style="text-align: center; padding: 0 2rem 2rem; margin-top: -50px;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--color-surface); border: 4px solid var(--color-background); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; color: white;">
              ${(state.user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${state.user.name || 'User'}</h2>
            <div style="display: inline-block; padding: 0.25rem 1rem; background: rgba(99, 102, 241, 0.2); color: var(--color-primary); border-radius: 9999px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; margin-bottom: 1.5rem;">
              ${state.user.role}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left; margin-bottom: 2rem;">
              <div>
                <p style="font-size: 0.65rem; color: var(--color-text-muted); text-transform: uppercase;">ID Number</p>
                <p style="font-family: monospace; font-size: 0.875rem;">${state.user.id.toUpperCase()}</p>
              </div>
              <div>
                <p style="font-size: 0.65rem; color: var(--color-text-muted); text-transform: uppercase;">Valid Until</p>
                <p style="font-family: monospace; font-size: 0.875rem;">12/2027</p>
              </div>
            </div>
            <div id="id-qr" style="background: white; padding: 0.5rem; border-radius: 12px; display: inline-block;"></div>
          </div>
        </div>
      `;
      if (window.QRCode) {
        new window.QRCode(document.getElementById('id-qr'), {
          text: `ID-${state.user.id}-${state.user.role}`,
          width: 100,
          height: 100
        });
      }
    }
  }

  if (path.includes('admin.html')) {
    const tbody = document.getElementById('adminBookingsTableBody');
    if (tbody) {
      const pendingBookings = state.bookings.filter(b => b.status === 'pending');
      tbody.innerHTML = pendingBookings.map(b => `
        <tr>
          <td style="font-family: monospace; color: var(--color-text-muted);">${b.id}</td>
          <td>
            <div style="font-weight: 500;">${b.resourceName}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: capitalize;">${b.resourceType}</div>
          </td>
          <td>
            <div style="font-weight: 500;">User ID: ${b.userId}</div>
          </td>
          <td>
            <div>${b.date}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${b.timeSlot}</div>
          </td>
          <td><span class="badge ${b.status}">${b.status}</span></td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-outline" onclick="approveBooking('${b.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--color-success); border-color: var(--color-success);">Approve</button>
              <button class="btn btn-outline" onclick="rejectBooking('${b.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--color-danger); border-color: var(--color-danger);">Reject</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--color-text-muted);">No pending bookings.</td></tr>';
    }
  }

  // Resource Booking Logic
  const bookBtn = document.getElementById('bookBtn');
  if (bookBtn) {
    bookBtn.onclick = () => {
      const date = document.getElementById('dateSelect').value;
      const slot = document.getElementById('slotSelect').value;
      const type = document.getElementById('resourceType').value;
      const name = document.getElementById('resourceName').value;

      if (!date || !slot) {
        showNotification('Please select date and slot', 'info');
        return;
      }

      if (!state.user) {
        showNotification('Please log in to book resources', 'info');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
      }

      const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      state.bookings.push({
        id: bookingId,
        resourceId: `${type}-1`,
        resourceType: type,
        resourceName: name,
        date: date,
        timeSlot: slot,
        status: 'pending',
        userId: state.user.id,
        qrCodeData: `${bookingId}-${type.toUpperCase()}`
      });

      saveState();
      showNotification('Booking request sent! Waiting for admin approval.', 'success');
      
      // Clear the form
      document.getElementById('dateSelect').value = '';
      document.getElementById('slotSelect').value = '';
    };
  }
}

window.cancelBooking = function(id) {
  if(confirm('Are you sure you want to cancel this booking?')) {
    const booking = state.bookings.find(b => b.id === id);
    if(booking) {
      booking.status = 'cancelled';
      saveState();
      showNotification('Booking cancelled successfully', 'info');
    }
  }
};

window.approveBooking = function(id) {
  const booking = state.bookings.find(b => b.id === id);
  if(booking) {
    booking.status = 'active';
    saveState();
    showNotification('Booking approved', 'success');
  }
};

window.rejectBooking = function(id) {
  const booking = state.bookings.find(b => b.id === id);
  if(booking) {
    booking.status = 'cancelled';
    saveState();
    showNotification('Booking rejected', 'info');
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  injectLayout();
  renderUI();
});
