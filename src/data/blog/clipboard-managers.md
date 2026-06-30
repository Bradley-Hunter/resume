---
title: Clipboard Managers and the Problems You Don't Know You Have
date: 2026-03-15
description: How juggling two workflows with one clipboard led me to build a context-aware clipboard manager in Rust.
tags: nib, rust, tools
draft: false
---

I was working on one of my projects in VSCode while also going back and forth with an AI chat in the browser, and I kept running into the same problem. I would copy a bunch of things within VSCode, then switch over to the browser and need to paste something I had saved in my clipboard history. Every single time, I had to open Win+V and scroll all the way down past a wall of recent copies to find the one entry I actually needed. I was juggling two completely separate workflows through a single flat list that had no concept of where anything came from or where it was going, and it was slowing me down constantly.

## What Win+V Gets Wrong

Windows' built-in clipboard history has three problems that compounded on each other for me. The first is that it is a flat chronological list with no filtering. Every copy from every application goes into the same stream, so if I copy ten things in VSCode and then switch to another app, I have to scroll past all ten to find something I copied earlier from somewhere else. There is no way to say "show me only what I copied from Firefox" or "show me only what I copied from VSCode." It is all one undifferentiated list.

The second problem is the history limit. Win+V stores somewhere around twenty five to thirty items, and favorites count against that limit. I had about five favorites pinned, which meant my actual working history was down to twenty or twenty five entries. There were times where I copied something, meant to favorite it so I would not lose it, and then got caught up in work for another twenty or thirty copies before I remembered. By then it was gone, pushed out of the history because the limit is so small and my favorites were already eating into the available space.

The third problem is that there is no real search. I could not just type a word and find the entry I was looking for. I had to visually scan through a short list of truncated previews and hope I recognized what I was looking for by its first few words. When you are moving fast between two different tasks, that kind of friction adds up quickly.

## What If the Clipboard Knew Where You Copied From

After dealing with this for long enough, I started thinking about what a clipboard manager would look like if it actually understood context. The core idea was simple: what if the clipboard knew which application I copied something from, so I could filter my history by source? If I am working in VSCode and I know the thing I need came from Firefox, I should be able to filter to just Firefox entries and find it immediately instead of scrolling through everything.

This is what led me to build Nib. Nib is a clipboard manager I built in Rust using egui for the interface and SQLite for persistent storage, and it ended up being a much larger application than I initially expected, landing at around eight thousand lines of Rust across thirty-plus source files. The core feature is context-awareness: Nib monitors the clipboard using the Win32 API and records which application every copy came from, so when you open it you can toggle between viewing clips from the current app only, all clips, or just your pinned items. Pinned clips show up at their natural position in the timeline rather than being forced to the top, which keeps the chronological flow of your history intact instead of cluttering the top of the list the way Win+V's favorites do.

Beyond the context filtering, I wanted Nib to feel like a complete desktop application rather than a quick utility. It stores all clipboard formats that the source application provides, not just plain text, so if you copy rich text or an image or a file path, Nib preserves the full format and pastes it back faithfully. The entire UI is keyboard-driven with arrow keys for navigation, enter to paste, and escape to dismiss, because the whole point was to move faster than Win+V and reaching for the mouse defeats that purpose. It also has smart popup positioning that tries multiple methods to detect where your text cursor is, starting with the Win32 caret position API and falling back through UI Automation and the Text Services Framework before defaulting to the mouse cursor, so the popup appears right where you are working instead of in a fixed location.

I also built in an auto-updater that checks GitHub Releases daily, downloads updates in the background, and applies them on restart with ed25519 signature verification. There is a system tray icon for quick access, an onboarding wizard for first-time setup, and it even detects copies from password managers like KeePass and 1Password and auto-expires them so sensitive data does not sit in your clipboard history indefinitely. These are the kinds of features that separate a side project from something you actually want to use every day, and since I was building Nib to be my own daily driver, I needed it to handle all of these cases.

I originally wanted to include full text search as well, so I could just type a few words and find what I was looking for, but I had to cut that feature due to styling constraints in egui. The way egui handles layout made it difficult to get a search bar to look right alongside the rounded corners and other visual elements of the app, and after spending time fighting the framework I decided it was better to cut the feature cleanly than to ship something that looked broken.

## How I Built It

Nib was built through guided AI development, which is the process I have settled into for most of my projects at this point. The AI handled the actual coding while I acted as the architect and project manager, making design decisions, reviewing output, and directing the overall approach. This is not the same as just prompting an AI and accepting whatever it generates. It is closer to being a senior developer guiding a junior developer, where I maintained a shared understanding of what we were building and why, and I pushed back or redirected when the AI went in the wrong direction.

The reason I built Nib as a standalone desktop application rather than trying to extend Win+V through a plugin or extension is because the Win32 clipboard API gives you low-level access to clipboard events and formats, but only if you are running your own window and message loop. A Rust application with egui gave me full control over how clipboard data was captured, stored, and displayed, which meant I could store all clipboard formats rather than just plain text, and I could track the source application for every single copy event.

## Fighting Windows for Control of Win+V

The single hardest part of building Nib was overriding the Win+V hotkey. I wanted Nib to completely replace the built-in clipboard history, so pressing Win+V would open Nib instead of the Windows clipboard panel. This turned out to be a much bigger fight than I expected.

The normal approach for registering a hotkey in Windows is through the RegisterHotkey API, but that does not work when the operating system already owns the hotkey. Win+V is claimed by Windows itself, so any attempt to register it through the standard approach just fails silently. The solution we eventually landed on was using a low-level keyboard hook through SetWindowsHookEx, which intercepts key events before the OS processes them, allowing Nib to catch the Win+V combination and handle it before Windows ever sees it.

Getting to that solution was a process. The AI would try an approach, it would fail, and instead of just letting it try the next thing I would stop and ask it to lay out the options, what it thought would work best, and what it thought would not work. From there we would work through them together, with me providing input along the way. If the AI tried something we had already attempted, I would catch it and redirect. If I had done some extra research on my own, either in another chat or through Google, I would bring that back and feed it into the conversation. This back-and-forth went on for two to three days of focused but inconsistent work before we landed on the low-level keyboard hook approach.

Even after finding the right approach, the implementation had its own problems. The hook worked perfectly in the development environment but broke when I built and installed the actual release version. Something about how the application was packaged or how Windows handled the hook registration differently for installed applications meant that the dev fix did not hold up in production. This cycle of finding a fix, testing it in dev, building a release, discovering it was broken, and going back to try again happened multiple times before we had something that worked reliably enough for daily use.

## What Happened After

I used Nib as my daily clipboard manager for a few months after finishing it, and it genuinely solved the problems I built it to solve. Filtering by source application alone saved me a noticeable amount of time when switching between workflows, and the persistent history meant I never lost a copy I needed again.

Then I switched from Windows to Linux, and I no longer had a machine to run Nib on since it was built specifically for Windows using the Win32 API. What I found after switching was that the clipboard manager built into my Linux desktop environment actually handled most of what I wanted out of the box, which rather than making Nib feel like a waste of time honestly just confirmed that the features I had prioritized were the right ones. Persistent history and not losing entries on restart are the things that actually matter in a clipboard manager, and those are exactly the features that other platforms have already figured out should be standard. Windows just has not caught up yet.

Building Nib taught me something about the kind of problems that are worth solving. The best workflow problems to fix are the ones you have gotten so used to working around that you do not even recognize them as problems anymore. I had been using Win+V's limited clipboard history for years and thought it was fine because I did not know what a better clipboard manager could feel like. Once I built one, the difference was obvious.
