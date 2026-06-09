---
title: Using Godot as a Thin Client for a Rust ECS Game
date: 2026-06-09
description: How I split my metroidvania between Godot for rendering and a Rust ECS for all game logic, connected by a mediator bridge.
tags: rust, game-dev, ashes-at-the-crossroads
featured: true
---

I'm building a metroidvania called Ashes at the Crossroads. It's a shapeshifting game set in Greco-Roman mythology with parry-focused combat, and one of its defining characteristics is that the player switches between three combat forms that each play fundamentally differently. When I started looking at how to build it, I ran into a problem that took me a while to understand: no single game engine gave me everything I needed, and the things each engine was missing were not things I could compromise on.

This post is about the architecture I ended up with, why I chose it, and what it has cost me. The short version is that Godot handles everything the player sees and hears, a Rust ECS handles all of the game logic, and a bridge layer connects the two by passing messages back and forth. Godot doesn't make decisions. The ECS doesn't draw anything. Each side does what it's good at.

## The Problem With Choosing One

To understand why I ended up with this architecture, it helps to understand what the two main options were and where each one fell short.

The first option was Bevy, a game engine written entirely in Rust. Bevy uses an architecture called ECS, which stands for Entity Component System. In ECS, instead of building a player character as a single object with methods, you build it as an entity with interchangeable parts attached to it: health, mana, attack data, movement speed, and so on. For a shapeshifting game, this is a natural fit, because switching from one form to another means swapping out the components on the player entity. Remove the base form attack data and parry ability, attach the wolf form's claw attacks and dash. The combat systems don't need to know what form you're in because they just read whatever components are there.

Bevy also gave me Rust end-to-end, which matters to me as a solo developer. Rust's compiler catches entire categories of bugs at compile time rather than at runtime. If I change a combat state enum from three variants to four, the compiler tells me every place in the codebase that doesn't handle the new variant. With no QA team, that kind of safety net is not a luxury. I also have a shipped Rust crate on crates.io, a RON schema validator, that plugs directly into a Rust project for validating game data files.

The problem with Bevy is everything that isn't code. Bevy has no visual editor. Want to place an enemy in a room? Write coordinates. Want to adjust an animation? Change numbers, recompile, run the game, check it, adjust, recompile again. There are no built-in tilemap tools, which is a real cost for a game with hand-crafted biomes where every room is designed by hand. And compile times in Rust are not fast. When you're trying to tune a parry window, trying to make 133 milliseconds of timing feel right to a player, every second spent waiting for a compile is a second you're not feeling the game. Bevy is also pre-1.0 with breaking changes between versions, which means community plugins that work today might not work after the next update.

The second option was Godot, a general-purpose game engine with its own scripting language called GDScript. Godot has everything Bevy doesn't: a full visual editor with an inspector panel, tilemap tools for building levels visually, an animation timeline where you can see and adjust hitbox timing, and a two-second launch time from code change to running game. For a parry-focused game that needs hundreds of hours of feel tuning, near-instant iteration is fundamental, not a convenience.

The problem with Godot is that I would lose Rust entirely. GDScript is dynamically typed, which means the safety net of Rust's compiler disappears. Typos become runtime errors. I would also lose the ECS architecture that makes shapeshifting elegant, because Godot uses a hierarchical node tree with inheritance rather than composable components. And I would lose my RON data pipeline and the schema validator crate I built, because there would be no Rust code to use them with.

Both engines solved half the problem perfectly and ignored the other half. I spent days going back and forth before I realized I was asking the wrong question. The question wasn't Bevy or Godot. It was whether I could use both.

## The Third Option

The answer turned out to be a Rust binding for Godot called gdext. It lets you write Rust code that runs inside Godot's runtime. You keep Godot's editor, tools, animation system, and export pipeline, and your game logic is written in Rust instead of GDScript. This is not theoretical. People ship production code with gdext. It's actively maintained.

But just writing Rust inside Godot doesn't preserve the ECS architecture. Godot still uses nodes and scenes, not entities and components. My architecture documents, which represented somewhere between 250 and 500 hours of AI-assisted design work compressed into the first three to four weeks of the project, would still need heavy translation. So I went one step further. I'm running a lightweight Rust ECS called hecs inside Godot. It handles all game logic through components, systems, queries, and events, which are the same patterns my architecture documents describe. Godot handles rendering, physics, input detection, and the visual editor.

