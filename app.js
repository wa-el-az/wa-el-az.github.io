(() => {
  const qs = (sel, el=document) => el.querySelector(sel);

  function openModal(title, message){
    const modal = qs('#redeemModal');
    if(!modal) return;

    qs('#redeemModalTitle').textContent = title;
    qs('#redeemModalMessage').textContent = message;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // trap-ish: focus close button
    const closeBtn = qs('[data-modal-close]', modal);
    closeBtn && closeBtn.focus();
  }

  function closeModal(){
    const modal = qs('#redeemModal');
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function loadCodes(){
    const res = await fetch('codes.json', { cache: 'no-store' });
    if(!res.ok) throw new Error('Unable to load codes.json');
    return await res.json();
  }

  function setNotice(type, text){
    const n = qs('#redeemNotice');
    if(!n) return;
    n.classList.remove('ok','err','show');
    n.classList.add('show', type);
    n.textContent = text;
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if(target && target.matches('[data-modal-close]')) closeModal();
    if(target && target.id === 'redeemModal') closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const form = qs('#redeemForm');
    if(!form) return;

    const input = qs('#redeemCode');
    const btn = qs('#redeemBtn');
    let codesPromise = null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const raw = (input?.value || '').trim();
      if(!raw){
        setNotice('err', 'Please enter a code.');
        input && input.focus();
        return;
      }

      const code = raw.toUpperCase();
      btn && (btn.disabled = true);
      btn && (btn.textContent = 'Checking…');

      try{
        codesPromise = codesPromise || loadCodes();
        const data = await codesPromise;

        const entry = data?.codes?.[code];
        if(!entry){
          setNotice('err', 'That code doesn\'t look valid. Check for typos and try again.');
          return;
        }

        // Success
        setNotice('ok', 'Code accepted. Opening your reward…');
        openModal(entry.title || 'Yay!', entry.message || 'Yay! Code accepted.');

        // Optional: clear input after success
        input.value = '';
      }catch(err){
        setNotice('err', 'Something went wrong loading the redeem system. Please try again.');
      }finally{
        btn && (btn.disabled = false);
        btn && (btn.textContent = 'Redeem');
      }
    });
  });
})();
