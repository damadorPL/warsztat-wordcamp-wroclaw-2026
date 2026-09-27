#!/usr/bin/env node

/**
 * Walidator layoutu bloków Gutenberga (WordPress Core & WooCommerce)
 * Używany przez agenta AI lub CLI do weryfikacji poprawności wygenerowanego markup'u HTML.
 *
 * Uruchomienie:
 *   node dane/validate-layout.js "<kod-html-blokow>"
 *   node dane/validate-layout.js sciezka/do/pliku.html
 */

const fs = require('node:fs');
const path = require('node:path');
const { parse: wpBlockParser } = require('@wordpress/block-serialization-default-parser');

const CORE_BLOCKS_PATH = path.join(__dirname, 'core-blocks.json');
const WOO_BLOCKS_PATH = path.join(__dirname, 'woocommerce-blocks.json');

let coreBlocks = {};
let wooBlocks = {};

try {
  if (fs.existsSync(CORE_BLOCKS_PATH)) {
    coreBlocks = JSON.parse(fs.readFileSync(CORE_BLOCKS_PATH, 'utf8'));
  }
  if (fs.existsSync(WOO_BLOCKS_PATH)) {
    wooBlocks = JSON.parse(fs.readFileSync(WOO_BLOCKS_PATH, 'utf8'));
  }
} catch (err) {
  console.error(`Błąd wczytywania bazy schematów: ${err.message}`);
}

const allKnownBlocks = { ...coreBlocks, ...wooBlocks };

// Standardowe atrybuty globalne Gutenberga wspierane przez edytor lub wynikające z supports
const GLOBAL_ATTRIBUTES = new Set([
  'className', 'anchor', 'style', 'backgroundColor', 'textColor',
  'gradient', 'fontSize', 'fontFamily', 'align', 'textAlign', 'lock',
  'metadata', 'tagName', 'borderColor', 'layout', 'aspectRatio', 'level'
]);

/**
 * Główna funkcja walidacji layoutu
 * @param {string} markup - ciąg znaków z kodem bloków Gutenberga
 * @returns {object} { valid: boolean, errors: string[], warnings: string[], stats: object, tree: array }
 */
