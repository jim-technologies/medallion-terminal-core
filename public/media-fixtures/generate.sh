#!/bin/sh
# Run through the repository Flox environment; generated content is synthetic.
set -eu

if [ "$#" -gt 1 ]; then
  echo 'usage: sh generate.sh [output-directory]' >&2
  exit 2
fi
case "$(ffmpeg -version)" in
  'ffmpeg version 8.1.1 '*) ;;
  *) echo 'ffmpeg 8.1.1 from the pinned Flox environment is required' >&2; exit 2 ;;
esac
source_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
fixture_dir="${1:-$source_dir}"
mkdir -p "$fixture_dir"
fixture_dir="$(CDPATH= cd -- "$fixture_dir" && pwd)"
if [ "$source_dir" != "$fixture_dir" ]; then
  cp "$source_dir/manifest.json" "$fixture_dir/manifest.json"
fi
cd "$fixture_dir"

media_ffmpeg() {
  ffmpeg -hide_banner -loglevel error -nostdin -y -filter_threads 1 -filter_complex_threads 1 "$@"
}

media_ffmpeg -f lavfi -i 'testsrc2=size=160x90:rate=20:duration=4' \
  -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' \
  -map_metadata -1 -c:v libvpx-vp9 -threads 1 -deadline good -cpu-used 4 \
  -b:v 220k -minrate 220k -maxrate 220k -bufsize 440k -g 20 \
  -c:a libopus -b:a 24k -shortest clip.webm
media_ffmpeg -f lavfi -i 'testsrc2=size=160x90:rate=20:duration=4' \
  -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' \
  -map_metadata -1 -c:v libx264 -threads 1 -preset veryfast -profile:v baseline \
  -pix_fmt yuv420p -crf 22 -g 20 -c:a aac -b:a 32k -movflags +faststart -shortest clip-h264.mp4
media_ffmpeg -i clip-h264.mp4 -map_metadata -1 -c copy clip-tail.mp4
media_ffmpeg -f lavfi -i 'testsrc2=size=160x90:rate=20:duration=4' \
  -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' \
  -map_metadata -1 -c:v libx265 -threads 1 -preset ultrafast -crf 28 \
  -x265-params 'pools=none:frame-threads=1:log-level=error:keyint=20' \
  -tag:v hvc1 -pix_fmt yuv420p -c:a aac -b:a 32k -movflags +faststart -shortest clip-hevc.mp4
media_ffmpeg -i clip-h264.mp4 -map_metadata -1 -c copy clip.mkv
media_ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' -map_metadata -1 -c:a libopus -b:a 24k tone.opus.ogg
media_ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' -map_metadata -1 -c:a flac tone.flac
media_ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' -map_metadata -1 -c:a pcm_s16le tone.wav
media_ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=4' -map_metadata -1 -c:a libmp3lame -b:a 32k tone.mp3
media_ffmpeg -f lavfi -i 'testsrc2=size=64x64:rate=1:duration=1' -frames:v 1 \
  -map_metadata -1 -c:v libaom-av1 -threads 1 -cpu-used 8 -still-picture 1 -crf 30 pixel.avif

python3 - <<'PY'
import hashlib
import json
import struct
import subprocess
from pathlib import Path

root = Path.cwd()
content = b'BT /F1 12 Tf 24 60 Td (Synthetic media fixture) Tj ET'
objects = [
    b'<< /Type /Catalog /Pages 2 0 R >>',
    b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 240 100] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    b'<< /Length ' + str(len(content)).encode() + b' >>\nstream\n' + content + b'\nendstream',
]
pdf = bytearray(b'%PDF-1.4\n')
offsets = [0]
for number, body in enumerate(objects, 1):
    offsets.append(len(pdf))
    pdf.extend(f'{number} 0 obj\n'.encode() + body + b'\nendobj\n')
xref = len(pdf)
pdf.extend(f'xref\n0 {len(offsets)}\n0000000000 65535 f \n'.encode())
for offset in offsets[1:]:
    pdf.extend(f'{offset:010d} 00000 n \n'.encode())
pdf.extend(f'trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
(root / 'sample.pdf').write_bytes(pdf)

def atoms(path):
    data = path.read_bytes()
    names = []
    at = 0
    while at + 8 <= len(data):
        size, kind = struct.unpack('>I4s', data[at:at + 8])
        if size < 8:
            raise ValueError('unexpected fixture MP4 atom')
        names.append(kind.decode('ascii'))
        at += size
    return names

report = []
for item in json.loads((root / 'manifest.json').read_text()):
    path = root / item['name']
    body = path.read_bytes()
    if not 0 < len(body) < 150_000:
        raise ValueError(f'{path.name} must be below 150000 bytes, got {len(body)}')
    row = {'name': path.name, 'bytes': len(body), 'sha256': hashlib.sha256(body).hexdigest()}
    if 'duration' in item:
        probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))
        row['duration'] = float(probe['format']['duration'])
        row['codecs'] = [stream['codec_name'] for stream in probe['streams']]
        if abs(row['duration'] - item['duration']) > 0.25:
            raise ValueError(f'{path.name} has unexpected duration')
    report.append(row)
if (root / 'clip.webm').stat().st_size <= 65_536:
    raise ValueError('WebM must span two 64KiB chunks for the seek regression')
for filename, fast in [('clip-h264.mp4', True), ('clip-tail.mp4', False)]:
    kinds = atoms(root / filename)
    if (kinds.index('moov') < kinds.index('mdat')) != fast:
        raise ValueError(f'{filename} has incorrect moov placement')
(root / 'generated.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
PY