The result is a split where the ECS is the brain and Godot is the body. The ECS decides what happens: how much damage an attack deals, whether a parry was timed correctly, when an enemy should change behavior, how much mana the player earns from a hit. Godot handles what the player sees and hears: sprites, animations, particle effects, camera movement, sound effects, the HUD. A bridge layer sits between them and translates in both directions. Godot collects input and physics events and sends them to the ECS as messages. The ECS processes those messages, runs game logic, and sends commands back to Godot telling it what to display.

Godot doesn't know why it's playing an animation or shaking the camera. It just does what the commands say.

## How the Bridge Works

The bridge is a single Godot node called GameBridge, implemented in Rust through gdext. Every physics frame, it runs a four-phase loop in fixed order: collect, tick, dispatch, sync.

In the collect phase, the bridge gathers everything that happened on Godot's side since the last frame. It polls the input system and translates button presses into messages like AttackPressed or MoveAxis. It drains a signal buffer where Godot nodes have been depositing physics collision results, animation completion events, and UI signals throughout the frame. It also reads entity positions from Godot's physics engine so the ECS knows where everything is in the world.

In the tick phase, the bridge hands all of those inbound messages to the ECS and lets it run. The ECS systems read the messages, update game state, run combat logic, process AI decisions, and generate a queue of outbound commands describing what Godot should do in response. The tick phase is gated by a tick controller that handles game states like hitstop, slow motion, and pause. During hitstop, which is the brief freeze that happens on a big hit to sell the impact, the ECS tick is skipped entirely and the timer counts down until normal play resumes. During pause, only UI input passes through.

In the dispatch phase, the bridge reads the outbound command queue and executes each command against Godot's scene tree. Commands are sorted by priority: time control first, then entity spawning and despawning, then state updates like position and health, then effects like animations and sound, and finally UI updates. A dedup pass runs before dispatch to handle cases where multiple systems wrote to the same entity in the same frame. For position and animation commands, only the last one for each entity is kept. For hitstop and camera shake, the strongest value wins.

In the sync phase, the bridge cleans up entity lifecycle. When an ECS entity is despawned, the corresponding Godot node gets queued for removal, but Godot doesn't free it instantly. The sync phase checks whether pending removals have completed and cleans up the mappings between ECS entities and Godot nodes.

To make this concrete, here is what happens when the player presses the attack button. Godot detects the button press. The collector translates it into an AttackPressed message. The ECS combat system picks it up: can the player act right now? Are they locked into another animation, staggered, or mid-heal? If they're free, the system locks them into an attack. The player is now committed and can't cancel, dodge, or parry until the attack finishes. After the startup frames, the ECS creates a hitbox. The bridge tells Godot to spawn a collision shape at the right position. Godot's physics engine detects the overlap between the hitbox and an enemy's hurtbox, and that collision signal comes back through the bridge. The ECS runs the damage math: the enemy had 30 HP, takes 4 damage, now has 26. The player generates 6 mana from the hit because mana comes from combat, not pickups. The ECS decides the hit deserves a 50-millisecond hitstop, a camera shake, knockback, hit sparks, a hit sound, and a hit reaction animation. All of those decisions become eight commands in the outbound queue, dispatched in priority order. Godot executes every one of them. It doesn't know it's a boar, doesn't know the hit dealt 4 damage, and doesn't know why the camera is shaking. It just does what the commands say.

Every number in that sequence, the 4 damage, the 6 mana, the 50-millisecond hitstop, the knockback force, lives in an external RON data file. Change the number, the behavior changes. No recompiling. No animation editing. A modder could do the same thing. And the game logic, the combat system, the damage math, the mana generation, is pure Rust that I can write automated tests for without Godot even being open.

## Drawing the Line

One decision that took real thought was figuring out where to draw the boundary between Rust and GDScript. The principle I settled on is simple: if it makes decisions, it's Rust. If it follows orders and calls Godot APIs, it's GDScript.

