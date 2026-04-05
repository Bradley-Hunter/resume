---
title: From Inklings to Design Docs with AI
date: 2026-03-29
description: How I use AI as a planning partner to turn half-formed project ideas into real design documents before writing any code.
tags: dev, ideas-repo
draft: false
---

I have a repo with no code in it. No source files, no tests, no CI config, no package manifests. It holds project ideas, design documents, architecture decisions, and developer profiles. Four projects live there now, ranging from a handful of docs to over a dozen each. None of them started as more than a sentence in my head.

This post is about how those sentences became real plans, and what AI actually did and didn't do in that process.

## The project that almost wasn't

About a year ago I tried to build a metroidvania. I'd been playing Hollow Knight and wanted to make something in that space. I opened Godot, started prototyping movement and physics, and immediately hit friction. The double jump didn't feel right. The physics weren't behaving the way I wanted. I spent my time fighting the engine instead of designing the game.

But the deeper problem wasn't Godot. It was that I had no idea what I was building. No story. No world structure. No plan for what the player could do beyond move and jump. I was prototyping toward nothing, and the general dissatisfaction with the engine gave me an easy excuse to stop. I abandoned it.

The idea never fully went away. It resurfaced last week, and this time I had a completely different foundation to start from.

## Building confidence through smaller projects

Over the past few months I'd used Claude to plan three other projects: Codex (an offline Android ePub reader), a single-player card game, and a RON schema validator. Each one started the same way. I showed up with a rough idea and left with design documents detailed enough to build from.

The ePub reader was the first. I knew I wanted a book reader that opened files fast, worked offline, and handled the messy fan fiction ePubs that other readers choke on. That was the extent of it. Through conversation with Claude, that turned into a stack comparison document evaluating three different frameworks, an SRS, an SDD, and 15 design documents covering everything from the caching pipeline to touch gesture handling to generated book covers. The project went from "I want a fast reader" to a buildable spec.

The card game and the RON validator followed the same pattern. Start with a concept, talk through it, end up with something concrete.

This is what gave me the confidence to revisit the metroidvania. Not confidence that AI would do the work for me, but confidence that I wouldn't get disheartened by the sheer volume of things I'd need to research and think through to plan a game. I'd seen the process work three times. I knew I could sit down with a vague idea and come out the other side with real documents.

## Starting the metroidvania for real

I opened a conversation and said I wanted to add an independent project idea. A metroidvania inspired by Hollow Knight, Hollow Knight: Silksong, Nine Sols, Bo: Path of the Teal Lotus, and Dead Cells. That was my entire starting input.

Claude started by generating overview documents comparing game frameworks and art styles. I evaluated those, made my picks, and then we moved to story and world design. This is where things started moving fast.

I mentioned early on that I wanted a story inspired by Percy Jackson, set in Greco-Roman mythology. I wanted shapeshifting to be a core mechanic. We landed on a child of Hecate as the protagonist, which fit both the mythology angle and the shapeshifting abilities. From there, ideas started pouring out. Some were mine, some were Claude's suggestions that I reacted to. The useful part wasn't that AI had better ideas than me. It was that I had something to respond to instead of staring at a blank page trying to pull a fully formed concept out of thin air.

## The pushback that made it better

Not everything I wanted made it into the design. Early on I said I wanted procedurally generated biomes. Claude pushed back hard on this. It pointed out that procedural generation fundamentally conflicts with the hand-crafted world design that defines the metroidvania genre. Dead Cells was on my inspiration list, but Dead Cells is a roguelite first and a metroidvania second. Procedural biomes would undermine the exploration, the sense of place, the interconnected shortcuts that make a metroidvania feel like a metroidvania.

I didn't drop the idea entirely. I liked the unpredictability that procedural generation creates. So I came back with a compromise: hand-crafted biomes connected by procedurally generated labyrinths. The biomes themselves would be designed, but the routes between them would shift.

Claude built on that immediately. It suggested that each biome should have a shortcut that unlocks after you successfully cross the labyrinth for the first time, giving you faster passage on return trips. That preserves the metroidvania structure, where unlocking new routes is the reward for exploration, while still incorporating the procedural variety I wanted.

The final design was better than either of our starting positions. I wouldn't have arrived at it alone, and Claude wouldn't have proposed it without me insisting that some element of procedural generation belonged in the game. This is what AI planning actually looks like. Not "AI writes my design docs." A conversation where both sides contribute, push back, and build on each other.

## Clarifying what I actually mean

The other side of working with AI is the miscommunication. Sometimes I'd describe something I wanted and Claude would interpret it differently than I intended. Other times it would agree too quickly with a surface-level version of my idea without digging into what I actually meant.

I had to re-explain things. Go back over decisions. Say "that's not what I meant, here's what I'm actually thinking" and walk through it again until the document reflected my intent, not Claude's first interpretation of my intent. This happened more than once across every project. AI is fast at generating structured output, but speed doesn't help if the output captures the wrong thing.

## The quality gate problem

This connects to the biggest recurring issue. Claude would write a design document and move on, treating it as done, when the document didn't actually capture what we'd discussed. Thin docs that skimmed over decisions we'd spent real time talking through. Key details dropped. Nuance flattened into generic statements.

I had to pull it back repeatedly. Go back to this section. That's not what I said. Confirm this with me before you move on. This happened on every project, not just the metroidvania. The AI is fast, but it doesn't hold itself to the standard you need unless you hold it there. If I'd accepted the first draft every time, I'd have a repo full of documents that looked complete but weren't.

The planning process only works if you treat AI output as a first draft, not a finished product. Every document in my repo went through at least one round of "no, go back, that's not right." Most went through several.

## What I ended up with

The metroidvania now has 16 design documents organized across five categories: architecture, player mechanics, story, game systems, and world design. Combat, healing, powers and abilities, narrative tone, death and save systems, economy, map design, modifiers, UI, world structure, and a full first biome breakdown with enemies.

Across all four projects in the repo, there are over 40 design documents. Each one came from a conversation that started with me knowing what I wanted at a high level and not knowing how to structure it, research it, or think through the edge cases.

## What actually changed

The difference between the metroidvania I abandoned a year ago and the one I'm preparing to build now is not the tools. It's that I showed up to write code last time and showed up to plan this time.

AI didn't give me ideas I wouldn't have had. The Greco-Roman mythology, the shapeshifting, the inspiration games, those were all mine. What AI did was make the planning phase fast enough that I didn't lose momentum before reaching implementation. It filled the gap between having a creative vision and knowing enough about game design, system architecture, and format specifications to turn that vision into something I can actually build.

Without AI, the research alone would have stalled me. I would have needed to figure out how metroidvania world design works, how combat systems balance, how save systems interact with procedural content, how to structure a game economy. Not the code. The design. That's the part where AI made the difference. It brought the domain knowledge I didn't have and let me focus on the creative decisions that only I could make.

The repo still has no code in it. That's the point. When I do start writing code, I'll know exactly what I'm building.
