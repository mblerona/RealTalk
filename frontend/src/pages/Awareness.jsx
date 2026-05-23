import { useState } from 'react'

const CARDS = [
  { category: 'Vaping', emoji: '💨', bg: 'bg-blue-50 border-blue-200', title: '1 in 3 teens has tried vaping by age 15', body: 'According to WHO/HBSC 2022 data, 32% of 15-year-olds have used e-cigarettes. Vaping is now MORE common than smoking among teens.', fact: 'E-cigarettes contain nicotine — the same addictive substance found in cigarettes.' },
  { category: 'Vaping', emoji: '🧠', bg: 'bg-purple-50 border-purple-200', title: 'Vaping affects your developing brain', body: 'The teenage brain keeps developing until age 25. Nicotine from vaping can permanently affect memory, attention, and mood.', fact: 'One vape pod can contain as much nicotine as a full pack of cigarettes.' },
  { category: 'Smoking', emoji: '🚬', bg: 'bg-orange-50 border-orange-200', title: '25% of 15-year-olds have tried cigarettes', body: 'Most adult smokers started as teenagers. The earlier you start, the harder it becomes to stop.', fact: 'Tobacco kills up to half of its long-term users.' },
  { category: 'Smoking', emoji: '👃', bg: 'bg-red-50 border-red-200', title: 'Secondhand smoke harms everyone', body: 'Smoking near others — including in school areas — exposes them to harmful chemicals even if they never touched a cigarette.', fact: 'There is no safe level of exposure to secondhand smoke.' },
  { category: 'Fighting', emoji: '👊', bg: 'bg-rose-50 border-rose-200', title: '14% of teenage boys are in fights', body: 'HBSC data shows 1 in 7 boys and 1 in 17 girls have been involved in physical fights. Most school fights start from an online argument.', fact: 'Fighting leads to injury, suspension, and long-term trauma for everyone involved.' },
  { category: 'Fighting', emoji: '💬', bg: 'bg-teal-50 border-teal-200', title: 'Walking away is actually the strongest move', body: "Fighting never solves the real problem. Research shows teens who walk away are seen as MORE confident by peers, not less.", fact: 'If you feel unsafe, tell a trusted adult immediately.' },
  { category: 'Peer Pressure', emoji: '🤝', bg: 'bg-yellow-50 border-yellow-200', title: '"Everyone does it" is usually false', body: 'When someone pressures you, they make it sound universal. In reality most teens your age choose not to smoke, vape, or fight.', fact: '68% of 11-year-olds have never tried any substance.' },
  { category: 'Support', emoji: '🛡️', bg: 'bg-green-50 border-green-200', title: 'You are not alone', body: 'If you are being pressured, witnessing violence, or struggling — talking to someone helps. You can report anonymously in this app anytime.', fact: 'Asking for help is a sign of strength, not weakness.' },
]

const CATEGORIES = ['All', 'Vaping', 'Smoking', 'Fighting', 'Peer Pressure', 'Support']

export default function Awareness() {
  const [active, setActive] = useState('All')
  const [flipped, setFlipped] = useState({})
  const filtered = active === 'All' ? CARDS : CARDS.filter(c => c.category === active)

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-dark mb-1">Learn the Facts</h2>
      <p className="text-muted text-sm mb-5">Real data. No lectures. Tap a card to read more.</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
              ${active === cat ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted hover:text-dark'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((card, i) => (
          <div key={i} onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-hover select-none ${card.bg}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{card.emoji}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/70 text-dark">{card.category}</span>
            </div>
            {!flipped[i] ? (
              <>
                <h3 className="font-display font-bold text-dark text-lg leading-snug mb-2">{card.title}</h3>
                <p className="text-xs text-muted">Tap to learn more →</p>
              </>
            ) : (
              <>
                <p className="text-dark text-sm leading-relaxed mb-4">{card.body}</p>
                <div className="bg-white/70 rounded-xl px-4 py-3">
                  <p className="text-dark text-xs font-medium">💡 {card.fact}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted text-center mt-6 mb-4">Sources: WHO/HBSC International Report 2021/22</p>
    </div>
  )
}
