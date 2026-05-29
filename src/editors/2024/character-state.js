// @ts-check

/** @typedef {"magic" | "preview"} DeferredUiKey2024 */
/**
 * @typedef {object} DeferredUiControllerOptions2024
 * @property {() => void} [renderMagic]
 * @property {() => void} [updatePreview]
 * @property {() => void} [afterFlush]
 */

/**
 * @param {DeferredUiControllerOptions2024} [options]
 */
export function createDeferredUiController({ renderMagic, updatePreview, afterFlush } = {}) {
  const renderMagicCallback = renderMagic || noop;
  const updatePreviewCallback = updatePreview || noop;
  let depth = 0;
  /** @type {Record<DeferredUiKey2024, boolean>} */
  const pending = {
    magic: false,
    preview: false,
  };

  function isDeferring() {
    return depth > 0;
  }

  /**
   * @param {DeferredUiKey2024} key
   */
  function defer(key) {
    pending[key] = true;
  }

  function flush() {
    const shouldRenderMagic = pending.magic;
    const shouldUpdatePreview = pending.preview;
    pending.magic = false;
    pending.preview = false;

    if (shouldRenderMagic) {
      renderMagicCallback();
    }

    if (shouldUpdatePreview) {
      updatePreviewCallback();
    }

    if ((shouldRenderMagic || shouldUpdatePreview) && typeof afterFlush === "function") {
      afterFlush();
    }
  }

  /**
   * @template T
   * @param {() => T} task
   * @returns {T}
   */
  function withDeferred(task) {
    depth += 1;
    try {
      return task();
    } finally {
      depth -= 1;
      if (!depth) {
        flush();
      }
    }
  }

  return {
    defer,
    isDeferring,
    withDeferred,
  };
}

function noop() {}
