---
title: "Opus 4.7: More Tokens, Worse Output"
date: 2026-04-21
description: Claude Opus 4.7 costs more and delivers less for long-form creative work with strict rules.
tags: ai, claude, creative-writing
draft: false
---

I've been using Claude Code for a long-form creative writing project. The project has strict requirements: continuity across dozens of chapters, consistent character voice, adherence to reference documents, and a set of rules stored in CLAUDE.md and memory files. On Opus 4.6, this worked. Not perfectly, but well enough that I could trust it to follow instructions and produce drafts worth editing. Then I switched to Opus 4.7.

## What the project needed

The writing project depends on a few things going right at the same time. Each chapter has to stay consistent with the ones before it. Characters need to sound like themselves, not like each other and not like a language model. There are reference documents that describe source material the writing has to follow, and the CLAUDE.md and memory files contain rules about tone, structure, and details that need to carry across sessions.

None of this is unusual for long-form work. It's the baseline, and if the model can't hold these constraints, the output isn't usable.

## Where Opus 4.7 fell short

The problems showed up fast. Opus 4.7 would not read the reference documents it was told to read, it wouldn't do web searches to verify details, and it would forget things that happened in the previous chapter, the same chapter it had just written, with no context compaction in between.

Characters lost their voice, and the main character started reading like a robot instead of a person. Meta-knowledge leaked in, with things characters shouldn't know showing up in dialogue and decisions. Continuity broke across chapters that were only a few entries apart, not distant history but recent work.

The frustrating part is that Opus 4.6 handled all of this. Not flawlessly, but reliably enough. The same CLAUDE.md, the same memory files, the same reference documents. Opus 4.7 just stopped following them.

## What I tried to fix it

I didn't accept the bad output and move on. I used human-in-the-loop prompting, telling the model exactly what it got wrong and what to fix. I had it save corrections to its memory files so it wouldn't repeat the same mistakes, and I adjusted the CLAUDE.md to be more explicit about rules it kept breaking.

All of this worked for a chapter or two, and then the same problems came back. The fixes didn't stick. I'd correct a character voice issue, get two clean chapters, and then find the same flat, robotic tone in chapter three. The cycle repeated across every type of failure. It wasn't that the model couldn't follow the rules, because it could, briefly. It just couldn't sustain it.

## The real cost

What made this worse is that Opus 4.7 costs more than double the tokens of 4.6 for the same amount of output. The responses weren't longer or more detailed. The same work just burned through my weekly usage limits at twice the rate.

If the quality had improved, a higher token cost might be a trade worth making. But the quality went down. I was hitting my usage ceiling faster while getting output that needed heavier revision or full rewrites, and the math doesn't work. More tokens spent on worse results means less capacity for the work that actually matters.

This isn't a complaint about a model being imperfect, because every model is imperfect. This is about a clear regression. Opus 4.6 did the job, and Opus 4.7 does it worse while costing more to do it. For anyone using Claude Code for work that demands strict rule adherence and long-form consistency, that's worth knowing before you switch.
