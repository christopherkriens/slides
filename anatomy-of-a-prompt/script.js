// ===== PIE CHART (Section 1) =====
(function () {
  var svg = document.getElementById('pieSvg');
  var legend = document.getElementById('pieLegend');
  var centerLabel = document.getElementById('pieCenterLabel');
  if (!svg || !legend) return;

  var slices = [
    { label: 'Tool definitions', detail: '203 tools', tokens: 9100, color: '#f0a090' },
    { label: 'System prompt', detail: '', tokens: 6900, color: '#4a8fa8' },
    { label: 'Workspace & memory', detail: 'structure, notes, repo facts', tokens: 3800, color: '#7b6eae' },
    { label: 'Conversation summary', detail: '', tokens: 3600, color: '#8896a5' },
    { label: 'Custom instructions', detail: '.github/copilot-instructions.md', tokens: 3000, color: '#e8935a' },
    { label: 'Skills & agents', detail: '11 skills, 6 agents', tokens: 1100, color: '#3a9e7e' },
    { label: 'Your message', detail: '', tokens: 18, color: '#2c3e50' },
  ];

  var total = slices.reduce(function (s, d) { return s + d.tokens; }, 0);
  var cx = 170, cy = 170, r = 140, inner = 80;

  function describeArc(startAngle, endAngle) {
    var s = startAngle, e = endAngle;
    var largeArc = e - s > Math.PI ? 1 : 0;
    var x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    var x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    var ix1 = cx + inner * Math.cos(e), iy1 = cy + inner * Math.sin(e);
    var ix2 = cx + inner * Math.cos(s), iy2 = cy + inner * Math.sin(s);
    return [
      'M', x1, y1,
      'A', r, r, 0, largeArc, 1, x2, y2,
      'L', ix1, iy1,
      'A', inner, inner, 0, largeArc, 0, ix2, iy2,
      'Z'
    ].join(' ');
  }

  var angle = 0;
  var gap = 0.02; // small gap between slices

  slices.forEach(function (slice, i) {
    var sliceAngle = (slice.tokens / total) * (2 * Math.PI) - gap;
    if (sliceAngle < 0.005) sliceAngle = 0.005; // minimum visible size
    var startAngle = angle + gap / 2;
    var endAngle = startAngle + sliceAngle;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', describeArc(startAngle, endAngle));
    path.setAttribute('fill', slice.color);
    path.setAttribute('data-index', i);
    svg.appendChild(path);

    angle += (slice.tokens / total) * (2 * Math.PI);

    // Legend item
    var pct = ((slice.tokens / total) * 100).toFixed(slice.tokens < 100 ? 2 : 1);
    var item = document.createElement('div');
    item.className = 'legend-item';
    item.dataset.index = i;
    item.innerHTML =
      '<span class="legend-swatch" style="background:' + slice.color + '"></span>' +
      '<span class="legend-text">' + slice.label +
        (slice.detail ? ' <span class="legend-detail">' + slice.detail + '</span>' : '') +
      '</span>' +
      '<span class="legend-tokens">~' + slice.tokens.toLocaleString() + '</span>' +
      '<span class="legend-pct">' + pct + '%</span>';
    legend.appendChild(item);
  });

  // Hover interactions
  function highlight(index) {
    svg.querySelectorAll('path').forEach(function (p, i) {
      if (i == index) {
        p.classList.add('pie-highlighted');
      } else {
        p.classList.remove('pie-highlighted');
        p.style.opacity = '0.4';
      }
    });
    legend.querySelectorAll('.legend-item').forEach(function (li, i) {
      li.classList.toggle('legend-active', i == index);
    });
    var s = slices[index];
    var pct = ((s.tokens / total) * 100).toFixed(s.tokens < 100 ? 2 : 1);
    centerLabel.querySelector('.pie-center-value').textContent = '~' + s.tokens.toLocaleString();
    centerLabel.querySelector('.pie-center-sub').textContent = s.label + ' (' + pct + '%)';
  }

  function resetHighlight() {
    svg.querySelectorAll('path').forEach(function (p) {
      p.classList.remove('pie-highlighted');
      p.style.opacity = '';
    });
    legend.querySelectorAll('.legend-item').forEach(function (li) {
      li.classList.remove('legend-active');
    });
    centerLabel.querySelector('.pie-center-value').textContent = '27,612';
    centerLabel.querySelector('.pie-center-sub').textContent = 'total tokens';
  }

  svg.addEventListener('mouseover', function (e) {
    var path = e.target.closest('path');
    if (path) highlight(path.dataset.index);
  });
  svg.addEventListener('mouseout', resetHighlight);

  legend.addEventListener('mouseover', function (e) {
    var item = e.target.closest('.legend-item');
    if (item) highlight(item.dataset.index);
  });
  legend.addEventListener('mouseout', resetHighlight);
})();

