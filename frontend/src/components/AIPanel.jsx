import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { chatBot } from "../psappwrite/ai";

function AIPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [copiedId, setCopiedId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const prompt = data.promptInput?.trim();
    if (!prompt) return;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setIsLoading(true);
    setMessages((prev) => [...prev, { id, prompt, response: "", loading: true }]);
    reset();

    try {
      const response = await chatBot(prompt);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, response: response || "No response generated.", loading: false }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, response: "Error generating result via bot", loading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id, text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1200);
    } catch (error) {
      setCopiedId("");
    }
  };

  return (
    <section className="mt-6 w-full rounded-3xl border border-[var(--border-soft)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--surface-1)_95%,transparent),color-mix(in_srgb,var(--surface-2)_90%,transparent))] p-4 shadow-[var(--shadow-xl)] md:p-6">
      <div className="mb-4 px-1">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--text-main)] md:text-xl">Idea Forge</h3>
        <p className="mt-1 text-sm text-[var(--text-faint)]">Shape rough thoughts into publish-ready drafts in seconds.</p>
      </div>

      <div className="mb-4 flex min-h-[280px] max-h-[58vh] flex-col gap-5 overflow-y-auto rounded-2xl bg-[color-mix(in_srgb,var(--surface-2)_70%,transparent)] p-4">
        {messages.length === 0 && (
          <div className="rounded-xl bg-[color-mix(in_srgb,var(--surface-1)_62%,transparent)] px-4 py-5 text-center text-sm text-[var(--text-faint)]">
            Drop a prompt and let the panel draft with you.
          </div>
        )}

        {messages.map((msg) => (
          <article key={msg.id} className="space-y-2">
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-2))] px-4 py-2.5 text-sm text-[var(--text-main)] md:text-base">
              {msg.prompt}
            </div>

            {msg.loading ? (
              <div className="mr-auto flex w-fit min-h-[44px] min-w-[64px] items-center justify-center rounded-2xl rounded-bl-md bg-[color-mix(in_srgb,var(--surface-1)_82%,transparent)] px-4 py-2">
                <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-[var(--accent)] opacity-70" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[var(--accent)]" />
                </span>
              </div>
            ) : (
              <div className="mr-auto max-w-[90%] rounded-2xl rounded-bl-md bg-[color-mix(in_srgb,var(--surface-1)_84%,transparent)] px-4 py-3 text-sm text-[var(--text-soft)] md:text-base">
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.response)}
                    className="rounded-lg border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-2)_86%,transparent)] px-3 py-1.5 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-strong)]"
                  >
                    {copiedId === msg.id ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="whitespace-pre-wrap break-words leading-7">{msg.response}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-2)_84%,transparent)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] md:text-base"
            {...register("promptInput", {
              required: "This is required",
              minLength: { value: 1, message: "Prompt can't be empty" },
            })}
            type="text"
            placeholder="Generate an article in x words..."
          />

          <button
            className="rounded-xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-1)_86%,transparent)] px-5 py-2.5 text-sm font-semibold text-[var(--text-main)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:text-base"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Generating..." : "Send"}
          </button>
        </div>

        {errors.promptInput && (
          <p className="mt-2 px-1 text-sm text-red-300">{errors.promptInput.message}</p>
        )}
      </form>
    </section>
  );
}

export default AIPanel;
