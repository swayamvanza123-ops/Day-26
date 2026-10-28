document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.requireLogin();
  if (!user) return;
  Auth.applyRole(user);
  document.getElementById("logoutBtn")?.addEventListener("click", () => Auth.logout());
  document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});

  const titles = {dashboard:"Dashboard",products:"Products",categories:"Categories",suppliers:"Suppliers",sales:"Sales","stock":"Stock Movement",notifications:"Notifications",activity:"Activity Log"};
  function navigate() {
    let id = (location.hash || "#dashboard").slice(1);
    if (!document.getElementById(id) || !document.getElementById(id).classList.contains("app-section")) id="dashboard";
    if (user.role !== "Admin" && ["suppliers","activity"].includes(id)) id="dashboard";
    document.querySelectorAll(".app-section").forEach(section => section.classList.toggle("active",section.id===id));
    document.querySelectorAll(".nav-link[data-section]").forEach(link => link.classList.toggle("active",link.dataset.section===id));
    document.getElementById("pageTitle").textContent=titles[id]||"Dashboard";
    if(id==="dashboard"){Dashboard.render();InventoryCharts.render();}
    if(id==="products")Products.render();
    if(id==="categories")Categories.render();
    if(id==="suppliers")Suppliers.render();
    if(id==="sales")Sales.render();
    if(id==="stock")StockManagement.render();
    if(id==="notifications")Notifications.render();
    if(id==="activity")ActivityLog.render();
  }
  Categories.init();
  Products.init();
  Suppliers.init();
  Sales.init();
  StockManagement.init();
  ActivityLog.init();
  Notifications.init();
  window.addEventListener("hashchange",navigate);
  window.addEventListener("inventory:updated",event=>{
    if(["products","categories","suppliers","sales","movements","notifications","activity"].includes(event.detail?.key)){
      Products.refreshSelectors();
      Dashboard.render();
      InventoryCharts.render();
      Notifications.render();
      ActivityLog.render();
      Sales.render();
      StockManagement.render();
    }
  });
  navigate();
});