// ===== SYSTEM PROMPT PIE CHART (Section 2) =====
(function () {
  var svg = document.getElementById('spPieSvg');
  var legend = document.getElementById('spPieLegend');
  var centerLabel = document.getElementById('spPieCenterLabel');
  if (!svg || !legend) return;

  var slices = [
    { label: 'Tool use instructions', tokens: 1800, color: '#4a8fa8' },
    { label: 'MCP server instructions', tokens: 1400, color: '#7b6eae' },
    { label: 'Agent behavior', tokens: 1100, color: '#e8935a' },
    { label: 'Memory system', tokens: 900, color: '#3a9e7e' },
    { label: 'Security requirements', tokens: 600, color: '#d9534f' },
    { label: 'Operational safety', tokens: 500, color: '#f0a090' },
    { label: 'Identity & base rules', tokens: 350, color: '#8896a5' },
    { label: 'Communication style', tokens: 250, color: '#c4a35a' },
  ];

  var total = slices.reduce(function (s, d) { return s + d.tokens; }, 0);
  var cx = 170, cy = 170, r = 140, inner = 80;

  function describeArc(startAngle, endAngle) {
    var largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    var x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    var x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    var ix1 = cx + inner * Math.cos(endAngle), iy1 = cy + inner * Math.sin(endAngle);
    var ix2 = cx + inner * Math.cos(startAngle), iy2 = cy + inner * Math.sin(startAngle);
    return ['M', x1, y1, 'A', r, r, 0, largeArc, 1, x2, y2,
            'L', ix1, iy1, 'A', inner, inner, 0, largeArc, 0, ix2, iy2, 'Z'].join(' ');
  }

  var angle = 0, gap = 0.02;

  slices.forEach(function (slice, i) {
    var sliceAngle = (slice.tokens / total) * (2 * Math.PI) - gap;
    if (sliceAngle < 0.01) sliceAngle = 0.01;
    var startAngle = angle + gap / 2;
    var endAngle = startAngle + sliceAngle;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', describeArc(startAngle, endAngle));
    path.setAttribute('fill', slice.color);
    path.setAttribute('data-index', i);
    svg.appendChild(path);

    angle += (slice.tokens / total) * (2 * Math.PI);

    var pct = ((slice.tokens / total) * 100).toFixed(1);
    var item = document.createElement('div');
    item.className = 'legend-item';
    item.dataset.index = i;
    item.innerHTML =
      '<span class="legend-swatch" style="background:' + slice.color + '"></span>' +
      '<span class="legend-text">' + slice.label + '</span>' +
      '<span class="legend-tokens">~' + slice.tokens.toLocaleString() + '</span>' +
      '<span class="legend-pct">' + pct + '%</span>';
    legend.appendChild(item);
  });

  function highlight(index) {
    svg.querySelectorAll('path').forEach(function (p, i) {
      if (i == index) { p.classList.add('pie-highlighted'); }
      else { p.classList.remove('pie-highlighted'); p.style.opacity = '0.4'; }
    });
    legend.querySelectorAll('.legend-item').forEach(function (li, i) {
      li.classList.toggle('legend-active', i == index);
    });
    var s = slices[index];
    var pct = ((s.tokens / total) * 100).toFixed(1);
    centerLabel.querySelector('.pie-center-value').textContent = '~' + s.tokens.toLocaleString();
    centerLabel.querySelector('.pie-center-sub').textContent = s.label + ' (' + pct + '%)';
  }

  function resetHighlight() {
    svg.querySelectorAll('path').forEach(function (p) {
      p.classList.remove('pie-highlighted'); p.style.opacity = '';
    });
    legend.querySelectorAll('.legend-item').forEach(function (li) {
      li.classList.remove('legend-active');
    });
    centerLabel.querySelector('.pie-center-value').textContent = '6,900';
    centerLabel.querySelector('.pie-center-sub').textContent = 'system prompt tokens';
  }

  svg.addEventListener('mouseover', function (e) {
    var path = e.target.closest('path');
    if (path) highlight(path.dataset.index);
  });
  svg.addEventListener('mouseout', resetHighlight);
  legend.addEventListener('mouseover', function (e) {
    var item = e.target.closest('.legend-item');
    if (item) highlight(item.dataset.index);
  });
  legend.addEventListener('mouseout', resetHighlight);
})();