function validateLayout(markup) {
  const errors = [];
  const warnings = [];

  if (!markup || typeof markup !== 'string' || markup.trim().length === 0) {
    return {
      valid: false,
      errors: ['Brak kodu bloków do walidacji (pusty ciąg znaków).'],
      warnings: [],
      stats: { totalBlocks: 0 }
    };
  }

  let parsedBlocks;
  try {
    parsedBlocks = wpBlockParser(markup);
  } catch (err) {
    return {
      valid: false,
      errors: [`Błąd składniowy parsera Gutenberga: ${err.message}`],
      warnings: [],
      stats: { totalBlocks: 0 }
    };
  }

  // Odfiltrowanie bloków pustych/białych znaków
  const realBlocks = parsedBlocks.filter(b => b.blockName !== null);
  const freeform = parsedBlocks.filter(b => b.blockName === null && b.innerHTML && b.innerHTML.trim().length > 0);

  if (realBlocks.length === 0) {
    errors.push('W podanym kodzie nie znaleziono żadnych bloków Gutenberga (brak delimiterów <!-- wp:... -->).');
  }

  if (freeform.length > 0) {
    for (const ff of freeform) {
      warnings.push(`Wykryto kod HTML poza delimiterami bloków (Freeform HTML): "${ff.innerHTML.trim().slice(0, 80)}..."`);
    }
  }

  let blockCounter = 0;

  function traverse(block, parentBlock = null, ancestorBlocks = []) {
    blockCounter++;
    const { blockName, attrs, innerBlocks, innerHTML } = block;

    // 1. Walidacja nazwy bloku
    let canonicalName = blockName;
    if (!canonicalName.includes('/')) {
      warnings.push(`Blok "${blockName}" nie posiada prefiksu przestrzeni nazw — WordPress przyjmie domyślnie "core/${blockName}".`);
      canonicalName = `core/${blockName}`;
    }

    const schema = allKnownBlocks[canonicalName] || allKnownBlocks[blockName];

    if (!schema) {
      warnings.push(`Blok "${blockName}" nie znajduje się w bazie Core ani WooCommerce (może to być blok zewnętrznej wtyczki).`);
    } else {
      // 2. Walidacja reguł rodzica (Parent)
      if (schema.parent && Array.isArray(schema.parent)) {
        if (!parentBlock) {
          errors.push(`Błąd hierarchii: Blok "${blockName}" wymaga rodzica [${schema.parent.join(', ')}], a znajduje się na poziomie głównym.`);
        } else {
          const parentName = parentBlock.blockName;
          const parentCanonical = parentName.includes('/') ? parentName : `core/${parentName}`;
          if (!schema.parent.includes(parentName) && !schema.parent.includes(parentCanonical)) {
            errors.push(`Błąd hierarchii: Blok "${blockName}" może być umieszczony tylko wewnątrz [${schema.parent.join(', ')}], a znajduje się wewnątrz "${parentName}".`);
          }
        }
      }

      // 3. Walidacja reguł przodka (Ancestor)
      if (schema.ancestor && Array.isArray(schema.ancestor)) {
        const ancestorNames = ancestorBlocks.map(a => a.blockName);
        const hasValidAncestor = schema.ancestor.some(req =>
          ancestorNames.includes(req) || ancestorNames.includes(req.replace(/^core\//, ''))
        );
        if (!hasValidAncestor) {
          errors.push(`Błąd przodka: Blok "${blockName}" wymaga przodka z listy [${schema.ancestor.join(', ')}]. Dostępni przodkowie: [${ancestorNames.join(', ') || 'brak'}].`);
        }
      }

      // 4. Walidacja atrybutów
      if (attrs && typeof attrs === 'object') {
        const knownAttrNames = new Set(Object.keys(schema.attributes || {}));
        for (const [attrKey, attrVal] of Object.entries(attrs)) {
          if (!knownAttrNames.has(attrKey) && !GLOBAL_ATTRIBUTES.has(attrKey)) {
            warnings.push(`Blok "${blockName}": Nieznany atrybut "${attrKey}". Sprawdź czy nie jest to halucynacja modelu.`);
          } else if (schema.attributes && schema.attributes[attrKey]) {
            const def = schema.attributes[attrKey];
            if (def.enum && Array.isArray(def.enum) && !def.enum.includes(attrVal)) {
              errors.push(`Blok "${blockName}": Atrybut "${attrKey}" posiada wartość "${attrVal}", dozwolone wartości to: [${def.enum.join(', ')}].`);
            }
          }
        }
      }

      // 5. Walidacja bloków dynamicznych
      if (schema.blockType === 'dynamic') {
        const trimmedHtml = (innerHTML || '').trim();
        if (trimmedHtml.length > 0 && !schema.name.includes('template') && !schema.name.includes('collection')) {
          warnings.push(`Blok dynamiczny "${blockName}" zawiera statyczny kod HTML wewnątrz delimiterów. Bloki dynamiczne są renderowane przez PHP i zazwyczaj powinny mieć postać samozamykającą: <!-- wp:${blockName} {...} /-->`);
        }
      }
    }

    // Rekurencyjna walidacja dzieci
    if (innerBlocks && innerBlocks.length > 0) {
      const nextAncestors = [...ancestorBlocks, block];
      for (const child of innerBlocks) {
        if (child.blockName !== null) {
          traverse(child, block, nextAncestors);
        }
      }
    }
  }

  for (const rootBlock of realBlocks) {
    traverse(rootBlock);
  }

  // Sprawdzenie stylów presetów var:preset|
  const presetRegex = /var:preset\|([a-zA-Z0-9-]+)\|([a-zA-Z0-9-]+)/g;
  let match;
  while ((match = presetRegex.exec(markup)) !== null) {
    const [, group, slug] = match;
    if (slug.includes('_') || /[A-Z]/.test(slug)) {
      warnings.push(`Niewłaściwa konwencja w presecie "${match[0]}": slug "${slug}" powinien być w kebab-case (małe litery z myślnikami).`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalBlocks: blockCounter,
      rootBlocks: realBlocks.length,
      hasFreeform: freeform.length > 0
    }
  };
}

// Obsługa uruchomienia z linii poleceń
if (require.main === module) {
  const arg = process.argv[2];

  if (!arg) {
    console.log(`
Użycie:
  node dane/validate-layout.js "<kod-html-blokow>"
  node dane/validate-layout.js sciezka/do/pliku.html

Przykład testowy:
`);
    // Uruchomienie testowe na poprawnym i błędnym przykładzie
    const testValid = `<!-- wp:core/columns -->
<!-- wp:core/column -->
<!-- wp:core/heading {"level":2} -->
<h2 class="wp-block-heading">Tytuł Sekcji</h2>
<!-- /wp:core/heading -->
<!-- wp:core/paragraph {"fontSize":"medium"} -->
<p class="has-medium-font-size">Opis kolumny</p>
<!-- /wp:core/paragraph -->
<!-- /wp:core/column -->
<!-- wp:core/column -->
<!-- wp:core/image -->
<figure class="wp-block-image"><img src="https://picsum.photos/400/300" alt="Foto"/></figure>
<!-- /wp:core/image -->
<!-- /wp:core/column -->
<!-- /wp:core/columns -->`;

    console.log('--- Test 1: Poprawny layout kolumnowy ---');
    const res1 = validateLayout(testValid);
    console.log(`Wynik: ${res1.valid ? '✅ POPRAWNY' : '❌ BŁĄD'}`);
    console.log(`Statystyki: ${res1.stats.totalBlocks} bloków`);
    if (res1.warnings.length) console.log('Ostrzeżenia:', res1.warnings);

    const testInvalid = `<!-- wp:core/column -->
<p>Kolumna bez nadrzędnego core/columns!</p>
<!-- /wp:core/column -->
<!-- wp:woocommerce/product-price /-->`;

    console.log('\n--- Test 2: Błędny layout (brak rodzica i przodka) ---');
    const res2 = validateLayout(testInvalid);
    console.log(`Wynik: ${res2.valid ? '✅ POPRAWNY' : '❌ BŁĘDY WYKRYTE (zgodnie z oczekiwaniem)'}`);
    console.log('Błędy:');
    res2.errors.forEach(e => console.log(`  - ❌ ${e}`));
    console.log('Ostrzeżenia:');
    res2.warnings.forEach(w => console.log(`  - ⚠️ ${w}`));
    process.exit(0);
  }

  let contentToValidate = arg;
  if (fs.existsSync(arg)) {
    contentToValidate = fs.readFileSync(arg, 'utf8');
  }

  const result = validateLayout(contentToValidate);

  console.log('\n========================================');
  console.log('  RAPORT WALIDACJI LAYOUTU GUTENBERGA   ');
  console.log('========================================');
  console.log(`Status ogólny: ${result.valid ? '✅ PRAWIDŁOWY' : '❌ NIEPRAWIDŁOWY'}`);
  console.log(`Liczba przetworzonych bloków: ${result.stats.totalBlocks}`);

  if (result.errors.length > 0) {
    console.log(`\nBŁĘDY KRYTYCZNE (${result.errors.length}):`);
    result.errors.forEach((err, i) => console.log(`  ${i + 1}. ❌ ${err}`));
  }

  if (result.warnings.length > 0) {
    console.log(`\nOSTRZEŻENIA (${result.warnings.length}):`);
    result.warnings.forEach((warn, i) => console.log(`  ${i + 1}. ⚠️ ${warn}`));
  }

  if (result.valid && result.warnings.length === 0) {
    console.log('\n✨ Layout spełnia wszystkie reguły składniowe i hierarchiczne WordPress/WooCommerce.');
  }

  console.log('========================================\n');
  process.exit(result.valid ? 0 : 1);
}

module.exports = {
  validateLayout,
  allKnownBlocks,
  coreBlocks,
  wooBlocks
};
