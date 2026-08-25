# ThinkPad X390 — Laptop Diagnostic Profile

*Compiled from independent diagnostic session reports produced on this machine, each backed by its own terminal logs (`dmesg`, `smartctl`). Where sources agreed, agreed-upon facts are stated plainly. Where a claim outran what the evidence actually supports, it is downgraded to "best-supported diagnosis" rather than stated as fact. Scope: the laptop's own hardware only. Compiled 2026-08-25.*

---

## Machine Identification

| Field | Value |
|---|---|
| Vendor / Model | **Lenovo ThinkPad X390** (model `20Q1S3JV05`, board `SDK0J40697 WIN`) |
| Processor | Intel Core i5-8365U @ 1.60GHz (WhiskeyLake-U) |
| Graphics | Intel UHD Graphics 620 |
| Memory | 15.28 GiB |
| OS (current session) | Pop!_OS 24.04 LTS, kernel 6.18.7-generic, COSMIC (Wayland) |

*Confirmed twice: once via System & Accounts → About in an earlier session, and independently re-confirmed via `/sys/class/dmi/id/*` during the session that compiled this document — both agree exactly.*

---

## Why This Laptop Is Currently Run From a Live Session

The internal drive's SATA connection is not reliable enough to trust for a normal persistent OS install (see below). It can appear completely healthy at boot, then lose its link mid-session with no user action involved. Installing an OS onto storage that can vanish mid-write risks a corrupted, half-updated, or unbootable system, so this laptop has been operated as a live session rather than from an install on its internal drive until that link is demonstrated stable.

---

## Internal SSD — Intermittent SATA Link Failure at 6.0 Gbps

### Identification
- Device: `/dev/sda`, model `SSD256GB`, ~238.5 GB (500,118,192 sectors)
- Controller: Intel Cannon Point-LP SATA AHCI, PCI `0000:00:17.0`
- Port: `ata3`, kernel driver `ahci`

### Failure sequence (directly observed via `dmesg`)
1. **Cold boot:** link negotiates cleanly at 6.0 Gbps, drive reports full capacity, fully readable.
2. **~19 minutes into that boot:** a routine `FLUSH CACHE EXT` command times out. The port freezes.
3. The kernel attempts repeated hard resets at 6.0 Gbps — all fail. It drops to 3.0 Gbps, fails again, then disables the port (`ata3.00: disable device`).
4. All subsequent I/O returns `hostbyte=DID_BAD_TARGET`. Separately observed: `sda: detected capacity change from 500118192 to 0`, and a direct read against `/dev/sda` confirmed the drive was unreadable at that point.

### Recurrence
The same signature reappeared later in the *same* boot on resume-from-suspend, and again in separate later boots — this is not a one-off event.

### Forced-recovery attempts got progressively worse, not better
Three AHCI controller driver unbind/rebind attempts were made. Each held for a **shorter** window before failing again:

| Attempt | Result |
|---|---|
| 1st rebind | Stable ~19 minutes before failing again |
| 2nd rebind | Stable ~3.5 minutes, under light **read-only** load |
| 3rd rebind | Total link-training failure — device did not come back |

Repeated hot resets were deliberately stopped at that point rather than continuing to stress an already-unstable link.

### SMART data (captured while briefly accessible)

| Attribute | Value |
|---|---|
| `Reallocated_Sector_Ct` | 0 |
| `UDMA_CRC_Error_Count` | 0 |
| `Reported_Uncorrect` | 0 |
| Temperature | ~40°C |
| Overall-health self-assessment | **PASSED** |
| `Power_On_Hours` | 351 |
| `Power_Cycle_Count` | **1136** |

*A power-cycle count of 1136 against only 351 power-on hours averages roughly one full power cycle every ~18 minutes across the drive's entire recorded history — itself a strong, independent indicator of long-standing chronic link instability, not a one-time incident.*

**What SMART establishes:** no reallocated sectors, no reported uncorrectable sectors, no CRC errors, no overheating — the evidence does not support describing this as ordinary NAND wear-out or a bad-sector failure.

**What SMART does *not* establish:** it does not prove every component of the drive or the host-storage signal path is healthy — only that the specific SMART attributes captured were clean at the moment of testing.

### Speed-dependent stability — the central finding

| Link speed | Observed behavior |
|---|---|
| **6.0 Gbps** | Negotiates cleanly, then repeatedly loses the link within minutes across every attempt tested |
| **3.0 Gbps** (after automatic kernel fallback) | Remained stable for **45+ minutes continuously** — the longest stable period recorded at *any* speed during the investigation |

### Link power management — considered, not confirmed as cause
The controller showed `lpm-pol 3`, active policy `med_power_with_dipm`, and failures were *associated* in the investigation with cache-flush/sync events. The available history did not conclusively prove LPM was the root cause — it is noted as a factor considered, not a finding.