// ===== SYSTEM PROMPT ACCORDION (Section 2) =====
(function () {
  var sections = document.querySelectorAll('.sp-section');
  sections.forEach(function (section) {
    var header = section.querySelector('.sp-header');
    header.addEventListener('click', function () {
      var wasOpen = section.classList.contains('open');
      // Close all
      sections.forEach(function (s) { s.classList.remove('open'); });
      // Toggle clicked
      if (!wasOpen) section.classList.add('open');
    });
  });
})();

// ===== ICEBERG REVEAL (Section 1 - legacy, kept if element exists) =====
(function () {
  const btn = document.getElementById('btnRevealIceberg');
  const layers = document.querySelectorAll('#icebergBelow .layer-hidden');
  const tokenValue = document.getElementById('tokenValue');
  const tokenNote = document.getElementById('tokenNote');
  let revealed = false;

  if (!btn) return;

  btn.addEventListener('click', function () {
    if (revealed) return;
    revealed = true;
    btn.textContent = 'Full prompt revealed';
    btn.classList.add('done');

    let runningTotal = 50;
    layers.forEach(function (layer, i) {
      const delay = (i + 1) * 300;
      const tokens = parseInt(layer.dataset.tokens.replace(/[^0-9]/g, '')) || 0;

      setTimeout(function () {
        layer.classList.add('revealed');
        runningTotal += tokens;
        tokenValue.textContent = '~' + runningTotal.toLocaleString();
        document.querySelector('.token-note').textContent =
          'total sent to the LLM';
        if (runningTotal > 3000) {
          tokenValue.classList.add('high');
        }
      }, delay);
    });
  });
})();

// ===== SHARED: step-through animation helper =====
function makeStepThrough(config) {
  var btn = document.getElementById(config.nextBtn);
  var resetBtn = document.getElementById(config.resetBtn);
  var indicator = document.getElementById(config.indicator);
  if (!btn) return;

  var step = -1;
  var steps = config.steps;
  var total = steps.length;

  function updateIndicator() {
    if (step < 0) {
      indicator.textContent = '';
      btn.textContent = 'Next';
    } else if (step >= total) {
      indicator.textContent = step + ' / ' + total;
      btn.textContent = 'Done';
    } else {
      indicator.textContent = (step + 1) + ' / ' + total;
      btn.textContent = step < total - 1 ? 'Next' : 'Next';
    }
  }

  function reset() {
    step = -1;
    config.reset();
    updateIndicator();
  }

  btn.addEventListener('click', function () {
    if (step >= total - 1) return;
    step++;
    steps[step]();
    updateIndicator();
    if (step >= total - 1) {
      btn.textContent = 'Done';
      btn.classList.add('done');
    }
  });

  resetBtn.addEventListener('click', function () {
    btn.classList.remove('done');
    reset();
  });

  reset();
}

// ===== SHARED: typeWriter =====
function typeWriter(el, text, speed, cb) {
  var i = 0;
  el.innerHTML = '<span class="instr-response-cursor"></span>';
  function type() {
    if (i < text.length) {
      el.innerHTML = text.substring(0, i + 1) + '<span class="instr-response-cursor"></span>';
      i++;
      setTimeout(type, speed);
    } else {
      el.innerHTML = text;
      if (cb) cb();
    }
  }
  type();
}

