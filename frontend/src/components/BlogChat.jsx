import { useEffect, useRef, useState } from "react"
import api from "../psappwrite/api.js"

const makeMessage = (role, content) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
})

const getStorageKey = (blogId, userId) => `blog-chat:${userId}:${blogId}`

const loadChatHistory = (blogId, userId) => {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(getStorageKey(blogId, userId)) || "[]")
    if (!Array.isArray(savedMessages)) return []

    return savedMessages.filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
  } catch {
    return []
  }
}

export default function BlogChat({ blogId, userId }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState(() => loadChatHistory(blogId, userId))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    }
  }, [messages, isLoading])

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(blogId, userId), JSON.stringify(messages))
    } catch {
      // Chat still works when browser storage is unavailable or full.
    }
  }, [blogId, messages, userId])

  const sendQuestion = async (event) => {
    event.preventDefault()

    const prompt = question.trim()
    if (!prompt || isLoading) return

    const history = messages.map(({ role, content }) => ({ role, content }))
    const userMessage = makeMessage("user", prompt)

    setMessages((current) => [...current, userMessage])
    setQuestion("")
    setError("")
    setIsLoading(true)

    try {
      const response = await api.post(`/ai/blogs/${blogId}/chat`, {
        prompt,
        history,
      })

      const answer = response.data?.data?.answer
      if (!answer) throw new Error("The AI service returned an empty answer.")

      setMessages((current) => [...current, makeMessage("assistant", answer)])
    } catch (requestError) {
      setMessages((current) => current.filter((message) => message.id !== userMessage.id))
      setQuestion(prompt)
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not get an answer right now. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const copyAnswer = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopiedId(message.id)
      setTimeout(() => setCopiedId(""), 1500)
    } catch {
      setError("Unable to copy that answer.")
    }
  }

  const onInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <section className="surface-card overflow-hidden rounded-3xl" aria-labelledby="blog-chat-title">
      <header className="border-b border-[var(--border-soft)] px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="hero-kicker">Blog companion</p>
            <h2 id="blog-chat-title" className="brand-serif mt-2 text-2xl font-semibold sm:text-3xl">
              Ask about this article
            </h2>
            <p className="mt-2 text-sm text-muted">
              I answer using only the information in this post.
            </p>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([])
                setError("")
                localStorage.removeItem(getStorageKey(blogId, userId))
              }}
              className="interactive rounded-full border border-[var(--border-soft)] px-3 py-1.5 text-xs font-semibold text-muted hover:border-[var(--border-strong)] hover:text-app"
            >
              Clear chat
            </button>
          )}
        </div>
      </header>

      <div className="p-5 sm:p-7">
        <div
          ref={messagesContainerRef}
          className="max-h-[30rem] min-h-44 space-y-4 overflow-y-auto rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-2)_52%,transparent)] p-3 sm:p-4"
          aria-live="polite"
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex min-h-36 flex-col items-center justify-center px-4 text-center">
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_18%,var(--surface-2))] text-xl" aria-hidden="true">
                ✦
              </span>
              <p className="font-medium text-app">Start a conversation with this blog.</p>
              <p className="mt-1 max-w-md text-sm text-muted">
                Try asking for a summary, an explanation, or a key takeaway.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <article key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] sm:text-[0.95rem] ${
                  message.role === "user"
                    ? "rounded-br-md bg-[color-mix(in_srgb,var(--accent)_34%,var(--surface-2))] text-app"
                    : "rounded-bl-md border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-1)_88%,transparent)] text-muted"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.14em]">
                  <span className={message.role === "user" ? "text-app" : "text-var(--accent-2)"}>
                    {message.role === "user" ? "You" : "Blog companion"}
                  </span>
                  {message.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => copyAnswer(message)}
                      className="text-[10px] normal-case tracking-normal text-muted hover:text-app"
                    >
                      {copiedId === message.id ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
              </div>
            </article>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-var(--border-soft) bg-[color-mix(in_srgb,var(--surface-1)_88%,transparent)] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-var(--accent) [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-var(--accent) [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-var(--accent)" />
                  </span>
                  Searching this article…
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={sendQuestion} className="mt-4">
          <label htmlFor="blog-question" className="sr-only">Question about this blog</label>
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-2)_76%,transparent)] p-2 focus-within:border-[var(--accent)]">
            <textarea
              id="blog-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={onInputKeyDown}
              disabled={isLoading}
              rows={2}
              maxLength={2000}
              placeholder="Ask a question about this article…"
              className="min-h-16 w-full resize-none bg-transparent px-3 py-2 text-sm text-app outline-none placeholder:text-[var(--text-faint)] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="flex items-center justify-between gap-3 px-1 pt-1">
              <p className="text-xs text-[var(--text-faint)]">Enter to send · Shift + Enter for a new line</p>
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="interactive rounded-xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--accent)_25%,var(--surface-1))] px-4 py-2 text-sm font-semibold text-app hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Thinking…" : "Ask"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
