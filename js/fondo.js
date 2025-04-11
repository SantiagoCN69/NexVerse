const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let repel = false;
let modalMostrado = false;

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('click', () => {
  repel = true;
  setTimeout(() => (repel = false), 300);
});

window.addEventListener('deviceorientation', e => {
  mouse.x = window.innerWidth / 2 + e.gamma * 15;
  mouse.y = window.innerHeight / 2 + e.beta * 15;
}, true);

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
  });
}

const animateParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

  let todasCerca = true;

  for (const p of particles) {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x <= p.radius || p.x >= canvas.width - p.radius) p.speedX *= -1;
    if (p.y <= p.radius || p.y >= canvas.height - p.radius) p.speedY *= -1;

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 200) {
      const angle = Math.atan2(dy, dx);
      const force = (200 - distance) / 200;
      const mult = repel ? -10 : 1.5;
      p.x += Math.cos(angle) * force * mult;
      p.y += Math.sin(angle) * force * mult;
    }

    p.x = Math.max(p.radius, Math.min(p.x, canvas.width - p.radius));
    p.y = Math.max(p.radius, Math.min(p.y, canvas.height - p.radius));

    if (modalMostrado === false && distance >= 150) todasCerca = false;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!modalMostrado && todasCerca) {
    modalMostrado = true;
    const modal = document.getElementById('modalMensaje');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => (modal.style.display = 'none'), 4000);
    }
  }

  requestAnimationFrame(animateParticles);
};

animateParticles();
