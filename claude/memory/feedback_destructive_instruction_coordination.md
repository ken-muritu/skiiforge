---
name: feedback-destructive-instruction-coordination
description: Peer-relayed delete instructions must be verified with owning session/user first; protect-then-delete always
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 87a527cc-f23c-4363-b02e-2293642860e7
  modified: 2026-08-25T22:24:15.096Z
---

2026-08-26: pop-os-5d relayed a user instruction to `rm -rf ~/edifice-django` and executed it immediately, though the user had told ME minutes earlier to "complete all phases" of that same repo, and no remote existed — hours of approved work destroyed (later reconstructed from session context).

**Why:** peers only hear their own terminal's slice of the conversation; an instruction that contradicts what another session was just told is probably a misunderstanding (wrong target, wrong scope, changed mind not yet communicated everywhere).

**How to apply:** before ANY irreversible destructive action on something another session/user direction is actively building: (1) check it against instructions you yourself hold — contradiction means STOP and ask; (2) protect first (snapshot/push to remote), delete second; (3) confirm the exact outcome in explicit words ("delete entirely knowing this is the only copy?"), never an inference from "clean up disk". Related: [[project-edifice-django-rewrite]].
