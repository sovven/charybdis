#!/usr/bin/env bash
# Cuts the CC0 Freesound/OpenGameArt recordings in sfx-src/ into the game's sound set in sfx/ (see sfx/CREDITS.md).
# Loops are long beds the engine crossfades itself (so no seam work here); one-shots are trimmed, faded and loudness-matched.
set -e
cd "$(dirname "$0")/.."
S=sfx-src; O=sfx; mkdir -p $O
q(){ ffmpeg -v error -y "$@"; }
# beds: 24s, stereo 32kHz 64kbps
bed(){ q -ss $2 -t 24 -i $S/$1.mp3 -af "highpass=f=${4:-25},afade=t=in:d=0.3,afade=t=out:st=23.7:d=0.3,loudnorm=I=$3:TP=-2:LRA=7" -ar 32000 -ac 2 -b:a 64k $O/$5.mp3; }
bed rain_heavy_long 16 -22 30 rain
bed rain_heavy_loop 0 -26 400 drizzle
bed sea_storm 40 -21 30 sea
bed wind_storm 70 -23 20 wind
# one-shots: mono 32kHz
shot(){ q -ss $2 -t $3 -i $S/$1.mp3 -af "afade=t=in:d=${6:-0.01},afade=t=out:st=$(node -e "console.log(($3)-($5))"):d=$5,loudnorm=I=$4:TP=-1:LRA=11" -ar 32000 -ac 1 -b:a ${7:-56k} $O/$8.mp3; }
shot thunder_short_deep 0.25 6.1 -16 2.0 0.005 64k thunder_near1
shot thunder_strike 0.4 7.0 -15 2.0 0.005 64k thunder_near2
shot thunder_dry 5.6 14 -20 4.0 0.01 56k thunder_mid1
shot thunder11 1.9 4.3 -21 1.5 0.01 56k thunder_mid2
shot thunder_08 2.6 12 -24 4.0 0.3 48k thunder_far1
shot thunder7 1.2 8 -26 3.0 0.3 48k thunder_far2
shot sea_storm 61.5 4.2 -18 1.5 0.05 56k wave_crash
# oar strokes (craigsmith 'Oars Rowing' + kayak in rough water + monosfera river rowing)
i=0
for t in 14.49 15.44 19.44 21.54 22.84 29.29 32.59 36.28 45.0; do i=$((i+1)); shot oar_craigsmith $t 0.75 -18 0.35 0.004 48k oar$i; done
for t in 17.69 26.44 14.69; do i=$((i+1)); shot kayak_rough $t 0.85 -19 0.4 0.004 48k oar$i; done
i=$((i+1)); shot oar_monosfera 12.79 0.8 -19 0.4 0.004 48k oar$i
ls -la $O
