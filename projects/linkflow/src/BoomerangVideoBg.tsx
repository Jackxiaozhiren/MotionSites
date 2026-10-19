import { useEffect, useRef, useState } from 'react';
import { useDecorativeMedia } from './useDecorativeMedia';

type Props = { src: string; className?: string };

/** Bounded canvas-frame experiment with a static fallback for reduced motion
 * or unavailable/CORS-blocked third-party video. */
export default function BoomerangVideoBg({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const [framesReady, setFramesReady] = useState(false);
  const { showVideo, onVideoError } = useDecorativeMedia();

  useEffect(() => {
    framesRef.current = [];
    setFramesReady(false);
    const video = videoRef.current;
    if (!showVideo || !video) return;

    let capturing = true;
    let started = false;
    let lastTime = -1;
    let vfcId: number | undefined;
    let rafId: number | undefined;
    const frames: HTMLCanvasElement[] = [];
    const MAX_WIDTH = 480;
    const MAX_FRAMES = 48;
    const MIN_INTERVAL = 1 / 8;

    function stopCapture() {
      if (!capturing) return;
      capturing = false;
      if (frames.length > 1) {
        framesRef.current = frames;
        setFramesReady(true);
        video!.pause();
      }
    }

    function captureFrame() {
      if (!capturing || !video || video.readyState < 2 || !video.videoWidth) return;
      if (lastTime >= 0 && video.currentTime - lastTime < MIN_INTERVAL) return;
      lastTime = video.currentTime;
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
      const width = Math.max(1, Math.round(video.videoWidth * scale));
      const height = Math.max(1, Math.round(video.videoHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      try {
        ctx.drawImage(video, 0, 0, width, height);
        frames.push(canvas);
        if (frames.length >= MAX_FRAMES) stopCapture();
      } catch {
        capturing = false;
        onVideoError();
      }
    }

    function beginCapture() {
      if (started || !capturing) return;
      started = true;
      video!.play().catch(onVideoError);
      function tick() {
        if (!capturing) return;
        captureFrame();
        if (!capturing) return;
        if (typeof video!.requestVideoFrameCallback === 'function') {
          vfcId = video!.requestVideoFrameCallback(tick);
        } else {
          rafId = requestAnimationFrame(tick);
        }
      }
      tick();
    }

    video.addEventListener('loadedmetadata', beginCapture);
    video.addEventListener('ended', stopCapture);
    if (video.readyState >= 1) beginCapture();
    return () => {
      capturing = false;
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      if (vfcId !== undefined && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(vfcId);
      }
      video.removeEventListener('loadedmetadata', beginCapture);
      video.removeEventListener('ended', stopCapture);
      video.pause();
      framesRef.current = [];
    };
  }, [src, showVideo]);

  useEffect(() => {
    if (!framesReady || !showVideo) return;
    const canvas = displayCanvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    let rafId = 0;
    function paint(time: number) {
      if (!document.hidden && time - last >= 1000 / 24) {
        ctx!.drawImage(frames[index], 0, 0);
        index += direction;
        if (index >= frames.length - 1) {
          index = frames.length - 1;
          direction = -1;
        } else if (index <= 0) {
          index = 0;
          direction = 1;
        }
        last = time;
      }
      rafId = requestAnimationFrame(paint);
    }
    rafId = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady, showVideo]);

  return (
    <div className={className ?? 'absolute inset-0 w-full h-full'}
      aria-hidden="true"
      style={{ background: 'linear-gradient(135deg, #131527, #19384a 55%, #101020)' }}>
      {showVideo && (
        <video ref={videoRef} src={src} onError={onVideoError}
          className="w-full h-full object-cover"
          style={{ display: framesReady ? 'none' : 'block' }}
          muted playsInline preload="metadata" crossOrigin="anonymous" />
      )}
      {showVideo && framesReady && (
        <canvas ref={displayCanvasRef} className="w-full h-full object-cover" />
      )}
    </div>
  );
}
