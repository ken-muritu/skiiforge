# Compilation Prompt — Consolidated Transcripts → One Chronological Teaching Document

This is the prompt that produced a genuinely excellent result the first time (a 5-part
"Faith" sermon series compiled into one polished, chronologically-correct, voice-preserving
markdown document). Use it verbatim with placeholders filled in, against an LLM chat that
takes file attachments — or hand this whole file plus the transcripts to an agent with
Write access and ask it to follow §"Structural Rulebook" directly.

## What to attach

1. All N consolidated part-transcripts from `consolidate-transcripts.sh`
   (e.g. `Faith 1.txt` … `Faith 5.txt`).
2. Any broader-context recordings that cover the same material inside a wider session —
   e.g. full meeting/Google-Meet transcripts, if you have them. These aren't required, but
   they're what let the compiling model recover the *true* chronological order and connective
   context the numbered parts alone don't carry.

## The prompt (fill in the brackets)

```
Attached are transcripts of a series on [TOPIC] done by [TEACHER/SPEAKER NAME]
([N range, e.g. 1-5]).

After that, the attached are actual transcripts ([SOURCE, e.g. Google Meet]) from
which the [TOPIC] series was taught (broader in context as they cover entire
sessions as compared to the [N] parts that only cover the teaching).

From the above, generate (compile them into) one teaching on [TOPIC] by [TEACHER
NAME]. .md format. In the file, there should be a chronological flow of the
[TOPIC] series ([N range] doesn't really reflect the manner in which they were
taught — you might find that part 1 was taught after part 4). I think the [N
range] parts nail the teaching well, whereas the other transcripts sort of give
some context. If [TEACHER NAME] made any prayers/declarations/punchlines/
statements be sure to include them in the file, still in a chronological manner.
Also all scripture [or: quotes/citations from your authoritative source] to be
referenced in [NKJV, or your default translation/edition] unless of course
otherwise stated. Format well — headings, titles, bold, italic, etc.

This is a professional [TOPIC] document. Do not leave out a thing. Let it be
such that it is as if [TEACHER NAME] is speaking directly to whoever reads it.
```

The load-bearing phrases, and why each one matters (don't drop these when adapting):
- **"doesn't really reflect the manner in which they were taught"** — this is the single
  instruction that forces real chronological reasoning from internal evidence, instead of
  the model lazily trusting the file numbering. Without it, you get parts 1-5 in that literal
  order, which is very likely *wrong*.
- **"the other transcripts sort of give some context"** — explicitly ranks the two source
  types (numbered teaching parts = primary structure/weight; broader recordings = context
  filler), so the model doesn't over-weight the noisier, less-curated source.
- **"be sure to include them ... still in a chronological manner"** — prayers/declarations/
  punchlines are exactly what a lazy summarizer drops first. Naming the category explicitly
  is what keeps them in.
- **"unless of course otherwise stated"** — the one correctly-scoped escape hatch: don't
  force the standard translation over a quote the speaker explicitly attributed elsewhere.
- **"Do not leave out a thing"** — sets completeness, not summarization, as the goal. This is
  a compile, not a digest.
- **"as if [name] is speaking directly to whoever reads it"** — the instruction that produces
  first/second-person voice preservation instead of third-person academic paraphrase.

---

## Structural Rulebook (reverse-engineered from the reference output)

If you're generating this directly (an agent with Write access, not a separate chat), follow
this structure — it's what the prompt above reliably produces, made explicit:

1. **Title block**: H1 title that names the *theme*, not "Compiled Transcript" (e.g. "The
   Life of Faith"). H2 "A Teaching Series by [Name]". H3 venue/series line. Bold date range.
   Horizontal rule.
2. **Epigraph**: the 1-2 scripture/quotes most central to the whole series, blockquoted,
   italic verse text, em-dash citation, translation noted — set before any narrative content.
3. **"A Note Before We Begin"**: an introductory framing section in the speaker's own first-
   person voice, drawn from their *actual opening remarks in the chronologically-earliest
   session* — not a generic AI-written preamble. If the earliest session has no natural cold
   open, use its first substantive paragraph.
4. **One "# PART [ordinal]: [session's own descriptive title]" section per distinct session**,
   in true chronological order, each carrying:
   - H3 date of that session (only if the source states or clearly implies one — don't invent
     dates)
   - H2 thematic subheadings for each major movement of thought
   - H3 subheadings tied to specific source-passages taught, each immediately followed by
     the passage **quoted from the real reference text** (see Common Pitfalls — not the
     speaker's paraphrase) in a blockquote with citation
   - Body prose that preserves the speaker's actual phrasing, rhetorical repetition, and
     idiom — paraphrase as little as humanly possible; this is a transcript compile, not a
     summary
   - **Bold** for the speaker's key doctrinal/declarative one-liners
   - Blockquotes (same `>` syntax as scripture) for standout verbatim quotes, illustrative
     asides, and personal anecdotes — visually distinct from body prose
   - A dedicated callout subsection for any ritual/ceremonial moment (e.g. "## Communion
     Declaration — [date]"), with the prayer/declaration text preserved close to verbatim
5. **Closing section**: the final prayer/declaration from the chronologically-last session,
   verbatim, blockquoted.
6. **Summary table**: `| Session/Date | Theme | Key Scripture |`, one row per PART, in
   chronological order.
7. **"Core Declarations" list**: 8-10 numbered, pithy one-line doctrinal takeaways distilled
   from across the whole series — these are for skimming/reference, not new content.
8. **Closing pull-quote**: the single most memorable line from the whole series, blockquoted
   with attribution.
9. **Footer**: italic attribution block — compiled-from note, organization, date range,
   speaker name.

### Voice rules
- First person ("I") when the speaker refers to themself; second person ("you") when they
  address the audience directly. The reader should feel spoken to, not informed about.
- Keep the speaker's own structuring language ("Now let me ask you something," "I want you
  to see something here") — it's part of what makes the compile feel authentic rather than
  ghostwritten.