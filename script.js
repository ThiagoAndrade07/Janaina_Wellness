const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open); document.body.classList.toggle('menu-open', !open); });
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }));
document.querySelector('#year')?.append(new Date().getFullYear());
const ebookOffer = Object.freeze({
  price: 'R$ 29,90 à vista',
  installment: 'ou 6x de R$ 5,61',
});
document.querySelector('[data-ebook-price]')?.append(ebookOffer.price);
document.querySelector('[data-ebook-installment]')?.append(ebookOffer.installment);
const collectionTrack = document.querySelector('[data-collection-track]');
if (collectionTrack) {
  const collectionTabs = [...document.querySelectorAll('[data-collection-tab]')];
  const collectionItems = [...collectionTrack.querySelectorAll('.lookbook-product')];
  const collectionPosition = document.querySelector('[data-collection-position]');
  const previousProduct = document.querySelector('[data-collection-prev]');
  const nextProduct = document.querySelector('[data-collection-next]');
  let collectionCategory = 'feminino';
  let scrollFrame;

  const visibleProducts = () => collectionItems.filter((item) => item.dataset.category === collectionCategory);
  const setActiveProduct = (product, shouldScroll = false) => {
    if (!product) return;
    collectionItems.forEach((item) => item.classList.toggle('is-active', item === product));
    const products = visibleProducts();
    const index = products.indexOf(product) + 1;
    collectionPosition.textContent = `${String(index).padStart(2, '0')} — ${String(products.length).padStart(2, '0')}`;
    if (shouldScroll) product.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
  const setCollectionCategory = (category) => {
    collectionCategory = category;
    collectionTabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.collectionTab === category)));
    collectionItems.forEach((item) => item.classList.toggle('is-hidden', item.dataset.category !== category));
    collectionTrack.scrollTo({ left: 0, behavior: 'auto' });
    setActiveProduct(visibleProducts()[0]);
  };
  const stepProduct = (direction) => {
    const products = visibleProducts();
    const activeIndex = Math.max(0, products.findIndex((item) => item.classList.contains('is-active')));
    setActiveProduct(products[Math.min(products.length - 1, Math.max(0, activeIndex + direction))], true);
  };

  collectionTabs.forEach((tab) => {
    tab.addEventListener('click', () => setCollectionCategory(tab.dataset.collectionTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const nextTab = collectionTabs[(collectionTabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1) + collectionTabs.length) % collectionTabs.length];
      nextTab.focus();
      setCollectionCategory(nextTab.dataset.collectionTab);
    });
  });
  previousProduct?.addEventListener('click', () => stepProduct(-1));
  nextProduct?.addEventListener('click', () => stepProduct(1));
  collectionItems.forEach((item) => item.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    setActiveProduct(item, true);
  }));
  collectionTrack.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const center = collectionTrack.scrollLeft + collectionTrack.clientWidth / 2;
      const nearest = visibleProducts().reduce((closest, item) => Math.abs(item.offsetLeft + item.offsetWidth / 2 - center) < Math.abs(closest.offsetLeft + closest.offsetWidth / 2 - center) ? item : closest);
      setActiveProduct(nearest);
    });
  }, { passive: true });
  let dragStart;
  collectionTrack.addEventListener('pointerdown', (event) => {
    if (event.target.closest('a')) return;
    dragStart = { x: event.clientX, left: collectionTrack.scrollLeft };
    collectionTrack.setPointerCapture(event.pointerId);
    collectionTrack.classList.add('is-dragging');
  });
  collectionTrack.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    collectionTrack.scrollLeft = dragStart.left - (event.clientX - dragStart.x);
  });
  const stopDrag = () => { dragStart = undefined; collectionTrack.classList.remove('is-dragging'); };
  collectionTrack.addEventListener('pointerup', stopDrag);
  collectionTrack.addEventListener('pointercancel', stopDrag);
  setCollectionCategory(collectionCategory);
}
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
