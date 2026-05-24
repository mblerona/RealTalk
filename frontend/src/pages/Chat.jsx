import { useState, useRef, useEffect } from 'react'
import { chatAPI } from '../services/api'
import { Send } from 'lucide-react'

const WELCOME = {
  role: 'assistant',
  content: "Hey 👋 I'm here for you — completely anonymous, no judgment. You can talk to me about peer pressure, stress, conflicts at school, or anything that's been on your mind. What's up?",
}

const SUGGESTIONS = [
  "My friends keep pressuring me to vape",
  "I'm being bullied and don't know what to do",
  "I got into a fight and feel bad about it",
  "I'm stressed about school",
]

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-base shrink-0">🤖</div>
      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-base shrink-0">🤖</div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-primary text-white rounded-2xl rounded-br-sm'
            : 'bg-white border border-border text-dark rounded-2xl rounded-bl-sm shadow-sm'
          }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

// ── Main Chat page ────────────────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [started, setStarted]   = useState(false)   // hide suggestions after first message
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    setInput('')
    setStarted(true)
    setError('')

    const userMsg = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      // Send only actual conversation (skip the welcome message for cleaner context)
      const payload = history.filter(m => !(m === WELCOME))
      const r = await chatAPI.send(payload)
      setMessages(prev => [...prev, { role: 'assistant', content: r.data.reply }])
    } catch {
      setError('Could not reach the companion. Please try again.')
      setMessages(prev => prev.slice(0, -1))  // remove the optimistic user message
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">🤖</div>
        <div>
          <h2 className="font-display text-lg font-bold text-dark leading-tight">RealTalk Companion</h2>
          <p className="text-xs text-muted">Anonymous · Judgment-free · Always here</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-2 pr-1">
        {messages.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        {error && (
          <p className="text-xs text-primary text-center bg-red-50 rounded-xl px-4 py-2 mb-4 border border-red-100">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — shown only before first user message */}
      {!started && (
        <div className="flex gap-2 flex-wrap py-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="text-xs px-3 py-2 rounded-full border border-border bg-white text-muted hover:border-primary hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-end gap-2 pt-3 border-t border-border">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          disabled={loading}
          className="flex-1 bg-bg border border-border rounded-2xl px-4 py-3 text-dark text-sm
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            resize-none placeholder-muted transition disabled:opacity-50 leading-relaxed"
          style={{ maxHeight: '120px', overflowY: 'auto' }}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center
            hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted mt-2">
        Not a therapist. If you're in danger, please contact a trusted adult or emergency services.
      </p>
    </div>
  )
}
