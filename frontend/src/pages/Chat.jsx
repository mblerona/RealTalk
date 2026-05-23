export default function Chat() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-4">🤖</div>
      <h2 className="font-display text-2xl font-bold text-dark mb-2">AI Companion</h2>
      <p className="text-muted text-sm max-w-xs leading-relaxed">
        The AI chat companion is coming soon. You'll be able to talk anonymously
        about peer pressure, stress, or anything on your mind.
      </p>
    </div>
  )
}
