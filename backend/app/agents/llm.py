"""Thin wrapper so agent nodes can call whichever LLM provider is configured."""
from app.core.config import get_settings

settings = get_settings()


def chat_completion(system_prompt: str, user_prompt: str) -> str:
    if settings.llm_provider == "anthropic" and settings.anthropic_api_key:
        import anthropic
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return "".join(b.text for b in resp.content if b.type == "text")

    if settings.openai_api_key and settings.openai_api_key != "sk-...":
        from openai import OpenAI
        client = OpenAI(api_key=settings.openai_api_key)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return resp.choices[0].message.content

    # Dev fallback with no API key configured, so the graph is runnable out of the box
    return f"[dev-mode stub response] Based on: {user_prompt[:200]}"
