# OpusSkate — Concrete Jungle

A single-file C++ street skateboarding game set on an early-2000s New York City: storefronts,
brownstone stoops, a plaza fountain, the basketball cage, a construction site and the East River.
The avenue and cross streets run for 400 m in each direction before a **ROAD BLOCKED** construction
blockade stops you; the city keeps going behind it. Skate spots are everywhere: ledges, rails, stairs,
gaps, manual pads, banks, quarter pipes, planters, benches, dumpsters, flatbars and a few skate lots
tucked between the buildings. Press **Tab** for a map.
Everything is generated in code — geometry, materials, sky, sound effects and music. No asset files.

## Graphics

A modern HDR renderer built for high-end GPUs (it scales down to older hardware with the quality presets):

- Physically based shading (GGX) with procedural bump detail on brick, pavers, asphalt, sidewalk and wood
- Furnished rooms behind every window (interior mapping): apartments, offices and stocked shops
- Every storefront is a real modelled interior seen through reflective glass: diner counters, grocery
  aisles, salon chairs, record bins, laundromat machines, a skate shop, pawn shop and a bank with teller windows
- Textured models: stitched denim, jersey knit with a printed tee, canvas caps, suede and rubber shoes,
  strand-lit hair, pored skin, feathered pigeons, grip tape and deck graphics, and cars with metallic
  flake paint, shut lines, road grime, licence plates and treaded tyres — all procedural, in object space,
  so the cloth and paint stay on the model as it moves
- Cascaded shadow maps with PCSS contact-hardening soft shadows
- Screen-space ambient occlusion and screen-space reflections (glass, car paint, wet streets, puddles)
- Atmospheric-scattering sky with moving clouds, stars and a moon; planar reflections on the river
- Ray-marched volumetric fog with sun shafts and glowing street lamps
- Up to 48 dynamic lights: street lamps, shop windows, stoop lamps, traffic signals, car headlights
- Rain with wet, reflective streets and rippling puddles
- Bloom, ACES filmic tone mapping, camera motion blur, supersampling / FXAA, film grain

**Time of day:** Golden Hour, Midday, Sunset, Night, Rainy Night (press **N** in game, or use the menu).

**Graphics presets:** Low, Medium, High, Ultra (press **G** in game, or use the menu). Ultra supersamples
up to 2×2 and is meant for cards like an RTX 4090/5090; High runs at native resolution.

## Controls

| Keyboard | Gamepad | Action |
|---|---|---|
| W / Up | Stick / D-pad up | Push |
| S / Down | Stick / D-pad down | Brake |
| A D / Left Right | Stick / D-pad | Steer, spin in the air, balance on rails |
| Space (hold, release) | A | Ollie (hold longer = higher) |
| J or Z + direction | X | Flip tricks |
| K or X + direction | B | Grabs (hold; let go before landing) |
| L or C + direction | Y | Grind / slide near rails, ledges, benches, curbs |
| I or Shift | LB / RB | Manual (hold W for a nose manual) — links combos |
| Esc | Start | Menu |
| V | Back | Camera |
| N / G | | Time of day / graphics preset |
| Tab | | Map |
| H, R, T, M, F11 | | Help, reset, 2-minute session, music, fullscreen |

Settings and best scores are saved automatically (in your user app-data folder).

## Build

The game needs a C++17 compiler, SDL2 and OpenGL 3.3.

### Windows

Easiest: open the **Actions** tab of this repository, pick the latest successful **Build** run and
download the `ConcreteJungle-windows-x64` artifact. Unzip it and run `skate.exe` (keep `SDL2.dll` next to it).

To build it yourself with [MSYS2](https://www.msys2.org/) (UCRT64 shell):

```
pacman -S mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-SDL2
g++ -O2 -std=c++17 skate.cpp -o skate.exe -lmingw32 -lSDL2main -lSDL2 -lopengl32 -mwindows
```

Copy `SDL2.dll` from `C:\msys64\ucrt64\bin` next to `skate.exe` if you run it outside the MSYS2 shell.

### Linux

```
sudo apt install libsdl2-dev
g++ -O2 -std=c++17 skate.cpp -o skate $(sdl2-config --cflags --libs) -lGL
```

### macOS

```
brew install sdl2
clang++ -O2 -std=c++17 skate.cpp -o skate $(sdl2-config --cflags --libs) -framework OpenGL
```

## Command line

```
skate [--fullscreen | --window] [--res 1920x1080] [--quality 0-3] [--tod 0-4] [--scale S] [--mute]
```

`--quality` picks Low/Medium/High/Ultra, `--tod` the time of day, `--scale` forces the internal
render scale (for example `2` for 2×2 supersampling).
