const StockManagement = {
  init() {
    document.getElementById("stockForm")?.addEventListener("submit",event=>{
      event.preventDefault();
      const productId=document.getElementById("movementProduct").value,type=document.getElementById("movementType").value,quantity=Number(document.getElementById("movementQuantity").value),reason=document.getElementById("movementReason").value.trim();
      const products=Store.get("products",[]),p=products.find(item=>item.id===productId);
      if(!p||!Number.isInteger(quantity)||quantity<1){Store.toast("Choose a product and enter a positive whole quantity.");return;}
      const previous=Number(p.stock)||0,updated=type==="in"?previous+quantity:previous-quantity;
      if(updated<0){Store.toast("Stock out quantity cannot exceed current stock.");return;}
      Store.set("products",products.map(item=>item.id===productId?{...item,stock:updated,updatedAt:new Date().toISOString()}:item));
      Store.set("movements",[{id:Store.id("MOV"),productId,productName:p.name,type,quantity,previous,updated,reason,date:new Date().toISOString()},...Store.get("movements",[])]);
      ActivityLog.add(type==="in"?"Stock received":"Stock removed",`${p.name}: ${previous} → ${updated}`);
      Notifications.add(`${type==="in"?"Stock added to":"Stock removed from"} "${p.name}".`,updated===0?"critical":"info");
      if(updated===0)Notifications.add(`"${p.name}" stock is now zero.`,"critical");
      else if(updated<Number(p.minimumStock??10))Notifications.add(`"${p.name}" is below minimum stock level.`,"warning");
      document.getElementById("stockForm").reset();Products.refreshSelectors();Products.render();this.render();Dashboard.render();InventoryCharts?.render();Notifications.render();Store.toast("Stock movement saved.");
    });
    this.render();
  },
  render(){
    const body=document.getElementById("movementsTable");if(!body)return;
    body.innerHTML=Store.get("movements",[]).map(m=>`<tr><td>${Store.escape(Store.dateTime(m.date))}</td><td>${Store.escape(m.productName)}</td><td><span class="pill ${m.type==="out"?"low":""}">${m.type==="in"?"Stock In":"Stock Out"}</span></td><td>${m.quantity}</td><td>${m.previous}</td><td>${m.updated}</td><td>${Store.escape(m.reason||"—")}</td></tr>`).join("")||`<tr><td colspan="7" class="empty-state">No stock movements recorded yet.</td></tr>`;
  }
};