// ===== INSTRUCTIONS ANIMATION (Section 3) =====
(function () {
  var phase1 = document.getElementById('instrPhase1');
  var phase2 = document.getElementById('instrPhase2');
  var phase3 = document.getElementById('instrPhase3');
  var conn1 = document.getElementById('instrConn1');
  var conn2 = document.getElementById('instrConn2');
  var responseText = document.getElementById('instrResponseText');
  var responseMeta = document.getElementById('instrResponseMeta');
  var files = [
    { el: document.getElementById('instrFile1'), name: 'copilot-instructions.md', tokens: 3000, cls: '' },
    { el: document.getElementById('instrFile2'), name: 'react-conventions', tokens: 500, cls: 'instr-arrived-conditional' },
  ];
  var slot = document.getElementById('slot-instructions');
  var slotTokens = document.getElementById('instrSlotTokens');
  var totalEl = document.getElementById('instrPromptTotal');
  var baseTokens = 24512;
  var runningTokens = 0;

  makeStepThrough({
    nextBtn: 'btnBuildPrompt',
    resetBtn: 'btnResetInstr',
    indicator: 'instrStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, conn1, conn2].forEach(function (el) { el.classList.remove('visible'); });
      files.forEach(function (f) { f.el.classList.remove('flying', 'landed'); });
      slot.classList.remove('receiving', 'received');
      slot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      slotTokens.textContent = 'empty';
      totalEl.textContent = '~' + baseTokens.toLocaleString() + ' tokens';
      totalEl.classList.remove('updated');
      responseText.innerHTML = '';
      responseMeta.textContent = '';
      runningTokens = 0;
    },
    steps: [
      // 1: Show user message
      function () { phase1.classList.add('visible'); },
      // 2: Show assembly + start receiving
      function () { conn1.classList.add('visible'); phase2.classList.add('visible'); slot.classList.add('receiving'); },
      // 3: File 1 flies in
      function () {
        var f = files[0]; f.el.classList.add('flying');
        setTimeout(function () {
          f.el.classList.remove('flying'); f.el.classList.add('landed');
          var m = document.createElement('div'); m.className = 'instr-arrived ' + f.cls;
          m.textContent = f.name;
          slot.insertBefore(m, slotTokens);
          runningTokens += f.tokens; slotTokens.textContent = '~' + runningTokens.toLocaleString();
          totalEl.textContent = '~' + (baseTokens + runningTokens).toLocaleString() + ' tokens';
          totalEl.classList.add('updated');
        }, 500);
      },
      // 4: File 2 flies in, assembly done
      function () {
        var f = files[1]; f.el.classList.add('flying');
        setTimeout(function () {
          f.el.classList.remove('flying'); f.el.classList.add('landed');
          var m = document.createElement('div'); m.className = 'instr-arrived ' + f.cls;
          m.textContent = f.name;
          slot.insertBefore(m, slotTokens);
          runningTokens += f.tokens; slotTokens.textContent = '~' + runningTokens.toLocaleString();
          totalEl.textContent = '~' + (baseTokens + runningTokens).toLocaleString() + ' tokens';
          slot.classList.remove('receiving'); slot.classList.add('received');
        }, 500);
      },
      // 6: Response
      function () {
        conn2.classList.add('visible');
        phase3.classList.add('visible');
        typeWriter(responseText, 'I\'ll add a loading spinner using your Tailwind CSS conventions and React functional component pattern with named exports, following your project structure...', 20, function () {
          responseMeta.textContent = '321 completion tokens \u2022 15s round trip \u2022 shaped by your instructions';
        });
      },
    ],
  });
})();

