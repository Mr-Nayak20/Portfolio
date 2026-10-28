/**
 * CanvasSequencePlayer
 * High-performance canvas frame sequencer optimized for scroll-driven GSAP Scrubbing.
 * Handles HiDPI / Retina scaling, progressive frame caching, and memory-conscious rendering.
 */
export class CanvasSequencePlayer {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement} options.canvas
   * @param {number} options.frameCount
   * @param {function(number): string} options.frameUrlBuilder
   * @param {'cover'|'contain'} [options.fit='contain']
   * @param {number} [options.baseWidth=800]
   * @param {number} [options.baseHeight=800]
   * @param {boolean} [options.autoResize=false] - If true, matches window dimensions
   * @param {function(number, number): void} [options.onProgress]
   */
  constructor({
    canvas,
    frameCount,
    frameUrlBuilder,
    fit = 'contain',
    baseWidth = 800,
    baseHeight = 800,
    autoResize = false,
    onProgress = null
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.frameCount = frameCount;
    this.frameUrlBuilder = frameUrlBuilder;
    this.fit = fit;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.autoResize = autoResize;
    this.onProgress = onProgress;

    this.images = new Array(frameCount);
    this.loadedCount = 0;
    this.currentFrameIndex = 0;
    this.isFirstFrameDrawn = false;

    this.initCanvasSize();
    this.preloadFrames();

    if (this.autoResize) {
      window.addEventListener('resize', () => {
        this.initCanvasSize();
        this.render(this.currentFrameIndex);
      });
    }
  }

  initCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this.autoResize) {
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
    } else {
      this.canvas.width = this.baseWidth * dpr;
      this.canvas.height = this.baseHeight * dpr;
    }
  }

  preloadFrames() {
    // Load frame 0 immediately with priority
    const firstImg = new Image();
    firstImg.src = this.frameUrlBuilder(0);
    this.images[0] = firstImg;
    firstImg.onload = () => {
      this.loadedCount++;
      if (!this.isFirstFrameDrawn) {
        this.render(0);
        this.isFirstFrameDrawn = true;
      }
      if (this.onProgress) {
        this.onProgress(this.loadedCount, this.frameCount);
      }
      this.preloadRemainingFrames();
    };
  }

  preloadRemainingFrames() {
    // Batch load remaining frames
    for (let i = 1; i < this.frameCount; i++) {
      const img = new Image();
      img.src = this.frameUrlBuilder(i);
      this.images[i] = img;
      img.onload = () => {
        this.loadedCount++;
        if (this.onProgress) {
          this.onProgress(this.loadedCount, this.frameCount);
        }
      };
    }
  }

  /**
   * Renders the specified frame index to canvas
   * @param {number} frameIndex
   */
  render(frameIndex) {
    const safeIndex = Math.max(0, Math.min(Math.floor(frameIndex), this.frameCount - 1));
    this.currentFrameIndex = safeIndex;

    const img = this.images[safeIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    let scale;
    if (this.fit === 'cover') {
      scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    } else {
      scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    }

    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
  }
}
