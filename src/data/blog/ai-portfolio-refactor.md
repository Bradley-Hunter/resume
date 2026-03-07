---
title: Using AI to Rebuild My Portfolio
date: 2026-03-04
description: What it's actually like handing an AI agent the keys to your personal site, from a static HTML page to a full React app and beyond.
tags: dev, ai, portfolio
featured: true
---

My portfolio started as a static HTML and CSS site I built by hand in 2023. A single `index.html` acting as a resume, a couple of extra pages for Python and C# projects, hand-rolled styles. Functional, but dated. When I decided to modernize it, I used AI to do most of the building.

This is what that actually looked like.

## What I Started With

The original site was as simple as it gets: plain HTML, a photo, my name and contact info, a skills list, work history. The project pages were just `<code>` blocks inside `.html` files with inline styles. No build tooling, no components, no routing.

It worked. It just didn't reflect where I was as a developer anymore.

## The Rebuild

Rather than migrate the old code, I had Claude Code build a new React + Vite app from scratch. In one session it scaffolded the full project structure: components, pages, a data layer, dark mode toggle, routing with React Router, GitHub Actions for deployment. The old HTML pages became source material. The content was preserved, the structure was replaced entirely.

That first commit was nearly 4,000 lines of additions. It would have taken me days to do by hand. It took a few hours with an AI doing the implementation.

Then came the iterative passes: removing `framer-motion` and simplifying the animation approach, adding featured projects and a better mobile nav, fixing bugs.

## The Limitation That Comes Up Fast

The AI built a complete, working portfolio. It just didn't know anything about me.

The resume data, the project descriptions, the summary of what I've learned: all of that had to come from me. The AI could build a card component that renders a project title and description beautifully. It couldn't write the title or description. For a portfolio specifically, that gap is significant, because the whole point of the site is to communicate who you are.

## The Back-and-Forth Parts

Not everything went cleanly. The resume page layout took several rounds to get right. Spacing, print styles, section ordering. The AI would produce something technically correct that didn't look right, I'd describe what was off, it would adjust, and we'd go again. It wasn't slow exactly, but it wasn't the instant satisfaction you get with more mechanical tasks.

There was also a tendency toward overreach: adding comments I didn't ask for, adjusting things adjacent to what I actually wanted changed. Keeping the changes focused required staying engaged and being specific about scope.

## What Works and What Doesn't

Where AI genuinely helps: anything mechanical and well-defined. Fixing WCAG color contrast across a dozen components, adding ARIA labels, extracting duplicate nav link logic into a config array, wiring up a markdown-based blog section. These have clear right answers and the AI executes them quickly. It also caught things I hadn't thought to look for, like the root cause of a contrast cascade coming from the body background color.

Where it doesn't: anything requiring judgment about what to say, or taste about how something should look. Those decisions still belong to the person building the site.

## The Honest Summary

The site is better than I could have shipped in the same amount of time working alone. But the AI was a fast implementation layer, not a collaborator. It built what I described. When my description was vague, the result was vague. When I was specific, it was fast and accurate.

The parts of this site that will actually get me hired are the project write-ups, the things I learned, the story of what I've built. Those are the parts I still had to write myself.