// ===== PROMPT FILES ANIMATION (Section 4) =====
(function () {
  var phase1 = document.getElementById('pfPhase1');
  var phase2 = document.getElementById('pfPhase2');
  var phase3 = document.getElementById('pfPhase3');
  var conn1 = document.getElementById('pfConn1');
  var conn2 = document.getElementById('pfConn2');
  var responseText = document.getElementById('pfResponseText');
  var responseMeta = document.getElementById('pfResponseMeta');
  var pf = { el: document.getElementById('pfFile1'), name: 'react-component.prompt.md', tokens: 200 };
  var slot = document.getElementById('slot-promptfile');
  var slotTokens = document.getElementById('pfSlotTokens');
  var totalEl = document.getElementById('pfPromptTotal');
  var baseTokens = 27530;

  makeStepThrough({
    nextBtn: 'btnBuildPromptFile',
    resetBtn: 'btnResetPf',
    indicator: 'pfStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, conn1, conn2].forEach(function (el) { el.classList.remove('visible'); });
      pf.el.classList.remove('flying', 'landed');
      slot.classList.remove('receiving', 'received');
      slot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      slotTokens.textContent = 'empty';
      totalEl.textContent = '~' + baseTokens.toLocaleString() + ' tokens';
      totalEl.classList.remove('updated');
      responseText.innerHTML = '';
      responseMeta.textContent = '';
    },
    steps: [
      // 1: User invokes prompt file
      function () { phase1.classList.add('visible'); },
      // 2: Show prompt file + empty assembled prompt
      function () {
        conn1.classList.add('visible');
        phase2.classList.add('visible');
      },
      // 3: Prompt file flies into assembled prompt
      function () {
        slot.classList.add('receiving');
        pf.el.classList.add('flying');
        setTimeout(function () {
          pf.el.classList.remove('flying'); pf.el.classList.add('landed');
          var m = document.createElement('div'); m.className = 'instr-arrived instr-arrived-prompt';
          m.textContent = pf.name;
          slot.insertBefore(m, slotTokens);
          slotTokens.textContent = '~' + pf.tokens;
          totalEl.textContent = '~' + (baseTokens + pf.tokens).toLocaleString() + ' tokens';
          totalEl.classList.add('updated');
          slot.classList.remove('receiving'); slot.classList.add('received');
        }, 500);
      },
      // 4: Response
      function () {
        conn2.classList.add('visible');
        phase3.classList.add('visible');
        typeWriter(responseText, 'I\'ll create DataTable.tsx in src/components with proper TypeScript props, a test file, and a Storybook story following your team\'s conventions...', 20, function () {
          responseMeta.textContent = 'Prompt file resolved \u2192 variables filled \u2192 injected into prompt \u2192 all on-demand';
        });
      },
    ],
  });
})();

// ===== SKILLS ANIMATION (Section 5) =====
(function () {
  var phase1 = document.getElementById('skPhase1');
  var phase2 = document.getElementById('skPhase2');
  var phase3 = document.getElementById('skPhase3');
  var conn1 = document.getElementById('skConn1');
  var conn2 = document.getElementById('skConn2');
  var decision = document.getElementById('skDecision');
  var decisionAction = document.getElementById('skDecisionAction');
  var roundtripBanner = document.getElementById('skRoundtripLabel');
  var skAnim2 = document.getElementById('skAnim2');
  var fms = [document.getElementById('skFm1'), document.getElementById('skFm2'), document.getElementById('skFm3')];
  var boxes = [document.getElementById('skBox1'), document.getElementById('skBox2'), document.getElementById('skBox3')];
  var listingSlot = document.getElementById('slot-skill-listing');
  var listingTokens = document.getElementById('skListingTokens');
  var fullBox = document.getElementById('skBoxFull');
  var slot = document.getElementById('slot-skill');
  var slotTokens = document.getElementById('skSlotTokens');
  var totalEl = document.getElementById('skPromptTotal');
  var responseText = document.getElementById('skResponseText');
  var responseMeta = document.getElementById('skResponseMeta');
  var baseTokens = 27515;
  var fmNames = ['migrate-api', 'component-gen', 'pr-review'];

  makeStepThrough({
    nextBtn: 'btnBuildSkill',
    resetBtn: 'btnResetSkill',
    indicator: 'skStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, conn1, conn2].forEach(function (el) { el.classList.remove('visible'); });
      decision.classList.remove('visible');
      roundtripBanner.classList.remove('visible');
      skAnim2.classList.remove('visible');
      decisionAction.textContent = '';
      fms.forEach(function (fm) { fm.classList.remove('flying', 'extracted'); });
      boxes.forEach(function (b) { b.classList.remove('dimmed'); });
      fullBox.classList.remove('flying', 'landed');
      listingSlot.classList.remove('receiving', 'received');
      slot.classList.remove('receiving', 'received');
      listingSlot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      listingTokens.textContent = 'empty';
      slot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      slotTokens.textContent = 'empty';
      totalEl.textContent = '~' + baseTokens.toLocaleString() + ' tokens';
      totalEl.classList.remove('updated');
      responseText.innerHTML = '';
      responseMeta.textContent = '';
    },
    steps: [
      // 1: User message
      function () { phase1.classList.add('visible'); },
      // 2: Show skill boxes + empty assembled prompt (pause here for explanation)
      function () {
        conn1.classList.add('visible'); phase2.classList.add('visible');
      },
      // 3: Extract frontmatter into skill listings slot
      function () {
        listingSlot.classList.add('receiving');
        fms.forEach(function (fm, i) {
          setTimeout(function () {
            fm.classList.add('flying');
            setTimeout(function () {
              var m = document.createElement('div'); m.className = 'instr-arrived instr-arrived-prompt';
              m.textContent = fmNames[i]; listingSlot.insertBefore(m, listingTokens);
              listingTokens.textContent = '~' + ((i + 1) * 70);
              fm.classList.remove('flying');
              fm.classList.add('extracted');
              if (i === fms.length - 1) {
                listingSlot.classList.remove('receiving'); listingSlot.classList.add('received');
              }
            }, 500);
          }, i * 500);
        });
      },
      // 4: Model decision + tool call
      function () {
        decision.classList.add('visible');
        decisionAction.textContent = '\u2192 read_file(".github/copilot/skills/migrate-api/SKILL.md")';
      },
      // 4: Round trip banner
      function () { roundtripBanner.classList.add('visible'); },
      // 5: Second assembled prompt + full skill flies in
      function () {
        skAnim2.classList.add('visible');
        slot.classList.add('receiving');
        fullBox.classList.add('flying');
        setTimeout(function () {
          fullBox.classList.remove('flying'); fullBox.classList.add('landed');
          boxes[0].classList.add('dimmed');
          var m = document.createElement('div'); m.className = 'instr-arrived instr-arrived-prompt';
          m.textContent = 'Full SKILL.md'; slot.insertBefore(m, slotTokens);
          slotTokens.textContent = '~400';
          totalEl.textContent = '~' + (baseTokens + 400).toLocaleString() + ' tokens';
          totalEl.classList.add('updated');
          slot.classList.remove('receiving'); slot.classList.add('received');
        }, 600);
      },
      // 6: Response
      function () {
        conn2.classList.add('visible');
        phase3.classList.add('visible');
        typeWriter(responseText, 'I\'ll migrate /api/patients to GraphQL. Reading the existing REST handler, creating a resolver, adding the schema type, and wrapping it for backward compatibility...', 20, function () {
          responseMeta.textContent = '2 LLM round trips \u2022 auto-discovered \u2022 no manual invocation needed';
        });
      },
    ],
  });
})();

