from pathlib import Path
import sys

REPO_ROOT = Path(".").resolve()

STYLE_CSS_PATH = REPO_ROOT / "css" / "style.css"
INDEX_HTML_PATH = REPO_ROOT / "index.html"
TEA_HTML_PATH = REPO_ROOT / "tea.html"
ACHIEVEMENTS_JS_PATH = REPO_ROOT / "js" / "achievements.js"
CONTEXT_MENU_JS_PATH = REPO_ROOT / "js" / "context-menu.js"

FLAG_IMG_HTML = '<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag">'
FLAG_ACHIEVEMENT_HTML = (
    '<img src=\'/assets/morocco_flag_emoji_ios.png\' '
    'alt=\'Morocco flag\' class=\'ma-flag achieve-flag\'>'
)

CSS_BLOCK = """
/* Morocco flag image */
.ma-flag{
  width: 1em;
  height: 1em;
  object-fit: contain;
  display: inline-block;
  vertical-align: -0.14em;
  transition: transform 0.15s ease, filter 0.15s ease;
  transform-origin: center;
}

.ma-flag:hover{
  transform: scale(1.15);
  filter: drop-shadow(0 2px 6px rgba(255,255,255,0.4));
}

.custom-emoji-inline.ma-flag{
  margin: 0 0.08em;
}

.tea-flag{
  width: 140px;
  height: 140px;
  vertical-align: middle;
  filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6));
}

.tea-flag:hover{
  transform: scale(1.04);
  filter: drop-shadow(0 18px 28px rgba(0,0,0,0.65));
}

.achieve-flag{
  width: 36px;
  height: 36px;
  vertical-align: middle;
}
""".strip()


def read_text(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_css_block() -> None:
    text = read_text(STYLE_CSS_PATH)

    if "/* Morocco flag image */" in text:
        print(f"[skip] CSS already exists: {STYLE_CSS_PATH}")
        return

    updated = text.rstrip() + "\n\n" + CSS_BLOCK + "\n"
    write_text(STYLE_CSS_PATH, updated)
    print(f"[ok] Updated CSS: {STYLE_CSS_PATH}")


def fix_index_html() -> None:
    text = read_text(INDEX_HTML_PATH)
    original = text

    text = text.replace("🇲🇦", FLAG_IMG_HTML)

    if text != original:
        write_text(INDEX_HTML_PATH, text)
        print(f"[ok] Updated: {INDEX_HTML_PATH}")
    else:
        print(f"[skip] No changes needed: {INDEX_HTML_PATH}")


def fix_achievements_js() -> None:
    text = read_text(ACHIEVEMENTS_JS_PATH)
    original = text

    text = text.replace('icon: "🇲🇦"', f'icon: "{FLAG_ACHIEVEMENT_HTML}"')

    if text != original:
        write_text(ACHIEVEMENTS_JS_PATH, text)
        print(f"[ok] Updated: {ACHIEVEMENTS_JS_PATH}")
    else:
        print(f"[skip] No changes needed: {ACHIEVEMENTS_JS_PATH}")


def replace_tea_flag_block(text: str) -> str:
    lines = text.splitlines()
    replaced = False

    for idx, line in enumerate(lines):
        if "else if (score < 250000000)" in line:
            indent = line[: len(line) - len(line.lstrip())]
            lines[idx] = f"{indent}else if (score < 250000000) {{"
            lines[idx + 1:idx + 1] = [
                f'{indent}    pointsPerClick = 500000;',
                f'{indent}    currentEmojiHTML = `<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag tea-flag">`;',
                f'{indent}    floatEmoji = "✨";',
                f"{indent}}}",
            ]

            # remove old one-liner body if it was on same line
            # detect and remove the original line contents only once
            replaced = True
            break

    if not replaced:
        raise RuntimeError("Could not find tea score block for < 250000000")

    # Remove the old malformed one-liner if it still exists immediately after insert
    joined = "\n".join(lines)

    old_broken = (
        'else if (score < 250000000) { pointsPerClick = 500000; '
        'currentEmojiHTML = "<img src="/assets/morocco_flag_emoji_ios.png" '
        'alt="Morocco flag" class="ma-flag">"; '
        'floatEmoji = "<img src="/assets/morocco_flag_emoji_ios.png" '
        'alt="Morocco flag" class="ma-flag">"; }'
    )
    joined = joined.replace(old_broken, "")

    return joined


def fix_tea_html() -> None:
    text = read_text(TEA_HTML_PATH)
    original = text

    broken_line = (
        'else if (score < 250000000) { pointsPerClick = 500000; '
        'currentEmojiHTML = "<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag">"; '
        'floatEmoji = "<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag">"; }'
    )

    correct_block = """else if (score < 250000000) {
                pointsPerClick = 500000;
                currentEmojiHTML = `<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag tea-flag">`;
                floatEmoji = "✨";
            }"""

    if broken_line in text:
        text = text.replace(broken_line, correct_block)
    elif 'currentEmojiHTML = `<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag tea-flag">`;' not in text:
        text = replace_tea_flag_block(text)

    if text != original:
        write_text(TEA_HTML_PATH, text)
        print(f"[ok] Updated: {TEA_HTML_PATH}")
    else:
        print(f"[skip] No changes needed: {TEA_HTML_PATH}")


def fix_context_menu_js() -> None:
    text = read_text(CONTEXT_MENU_JS_PATH)
    original = text

    lines = text.splitlines()
    new_lines = []

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("const MOROCCO_EMOJI ="):
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const MOROCCO_EMOJI = '🇲🇦';")
            continue

        if "const parts = text.split(" in line:
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const parts = text.split(/(🇲🇦|:ma:)/g);")
            continue

        if "img.className = 'custom-emoji-inline';" in line:
            line = line.replace(
                "img.className = 'custom-emoji-inline';",
                "img.className = 'custom-emoji-inline ma-flag';"
            )

        if 'img.className = "custom-emoji-inline";' in line:
            line = line.replace(
                'img.className = "custom-emoji-inline";',
                'img.className = "custom-emoji-inline ma-flag";'
            )

        new_lines.append(line)

    text = "\n".join(new_lines)

    if text != original:
        write_text(CONTEXT_MENU_JS_PATH, text)
        print(f"[ok] Updated: {CONTEXT_MENU_JS_PATH}")
    else:
        print(f"[skip] No changes needed: {CONTEXT_MENU_JS_PATH}")


def main() -> int:
    try:
        ensure_css_block()
        fix_index_html()
        fix_achievements_js()
        fix_tea_html()
        fix_context_menu_js()
    except Exception as exc:
        print(f"[error] {exc}", file=sys.stderr)
        return 1

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())