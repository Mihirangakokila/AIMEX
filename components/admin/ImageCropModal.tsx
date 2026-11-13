"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (croppedFile: File, previewUrl: string, ratio: number) => void;
  title?: string;
  defaultAspectRatio?: number;
}

const ASPECT_RATIOS = [
  { label: "16:9", value: 16 / 9 },
  { label: "9:16 (Portrait)", value: 9 / 16 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "1:1", value: 1 },
  { label: "Free", value: 0 },
];

export function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onApply,
  title = "Crop & Fix Photo",
  defaultAspectRatio = 16 / 9,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Photo adjustments
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [saturation, setSaturation] = useState<number>(0); // -100 to 100
  const [activeTab, setActiveTab] = useState<"crop" | "fix">("crop");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imageLoaded = Boolean(imageSrc && loadedSrc === imageSrc);

  // Load image object whenever source changes
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    let active = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!active) return;
      imageObjRef.current = img;
      setLoadedSrc(imageSrc);

      // Detect portrait photo: if height > width, automatically turn thumbnail into 9:16 portrait ratio
      const isPortrait = img.naturalHeight > img.naturalWidth;
      if (isPortrait) {
        setAspectRatio(9 / 16);
      } else {
        setAspectRatio(defaultAspectRatio || 16 / 9);
      }

      // Reset transforms
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
    };
    img.src = imageSrc;

    return () => {
      active = false;
    };
  }, [isOpen, imageSrc, defaultAspectRatio]);

  // Pointer drag handling for pan
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3, Math.max(0.6, prev + delta)));
  };

  // Quick auto-fix
  const handleAutoFix = () => {
    setBrightness(6);
    setContrast(14);
    setSaturation(10);
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
  };

  // Export high-res cropped & fixed canvas
  const handleApply = useCallback(() => {
    const img = imageObjRef.current;
    if (!img) return;

    setIsProcessing(true);

    try {
      const offscreen = document.createElement("canvas");
      // Calculate export resolution
      const targetRatio = aspectRatio === 0 ? img.width / img.height : aspectRatio;
      let exportWidth = 1920;
      let exportHeight = Math.round(exportWidth / targetRatio);

      if (targetRatio < 1) {
        // High resolution vertical portrait standard (e.g. 1080 x 1920 for 9:16)
        exportHeight = 1920;
        exportWidth = Math.round(exportHeight * targetRatio);
      }

      offscreen.width = exportWidth;
      offscreen.height = exportHeight;

      const ctx = offscreen.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D canvas context");

      // Apply photo filters
      const bVal = 100 + brightness;
      const cVal = 100 + contrast;
      const sVal = 100 + saturation;
      ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;

      // Fill background in case of transparent PNG or borders
      ctx.fillStyle = "#04060d";
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Save context for transformations
      ctx.save();

      // Center transformations in the export frame
      ctx.translate(exportWidth / 2, exportHeight / 2);

      // Rotation & Flip
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Base scaling factor from container to export canvas
      const containerW = containerRef.current?.clientWidth || 540;
      const ratioScale = exportWidth / containerW;

      // Fit image inside container base
      const imgAspect = img.width / img.height;
      let baseW = containerW;
      let baseH = containerW / imgAspect;

      if (imgAspect < targetRatio) {
        baseH = containerW / targetRatio;
        baseW = baseH * imgAspect;
      }

      const drawW = baseW * zoom * ratioScale;
      const drawH = baseH * zoom * ratioScale;
      const drawX = pan.x * ratioScale - drawW / 2;
      const drawY = pan.y * ratioScale - drawH / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      offscreen.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) return;

          const file = new File([blob], "thumbnail-fixed.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          const previewUrl = URL.createObjectURL(blob);
          onApply(file, previewUrl, targetRatio);
          onClose();
        },
        "image/jpeg",
        0.92,
      );
    } catch (err) {
      console.error("Crop & fix export failed", err);
      setIsProcessing(false);
    }
  }, [
    aspectRatio,
    brightness,
    contrast,
    saturation,
    zoom,
    pan,
    rotation,
    flipH,
    flipV,
    onApply,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-white/20 bg-[#070b16] text-cream shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold text-xs">
              ✂
            </span>
            <div>
              <h2 className="font-display text-base font-semibold tracking-wide uppercase">
                {title}
              </h2>
              <p className="text-[11px] text-cream/50 tracking-wider">
                Position, crop, adjust lighting, and enhance your photo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-cream/70 hover:border-white/30 hover:text-cream transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Controls: Crop vs Fix */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-2.5 bg-white/[0.01]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("crop")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                activeTab === "crop"
                  ? "bg-gold text-ink font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "text-cream/60 hover:text-cream hover:bg-white/[0.04]"
              }`}
            >
              📐 Crop & Frame
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fix")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                activeTab === "fix"
                  ? "bg-gold text-ink font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                  : "text-cream/60 hover:text-cream hover:bg-white/[0.04]"
              }`}
            >
              ✨ Fix & Lighting
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFix}
              title="Enhance brightness & contrast automatically"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              <span>🪄</span> Auto-Fix
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-cream/60 hover:text-cream transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Interactive Crop Viewport */}
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/60 p-4 overflow-hidden select-none">
            <div
              ref={containerRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing border border-gold/40 shadow-[0_0_24px_rgba(0,240,255,0.1)] touch-none transition-all duration-300"
              style={{
                aspectRatio: aspectRatio === 0 ? "16/9" : `${aspectRatio}`,
                maxWidth: aspectRatio !== 0 && aspectRatio < 1 ? "270px" : "540px",
                maxHeight: aspectRatio !== 0 && aspectRatio < 1 ? "480px" : "330px",
              }}
            >
              {/* Image Preview with Transforms */}
              {imageLoaded && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${
                      flipH ? -1 : 1
                    }) scaleY(${flipV ? -1 : 1})`,
                    filter: `brightness(${100 + brightness}%) contrast(${
                      100 + contrast
                    }%) saturate(${100 + saturation}%)`,
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Crop preview"
                    className="max-w-none w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}

              {/* Rule of Thirds Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-gold/60">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>

              {/* Corner accent handles */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold pointer-events-none" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold pointer-events-none" />
            </div>

            <p className="mt-2 text-[11px] text-cream/40 tracking-wider">
              Drag to position photo · Scroll to zoom
            </p>
          </div>

          {/* Sub-Panel: Crop Controls */}
          {activeTab === "crop" && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div>
                <label className="text-[11px] tracking-[0.2em] text-gold uppercase block mb-2">
                  Aspect Ratio
                </label>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setAspectRatio(item.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        aspectRatio === item.value
                          ? "bg-gold text-ink font-semibold"
                          : "border border-white/15 text-cream/70 hover:border-gold/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] tracking-[0.2em] text-gold uppercase">
                    Zoom ({zoom.toFixed(1)}x)
                  </label>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="text-[11px] text-cream/50 hover:text-cream"
                  >
                    Reset Zoom
                  </button>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                <span className="text-[11px] tracking-[0.2em] text-gold uppercase mr-2">
                  Rotate & Flip:
                </span>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:border-gold transition-colors"
                >
                  ↻ Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((f) => !f)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    flipH ? "border-gold text-gold bg-gold/10" : "border-white/15 text-cream hover:border-gold"
                  }`}
                >
                  ⇄ Flip Horizontally
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV((f) => !f)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    flipV ? "border-gold text-gold bg-gold/10" : "border-white/15 text-cream hover:border-gold"
                  }`}
                >
                  ⇅ Flip Vertically
                </button>
              </div>
            </div>
          )}

          {/* Sub-Panel: Lighting & Fix Controls */}
          {activeTab === "fix" && (
            <div className="grid gap-4 sm:grid-cols-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] tracking-[0.2em] text-gold uppercase">
                    Brightness
                  </span>
                  <span className="text-xs font-mono text-cream/70">
                    {brightness > 0 ? `+${brightness}` : brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] tracking-[0.2em] text-gold uppercase">
                    Contrast
                  </span>
                  <span className="text-xs font-mono text-cream/70">
                    {contrast > 0 ? `+${contrast}` : contrast}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] tracking-[0.2em] text-gold uppercase">
                    Saturation
                  </span>
                  <span className="text-xs font-mono text-cream/70">
                    {saturation > 0 ? `+${saturation}` : saturation}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <div className="sm:col-span-3 flex items-center justify-between pt-2 border-t border-white/10 text-xs text-cream/60">
                <span>Tip: Saturation at -100% creates a sleek studio black & white photo.</span>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(0);
                    setContrast(0);
                    setSaturation(0);
                  }}
                  className="text-gold hover:underline"
                >
                  Reset Lighting
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-5 py-2.5 text-xs tracking-wider uppercase text-cream/70 hover:border-white/30 hover:text-cream transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing || !imageLoaded}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-xs font-semibold tracking-wider text-ink uppercase hover:bg-gold-soft transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin text-xs">⟳</span>
                Processing Photo...
              </>
            ) : (
              <>
                <span>✓</span> Apply & Save Thumbnail
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
