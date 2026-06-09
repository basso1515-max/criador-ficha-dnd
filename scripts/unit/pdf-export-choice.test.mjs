import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizePdfExportChoice, shouldFlattenPdfExport } from '../../src/editors/pdf-export-choice.js';

test('normalizePdfExportChoice maps editable and definitivo preferences', () => {
  assert.equal(normalizePdfExportChoice('editable'), 'editable');
  assert.equal(normalizePdfExportChoice('editável'), 'editable');
  assert.equal(normalizePdfExportChoice('definitivo'), 'definitivo');
  assert.equal(normalizePdfExportChoice('definitive'), 'definitivo');
  assert.equal(normalizePdfExportChoice(undefined, 'editable'), 'editable');
});

test('shouldFlattenPdfExport keeps the current definitive behavior by default', () => {
  assert.equal(shouldFlattenPdfExport('editable'), false);
  assert.equal(shouldFlattenPdfExport('definitivo'), true);
  assert.equal(shouldFlattenPdfExport(undefined), true);
});