// ===== AGENTS ANIMATION (Section 6) =====
(function () {
  var phase1 = document.getElementById('agPhase1');
  var phase2 = document.getElementById('agPhase2');
  var phase3 = document.getElementById('agPhase3');
  var conn1 = document.getElementById('agConn1');
  var conn2 = document.getElementById('agConn2');
  var fullBox = document.getElementById('agBoxFull');
  var toolSlot = document.getElementById('slot-agent-tools');
  var slot = document.getElementById('slot-agent');
  var slotTokens = document.getElementById('agSlotTokens');
  var totalEl = document.getElementById('agPromptTotal');
  var responseText = document.getElementById('agResponseText');
  var responseMeta = document.getElementById('agResponseMeta');
  var baseTokens = 12450;

  makeStepThrough({
    nextBtn: 'btnBuildAgent',
    resetBtn: 'btnResetAgent',
    indicator: 'agStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, conn1, conn2].forEach(function (el) { el.classList.remove('visible'); });
      fullBox.classList.remove('flying', 'landed');
      slot.classList.remove('receiving', 'received');
      toolSlot.classList.remove('received');
      slot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      slotTokens.textContent = 'empty';
      totalEl.textContent = '~' + baseTokens.toLocaleString() + ' tokens';
      totalEl.classList.remove('updated');
      responseText.innerHTML = '';
      responseMeta.textContent = '';
    },
    steps: [
      // 1: User invokes
      function () { phase1.classList.add('visible'); },
      // 2: Show agent file + empty assembled prompt
      function () {
        conn1.classList.add('visible'); phase2.classList.add('visible');
      },
      // 3: Agent file flies into its conversation, tool slot highlights
      function () {
        slot.classList.add('receiving');
        toolSlot.classList.add('received');
        fullBox.classList.add('flying');
        setTimeout(function () {
          fullBox.classList.remove('flying'); fullBox.classList.add('landed');
          var m = document.createElement('div'); m.className = 'instr-arrived instr-arrived-user';
          m.textContent = 'security-reviewer';
          var persona = slotTokens.parentNode;
          persona.insertBefore(m, slotTokens);
          slotTokens.textContent = '~600';
          totalEl.textContent = '~' + (baseTokens + 600).toLocaleString() + ' tokens';
          totalEl.classList.add('updated');
          slot.classList.remove('receiving'); slot.classList.add('received');
        }, 600);
      },
      // 3: Agent responds
      function () {
        conn2.classList.add('visible');
        phase3.classList.add('visible');
        typeWriter(responseText, 'As a senior security engineer reviewing login.ts: I found 2 issues. CRITICAL \u2014 JWT secret hardcoded on line 14 (move to env var). HIGH \u2014 no rate limiting on login attempts, vulnerable to credential stuffing...', 20, function () {
          responseMeta.textContent = 'Scoped tools only \u2022 isolated context \u2022 separate conversation from the main agent';
        });
      },
    ],
  });
})();