### Best-supported diagnosis
> The drive's NAND/controller itself is not failing — SMART is clean across every relevant metric. The fault is specifically in **SATA link negotiation at 6.0 Gbps**, consistent with a marginal physical connection (worn or partially-seated connector, degraded contact, or a signal-path component whose reliability degrades at 6.0 Gbps's tighter electrical timing margins) rather than a dying drive. A marginal connection can hold the more forgiving 3.0 Gbps timing while failing to reliably hold 6.0 Gbps.

### What has *not* been proven
*(explicitly, so this isn't overstated beyond the evidence):*
- That the SSD itself is physically perfect
- That the connector is *definitely* damaged
- That the motherboard SATA controller is *definitely* faulty
- That link power management is *definitely* the root cause
- That reseating the drive will *definitely* fix it
- That the internal drive can now safely be used for a permanent OS install

No physical teardown or component-swap test has been performed — this diagnosis is behavioral/software-observed only.

### Mitigation identified (not a confirmed repair)
Force the link to 3.0 Gbps permanently via the `libata.force=3.0` kernel boot parameter — caps throughput to ~300MB/s vs ~550MB/s, but was directly observed to hold where 6.0 Gbps did not.

### Physical repair path considered (not performed)
Fully power down → physically inspect the internal drive connection → reseat → inspect the connector/contact path for wear or damage (isopropyl alcohol cleaning if applicable) → retest from cold boot → if instability remains, professional inspection of the storage connection/controller path.

**No OS was installed onto this internal drive during these sessions** — explicitly declined given the unstable link and unknown existing contents.

---

## Network — Intermittent DNS Failures (Not Root-Caused)

Across separate install sessions, repeated intermittent failures were observed: `Could not resolve host`, `Recv failure: Connection reset by peer`, `Network is unreachable`, and download timeouts — installs eventually succeeded after retries.

At one point, a direct `ping 8.8.8.8` (bypassing DNS) succeeded cleanly with 0% packet loss at a moment when DNS-based lookups (`claude.ai`) were failing — indicating the issue was **DNS resolution specifically**, not a total network outage. *Not further root-caused* — no confirmation yet of which resolver is in use or whether the failures correlate with anything else on the machine.

---

## Home Directory Permission Error (Minor, Unresolved)

A `~/.bashrc` write (`echo ... >> ~/.bashrc`) returned `Permission denied`, and a direct `source ~/.bashrc` also failed the same way. Not diagnosed further — file ownership/permissions (`ls -la ~/.bashrc`) had not been checked at the point this was logged.

---

## Working Problem Statement

> The ThinkPad X390 has an **unresolved internal SATA storage-link reliability problem**. The internal drive intermittently disconnects from the AHCI/SATA path during operation — most reliably reproduced at the 6.0 Gbps link speed, most stable when forced to 3.0 Gbps — making the drive unavailable and unsafe to trust for a normal persistent OS installation until the underlying connection/signal-path issue is repaired or a stable workaround is independently verified over meaningful use. This is why the laptop has been run as a live session rather than from its internal drive.

---

## Evidence Note — What's Actually Proven vs. Not

| Claim | Status |
|---|---|
| SSD media appears healthy based on captured SMART data | **Supported** |
| The SATA link is unstable, specifically at 6.0 Gbps | **Supported** |
| A marginal physical connection/signal path is the leading explanation | **Supported as best diagnosis**, not proven |
| A specific connector, cable, SSD controller, or motherboard component is *definitely* defective | *Not proven* |
| Link power management is *definitely* the cause | *Not proven* |

---

## Recommended Next Steps

1. **Physically inspect/reseat the internal SSD connection** — power down fully, remove and reinsert the M.2 drive, inspect the connector/contact path for wear or damage.
2. **Retest from a cold boot**, capturing SMART data while the drive is available and monitoring SATA link speed + kernel errors.
3. **Compare native-speed behavior against a deliberately-limited 3.0 Gbps link** (`libata.force=3.0`) to confirm the workaround holds over meaningful use, not just 45 minutes.
4. **Only consider a permanent internal-drive OS install after stability is demonstrated** over sustained real use — not before.

---

## Summary Table

| Component | Status |
|---|---|
| Internal SSD (238.5GB SATA, `SSD256GB`) | SMART-healthy; **SATA link unstable at 6.0 Gbps**, best explanation is a marginal physical connection — not confirmed by teardown |
| Network / DNS | Intermittent resolver failures observed, **not root-caused** |
| `~/.bashrc` permission error | Observed once, **not diagnosed** |
| Laptop otherwise (CPU/RAM/GPU) | No issues identified in any session |
