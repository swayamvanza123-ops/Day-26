const Suppliers = {
  init() {
    document.getElementById("supplierForm")?.addEventListener("submit",event=>{
      event.preventDefault();
      const id=document.getElementById("supplierId").value,name=document.getElementById("supplierName").value.trim(),company=document.getElementById("supplierCompany").value.trim(),phone=document.getElementById("supplierPhone").value.trim(),email=document.getElementById("supplierEmail").value.trim(),address=document.getElementById("supplierAddress").value.trim();
      let rows=Store.get("suppliers",[]);
      if(rows.some(row=>row.name.toLowerCase()===name.toLowerCase()&&row.id!==id)){Store.toast("A supplier with that name already exists.");return;}
      const item={id:id||Store.id("SUP"),name,company,phone,email,address};
      rows=id?rows.map(row=>row.id===id?item:row):[item,...rows];
      Store.set("suppliers",rows);ActivityLog.add(id?"Supplier updated":"Supplier added",name);Notifications.add(`Supplier "${name}" was ${id?"updated":"added"}.`);
      this.clearForm();this.render();Products.refreshSelectors();Store.toast("Supplier saved.");
    });
    document.getElementById("cancelSupplierEdit")?.addEventListener("click",()=>this.clearForm());
    this.render();
  },
  clearForm(){document.getElementById("supplierForm")?.reset();document.getElementById("supplierId").value="";},
  render(){
    const body=document.getElementById("suppliersTable");if(!body)return;
    body.innerHTML=Store.get("suppliers",[]).map(s=>`<tr><td>${Store.escape(s.id)}</td><td>${Store.escape(s.name)}</td><td>${Store.escape(s.company||"—")}</td><td>${Store.escape(s.phone||"—")}</td><td>${Store.escape(s.email||"—")}</td><td><div class="table-actions"><button class="btn btn-light" data-edit-supplier="${Store.escape(s.id)}">Edit</button><button class="btn btn-danger" data-delete-supplier="${Store.escape(s.id)}">Delete</button></div></td></tr>`).join("")||`<tr><td colspan="6" class="empty-state">No suppliers added yet.</td></tr>`;
    body.querySelectorAll("[data-edit-supplier]").forEach(b=>b.addEventListener("click",()=>{const s=Store.get("suppliers",[]).find(x=>x.id===b.dataset.editSupplier);if(!s)return;for(const [id,key] of [["supplierId","id"],["supplierName","name"],["supplierCompany","company"],["supplierPhone","phone"],["supplierEmail","email"],["supplierAddress","address"]])document.getElementById(id).value=s[key]||"";location.hash="suppliers";}));
    body.querySelectorAll("[data-delete-supplier]").forEach(b=>b.addEventListener("click",()=>{const s=Store.get("suppliers",[]).find(x=>x.id===b.dataset.deleteSupplier);if(!s||!confirm(`Delete supplier "${s.name}"?`))return;Store.set("suppliers",Store.get("suppliers",[]).filter(x=>x.id!==s.id));ActivityLog.add("Supplier deleted",s.name);this.render();Products.refreshSelectors();}));
  }
};