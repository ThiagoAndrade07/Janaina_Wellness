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
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
