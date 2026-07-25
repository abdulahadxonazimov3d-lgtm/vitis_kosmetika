const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'✕':'☰'});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn.textContent='☰';menuBtn.setAttribute('aria-expanded','false')}));
document.getElementById('year').textContent=new Date().getFullYear();
const form=document.getElementById('orderForm');
const statusBox=document.getElementById('formStatus');
form?.addEventListener('submit',async e=>{e.preventDefault();statusBox.className='form-status';statusBox.textContent='Buyurtma yuborilmoqda...';const submit=form.querySelector('button[type="submit"]');submit.disabled=true;const data=Object.fromEntries(new FormData(form).entries());try{const response=await fetch('/.netlify/functions/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});let result={};try{result=await response.json()}catch{}if(!response.ok)throw new Error(result.message||'Buyurtma yuborilmadi');statusBox.classList.add('success');statusBox.textContent='Buyurtmangiz yuborildi. Operator siz bilan bog‘lanadi.';form.reset()}catch(error){statusBox.classList.add('error');statusBox.textContent=error.message||'Xatolik yuz berdi. Qayta urinib ko‘ring.'}finally{submit.disabled=false}});