The ECS and the bridge infrastructure, the collector, the command pipeline, the entity map, the tick controller, are all Rust. That's where type safety, testability, and ownership semantics earn their keep. But there are things on Godot's side that would gain nothing from being written in Rust. The music manager is two audio players with crossfade logic through Godot's tween system. The ECS sends a PlayMusic command, the music manager plays the track. It doesn't decide what to play or when. Writing that in Rust through gdext would mean 40 to 60 lines of binding boilerplate for something that's 5 lines of GDScript.

The same applies to camera zone tracking, dialogue typewriter rendering, menu navigation, screen fade transitions, and reactive VFX like leaves scattering when the player runs past. These are all command executors that receive instructions from the ECS and call Godot APIs to carry them out. They make no gameplay decisions and no state flows back to the ECS from them except completion signals. Writing them in Rust wouldn't move them into the ECS or make them part of the command pipeline. They would be Rust code pretending to be GDScript, paying the gdext binding tax for no benefit.

An important constraint is that no behavioral value is hardcoded in GDScript. Every value that controls visual or audio behavior, crossfade duration, typewriter speed, camera lerp rate, fade curves, comes from the ECS through bridge commands or from RON config files loaded at startup. The GDScript reads parameters. It doesn't define them. This preserves the data-driven architecture that makes the game moddable by default.

## The Honest Cost

This approach has real costs that I don't want to gloss over. The bridge itself is infrastructure that pure Godot doesn't need. The minimum viable bridge is around 300 lines of Rust, and it grows alongside game features as new command types are added. After walking through 15 features end-to-end, the command enum has 56 outbound variants and about 23 inbound message types. The bridge infrastructure, the collector, tick controller, dispatcher, and entity map, is a fixed cost that doesn't grow much, but the command vocabulary grows with every feature.

It's also a novel approach. Not many people are running a Rust ECS inside Godot. There is less community guidance, fewer tutorials, and more "figure it out yourself" than there would be with either engine alone. I'm a second-class citizen in a GDScript-first ecosystem.

And there's the risk that the architecture becomes the project. If I spend months building bridge infrastructure and never build the game on top of it, I've just made another stalled project with better engineering. I have four of those already. Every one of them died at the same point: the gap between "I have an idea" and "I have a character on a screen." The architecture phase where you're building infrastructure and nothing visible is happening.

So I set a guard rail. Character on screen in two months. Not a finished game, not a demo. A character walking in a room, through the bridge, with input going through the ECS and commands coming back. If the bridge starts growing faster than game features, I reassess. The architecture serves the game. The moment it becomes the game, something is wrong.

I'll also be honest about why I chose this path despite the costs. I know from those four stalled projects that I stall when the work stops being interesting. The ECS bridge architecture is the kind of work I show up for daily. Building clean systems, solving hard design problems, making things compose elegantly. If I were writing GDScript, the technically faster path, I'd be fighting the language instead of enjoying the work. And fighting your tools is how my projects stall. The most likely path to a shipped game is the one I'll actually keep working on.

## Where It Stands

Layer 0 of a six-layer architecture is most of the way done. The bridge scaffold is built with all four phases running. The collector polls input and drains the signal buffer. The dispatcher executes commands against the scene tree. The entity map tracks the bidirectional relationship between ECS entities and Godot nodes. RON config loading works with a generic loader that panics on bad data in development and falls back to defaults in release. App state management, pixel-perfect viewport scaling, camera follow with smoothing and dead zones, and structured logging are all in place.

What's left in Layer 0 is debug tooling and verification: an overlay showing bridge state, an FPS counter, a frame budget bar, performance spike detection, and the final verification that a test sprite actually moves on screen with working input and camera tracking. After that, Layer 1 is player movement, room transitions, and collision, which is where a character walking in a room actually happens.

The bridge infrastructure took about a week of implementation to reach this point. The design work behind it took significantly longer, but that design work would have been necessary regardless of which engine I chose. The bridge-specific tax, the code that pure Godot wouldn't need, has been modest so far. Whether that holds as features get more complex is something I'll find out when combat and enemy AI come online in Layers 2 and 3.

The destination hasn't changed since I started this project. A shapeshifting metroidvania with parry-focused combat set in a world where mythology is alive. The engine decision was about finding the vehicle most likely to get there, and for how my brain works, this is it.
