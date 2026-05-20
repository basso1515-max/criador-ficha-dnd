export function createDeferredUiController({ renderMagic, updatePreview, afterFlush } = {}) {
  let depth = 0;
  const pending = {
    magic: false,
    preview: false,
  };

  function isDeferring() {
    return depth > 0;
  }

  function defer(key) {
    pending[key] = true;
  }

  function flush() {
    const shouldRenderMagic = pending.magic;
    const shouldUpdatePreview = pending.preview;
    pending.magic = false;
    pending.preview = false;

    if (shouldRenderMagic) {
      renderMagic();
    }

    if (shouldUpdatePreview) {
      updatePreview();
    }

    if ((shouldRenderMagic || shouldUpdatePreview) && typeof afterFlush === "function") {
      afterFlush();
    }
  }

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
