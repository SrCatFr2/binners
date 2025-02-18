// sidebar.js – Archivo completo para la funcionalidad del sidebar
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuIcon = menuButton.querySelector('i');

  function toggleSidebar() {
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
      // Si el sidebar está abierto, lo cerramos
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
      document.body.style.overflow = '';
    } else {
      // Si está cerrado, lo abrimos
      sidebar.classList.add('active');
      overlay.classList.add('active');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
      document.body.style.overflow = 'hidden';
    }
  }

  // Eventos
  menuButton.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  // Cierre al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });

  // Cierre si se redimensiona la ventana (solo para pantallas mayores a 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });

  // Cerrar el sidebar al hacer click en algún link interno
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', toggleSidebar);
  });
});