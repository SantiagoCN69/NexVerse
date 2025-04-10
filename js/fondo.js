const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let repel = false;
let modalMostrado = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('click', () => {
  repel = true;
  setTimeout(() => { repel = false; }, 300);
});

window.addEventListener('deviceorientation', e => {
  const tiltX = e.gamma;
  const tiltY = e.beta;
  mouse.x = window.innerWidth / 2 + tiltX * 15;
  mouse.y = window.innerHeight / 2 + tiltY * 15;
}, true);

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x <= p.radius || p.x >= canvas.width - p.radius) p.speedX *= -1;
    if (p.y <= p.radius || p.y >= canvas.height - p.radius) p.speedY *= -1;

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;

    if (distance < maxDist) {
      const angle = Math.atan2(dy, dx);
      const force = (maxDist - distance) / maxDist;

      if (repel) {
        p.x -= Math.cos(angle) * force * 10;
        p.y -= Math.sin(angle) * force * 10;
      } else {
        p.x += Math.cos(angle) * force * 1.5;
        p.y += Math.sin(angle) * force * 1.5;
      }
    }

    p.x = Math.max(p.radius, Math.min(p.x, canvas.width - p.radius));
    p.y = Math.max(p.radius, Math.min(p.y, canvas.height - p.radius));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  if (!modalMostrado) {
    const todasCerca = particles.every(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 150;
    });

    if (todasCerca) {
      modalMostrado = true;
      const modal = document.getElementById('modalMensaje');
      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 4000);
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();