// ===== HOOKS ANIMATION (Section 6) =====
(function () {
  var phase1 = document.getElementById('hkPhase1');
  var phase2 = document.getElementById('hkPhase2');
  var phase3 = document.getElementById('hkPhase3');
  var phase4 = document.getElementById('hkPhase4');
  var phase5 = document.getElementById('hkPhase5');
  var conn1 = document.getElementById('hkConn1');
  var conn2 = document.getElementById('hkConn2');
  var conn3 = document.getElementById('hkConn3');
  var conn4 = document.getElementById('hkConn4');
  var gate = document.getElementById('hkGate');
  var gateIcon = document.getElementById('hkGateIcon');
  var gateStatus = document.getElementById('hkGateStatus');

  makeStepThrough({
    nextBtn: 'btnBuildHook',
    resetBtn: 'btnResetHook',
    indicator: 'hkStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, phase4, phase5, conn1, conn2, conn3, conn4].forEach(function (el) {
        el.classList.remove('visible');
      });
      gate.classList.remove('hook-gate-blocked');
      gateIcon.textContent = '?';
      gateStatus.textContent = 'Evaluating\u2026';
    },
    steps: [
      // 1: Model wants to act
      function () { phase1.classList.add('visible'); },
      // 2: preToolUse hook fires
      function () { conn1.classList.add('visible'); phase2.classList.add('visible'); },
      // 3: Hook blocks
      function () {
        gate.classList.add('hook-gate-blocked');
        gateIcon.textContent = '\u2717';
        gateStatus.textContent = 'Blocked \u2014 protected file';
        conn2.classList.add('visible');
        phase3.classList.add('visible');
      },
      // 4: Model retries, hook approves
      function () { conn3.classList.add('visible'); phase4.classList.add('visible'); },
      // 5: postToolUse logs
      function () { conn4.classList.add('visible'); phase5.classList.add('visible'); },
    ],
  });
})();

// ===== SLOT INFO TOOLTIPS =====
(function () {
  var activeTooltip = null;

  function closeActive() {
    if (activeTooltip) {
      activeTooltip.classList.remove('open');
      activeTooltip = null;
    }
  }

  document.querySelectorAll('.slot-info-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var tooltip = document.getElementById(btn.dataset.tooltip);
      if (!tooltip) return;

      if (activeTooltip === tooltip) {
        closeActive();
      } else {
        closeActive();
        tooltip.classList.add('open');
        activeTooltip = tooltip;
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (activeTooltip && !activeTooltip.contains(e.target) && !e.target.classList.contains('slot-info-btn')) {
      closeActive();
    }
  });
})();

