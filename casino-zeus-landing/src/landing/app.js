const whatsappButtons = document.querySelectorAll('[data-track="whatsapp"]');

function trackWhatsappClick() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: 'Casino Zeus WhatsApp CTA',
      destination: 'WhatsApp',
    });
  }
}

for (const button of whatsappButtons) {
  button.addEventListener('click', trackWhatsappClick);
}

const winners = [
  { name: 'Luciana M.', game: 'Sweet Bonanza', amount: '$ 482,000' },
  { name: 'Diego R.', game: 'Lightning Roulette', amount: '$ 1,240,000' },
  { name: 'Camila S.', game: 'Mega Moolah', amount: '$ 3,875,500' },
  { name: 'Mateo F.', game: 'Crazy Time', amount: '$ 721,800' },
  { name: 'Antonella B.', game: 'Book of Dead', amount: '$ 210,400' },
  { name: 'Joaquin L.', game: 'Blackjack VIP', amount: '$ 964,200' },
  { name: 'Valentina D.', game: 'Gates of Olympus', amount: '$ 1,892,300' },
  { name: 'Tomas A.', game: 'Baccarat Royale', amount: '$ 530,750' },
];

const tickerTrack = document.getElementById('ticker-track');

if (tickerTrack) {
  const renderWinner = (winner) => `
    <div class="ticker-item">
      <strong>${winner.name}</strong>
      <span>gano en</span>
      <span class="game">${winner.game}</span>
      <span class="amt">${winner.amount}</span>
    </div>`;

  tickerTrack.innerHTML = winners.map(renderWinner).join('') + winners.map(renderWinner).join('');
}

let jackpot = 248519740;
let players = 4218;
const jackpotAmount = document.getElementById('jackpot-amt');
const playersAmount = document.getElementById('players-num');

if (jackpotAmount) {
  setInterval(() => {
    jackpot += Math.floor(Math.random() * 8000) + 500;
    jackpotAmount.textContent = jackpot.toLocaleString('en-US');
  }, 1100);
}

if (playersAmount) {
  setInterval(() => {
    players += Math.floor(Math.random() * 7) - 3;
    if (players < 4000) {
      players = 4000 + Math.floor(Math.random() * 50);
    }
    playersAmount.textContent = players.toLocaleString('en-US');
  }, 2300);
}

const sparkleHost = document.getElementById('sparkles');

if (sparkleHost) {
  for (let i = 0; i < 24; i += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 3}s`;
    sparkle.style.animationDuration = `${2 + Math.random() * 3}s`;
    sparkleHost.appendChild(sparkle);
  }
}