// ===== MCP ANIMATION (Section 8) =====
(function () {
  var phase1 = document.getElementById('mcpPhase1');
  var phase2 = document.getElementById('mcpPhase2');
  var phase3 = document.getElementById('mcpPhase3');
  var conn1 = document.getElementById('mcpConn1');
  var conn2 = document.getElementById('mcpConn2');
  var slot = document.getElementById('slot-mcp');
  var slotTokens = document.getElementById('mcpSlotTokens');
  var totalEl = document.getElementById('mcpPromptTotal');
  var responseText = document.getElementById('mcpResponseText');
  var responseMeta = document.getElementById('mcpResponseMeta');
  var mcpBoxes = [document.getElementById('mcpBox1'), document.getElementById('mcpBox2'), document.getElementById('mcpBox3'), document.getElementById('mcpBox4')];
  var baseTokens = 19712;
  var mcpNames = ['Atlassian', 'GitHub', 'Figma', 'Slack'];
  var mcpTokens = [1400, 1900, 750, 550];

  makeStepThrough({
    nextBtn: 'btnBuildMcp',
    resetBtn: 'btnResetMcp',
    indicator: 'mcpStepIndicator',
    reset: function () {
      [phase1, phase2, phase3, conn1, conn2].forEach(function (el) { el.classList.remove('visible'); });
      mcpBoxes.forEach(function (b) { b.classList.remove('dimmed'); });
      slot.classList.remove('receiving', 'received');
      slot.querySelectorAll('.instr-arrived').forEach(function (a) { a.remove(); });
      slotTokens.textContent = 'empty';
      totalEl.textContent = '~' + baseTokens.toLocaleString() + ' tokens';
      totalEl.classList.remove('updated');
      responseText.innerHTML = '';
      responseMeta.textContent = '';
    },
    steps: [
      // 1: User message
      function () { phase1.classList.add('visible'); },
      // 2: Show MCP server boxes + assembled prompt
      function () { conn1.classList.add('visible'); phase2.classList.add('visible'); },
      // 3: All tool schemas fly into slot
      function () {
        slot.classList.add('receiving');
        var runningTokens = 0;
        mcpBoxes.forEach(function (box, i) {
          setTimeout(function () {
            box.classList.add('dimmed');
            var m = document.createElement('div'); m.className = 'instr-arrived';
            m.style.background = 'rgba(239,68,68,0.1)';
            m.style.borderColor = 'rgba(239,68,68,0.25)';
            m.style.color = '#ef4444';
            m.textContent = mcpNames[i];
            slot.insertBefore(m, slotTokens);
            runningTokens += mcpTokens[i];
            slotTokens.textContent = '~' + runningTokens.toLocaleString();
            totalEl.textContent = '~' + (baseTokens + runningTokens).toLocaleString() + ' tokens';
            totalEl.classList.add('updated');
            if (i === mcpBoxes.length - 1) {
              slot.classList.remove('receiving'); slot.classList.add('received');
            }
          }, i * 400);
        });
      },
      // 4: Response
      function () {
        conn2.classList.add('visible');
        phase3.classList.add('visible');
        typeWriter(responseText, 'I\'ll create a Jira ticket for this bug.', 20, function () {
          responseMeta.textContent = '\u2192 mcp_atlassian_createJiraIssue({ projectKey: "ENG", issueType: "Bug", summary: "..." })    \u2022    1 of 106 tools used';
        });
      },
    ],
  });
})();

// ===== PROMPT BUILDER (Section 8) =====
(function () {
  var controls = document.querySelectorAll('.builder-toggle');
  var blocks = document.querySelectorAll('.prompt-block');
  var fill = document.getElementById('builderFill');
  var totalEl = document.getElementById('builderTotal');
  var maxTokens = 200000;

  var tokenMap = {
    system: 1500,
    instructions: 400,
    mcp: 2000,
    agent: 600,
    promptfile: 300,
    history: 800,
    user: 50,
  };

  function update() {
    var sum = 0;

    controls.forEach(function (toggle) {
      var layer = toggle.dataset.layer;
      var input = toggle.querySelector('input');
      var active = input.checked;

      if (active) {
        toggle.classList.add('on');
        sum += tokenMap[layer] || 0;
      } else {
        toggle.classList.remove('on');
      }

      // Show/hide corresponding block
      blocks.forEach(function (block) {
        if (block.dataset.layer === layer) {
          if (active) {
            block.classList.remove('hidden');
          } else {
            block.classList.add('hidden');
          }
        }
      });
    });

    var pct = Math.min((sum / maxTokens) * 100, 100);
    fill.style.width = pct + '%';
    totalEl.textContent = sum.toLocaleString();
  }

  controls.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var input = toggle.querySelector('input');
      if (input.disabled) return;
      input.checked = !input.checked;
      update();
    });
  });

  update();
})();

// ===== DECISION TREE (Section 9) =====
(function () {
  var tree = document.getElementById('decisionTree');
  if (!tree) return;

  tree.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-target]');
    if (!btn) return;

    var targetId = btn.dataset.target;
    var nodes = tree.querySelectorAll('.dt-node');

    nodes.forEach(function (node) {
      node.classList.add('dt-hidden');
    });

    var target = document.getElementById(targetId);
    if (target) {
      target.classList.remove('dt-hidden');
    }
  });
})();
