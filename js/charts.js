/* ============================================================
   CHARTS.JS — Gráficos Plotly do site de Estatística (ODS 18)
   Todos os gráficos são construídos a partir de window.EST_DATA
   (js/data.js). Paleta extraída da colagem de Silent Hill:
   ferrugem = pessoas pretas ou pardas, osso/musgo = pessoas brancas,
   azul-fantasma = medidas derivadas (diferença, média).
   ============================================================ */
(function () {
  'use strict';

  var D = window.EST_DATA;
  if (!D) return;

  /* ----------------------------------------------------------
     0. PALETA E CONFIGURAÇÃO (espelha css/style.css)
  ---------------------------------------------------------- */
  var C = {
    B:      '#B7C0A8',   /* Branca — osso/musgo claro (realce do papel e do texto na colagem) */
    P:      '#D2704B',   /* Preta ou parda — ferrugem (único tom quente da colagem, iluminado) */
    deep:   '#A8644A',   /* ferrugem escuro (segunda categoria de pessoas pretas/pardas) */
    old:    '#8B6050',   /* ferrugem apagado (dado de 2016) */
    dim:    '#E39A7B',
    moss:   '#6F7A6B',   /* musgo cinzento */
    ghost:  '#A9C2C6',   /* azul-fantasma das mãos da colagem (medidas derivadas) */
    soft:   '#A9C2C6',
    ink:    '#DDD9C8',
    inkDim: '#A3AA98',
    dark:   '#0a0d0c',
    axis:   'rgba(163,170,152,0.40)',
    grid:   'rgba(163,170,152,0.13)',
    card:   '#131a18'
  };
  var FONT = 'JetBrains Mono, monospace';
  var CFG = { displayModeBar: false, responsive: true, doubleClick: 'reset' };
  var GROUPS = [D.B, D.P];
  var COLOR = {}; COLOR[D.B] = C.B; COLOR[D.P] = C.P;

  /* ----------------------------------------------------------
     1. UTILIDADES
  ---------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function r(v, d) { var f = Math.pow(10, d); return Math.round(v * f) / f; }
  function fmt(v, d) { return r(v, d).toFixed(d).replace('.', ','); }
  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function sampleVar(a) { var m = mean(a); return a.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / (a.length - 1); }
  function sd(a) { return Math.sqrt(sampleVar(a)); }
  function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function range(a) { return Math.max.apply(null, a) - Math.min.apply(null, a); }

  function yearTicks() {
    var narrow = window.innerWidth < 600;
    return D.YEARS.map(function (y) { return narrow ? "'" + String(y).slice(2) : String(y); });
  }

  function baseLayout(extra) {
    var lay = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 44, r: 18, t: 18, b: 40 },
      font: { family: FONT, color: C.inkDim, size: 11 },
      separators: ',.',
      hoverlabel: { bgcolor: '#0a0d0c', bordercolor: '#5a6a60', font: { family: FONT, color: C.ink, size: 11 } },
      showlegend: true,
      legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.16, yanchor: 'top', font: { size: 11, color: C.ink } },
      dragmode: false
    };
    return Object.assign(lay, extra || {});
  }

  function axis(opts) {
    return Object.assign({
      zeroline: false, gridcolor: C.grid, gridwidth: 1, linecolor: C.axis, showline: false,
      tickfont: { size: 11, color: C.inkDim }, fixedrange: true, tickangle: 0
    }, opts || {});
  }

  /* "Dados do gráfico": tabela recolhível com os números exatos */
  function dataTable(slot, head, rows) {
    var el = document.querySelector('[data-slot="' + slot + '"]');
    if (!el) return;
    var h = '<details class="data-details"><summary>Ver dados do gráfico</summary><div class="table-wrap"><table class="data-table data-table--compact"><thead><tr>' +
      head.map(function (t) { return '<th>' + t + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></details>';
    el.innerHTML = h;
  }

  /* ----------------------------------------------------------
     2. HERO — frequência líquida no ensino médio
  ---------------------------------------------------------- */
  function plotHero() {
    var s = D.series.medio;
    var traces = GROUPS.map(function (g) {
      return { x: D.YEARS, y: s[g], name: g, mode: 'lines+markers', line: { color: COLOR[g], width: 2.5 },
               marker: { size: 7, color: COLOR[g], line: { color: C.card, width: 1.5 } },
               hovertemplate: g + '<br>%{x}: %{y:.1f}%<extra></extra>' };
    });
    Plotly.newPlot('plotHero', traces, baseLayout({
      xaxis: axis({ tickvals: D.YEARS, ticktext: yearTicks(), range: [2014.8, 2025.9] }),
      yaxis: axis({ range: [55, 90], ticksuffix: '%' }),
      margin: { l: 44, r: 16, t: 58, b: 40 },
      legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.18, font: { size: 10.5, color: C.ink } }
    }), CFG);
  }

  /* ----------------------------------------------------------
     3. CENSO 2022 — rosca
  ---------------------------------------------------------- */
  function plotCenso() {
    var cs = D.censo;
    var colors = [C.B, C.P, C.deep, C.moss];
    var custom = cs.labels.map(function (_, i) { return cs.milhoes[i] ? fmt(cs.milhoes[i], 1) + ' milhões de pessoas' : (i === 3 ? 'complemento até 100%' : ''); });
    var trace = {
      type: 'pie', hole: 0.55, labels: cs.labels, values: cs.pct, sort: false, direction: 'clockwise', rotation: 60,
      marker: { colors: colors, line: { color: C.card, width: 2 } },
      texttemplate: '%{value:.1f}%', textposition: cs.pct.map(function (v) { return v > 20 ? 'inside' : 'outside'; }),
      textfont: { family: FONT, size: 12, color: [C.dark, C.dark, '#F3EEDC', C.dark] },
      customdata: custom, pull: [0, 0, 0, 0],
      hovertemplate: '<b>%{label}</b><br>%{value:.1f}%<br>%{customdata}<extra></extra>'
    };
    var lay = baseLayout({
      margin: { l: 20, r: 20, t: 16, b: 52 },
      annotations: [{ x: 0.5, y: 0.5, xref: 'paper', yref: 'paper', showarrow: false, align: 'center',
                      text: '<b style="font-size:22px">55,5%</b><br>pretos ou pardos', font: { family: FONT, size: 11, color: C.ink } }]
    });
    Plotly.newPlot('plotCenso', [trace], lay, CFG);
    var div = $('plotCenso');
    var pulled = -1;
    div.on('plotly_click', function (ev) {
      var i = ev.points[0].pointNumber;
      pulled = pulled === i ? -1 : i;
      Plotly.restyle(div, { pull: [cs.labels.map(function (_, k) { return k === pulled ? 0.08 : 0; })] });
      $('cap-censo').textContent = pulled < 0 ? 'Pretos e pardos somam 55,5%; brancos, 43,5%.'
        : cs.labels[pulled] + ': ' + fmt(cs.pct[pulled], 1) + '%' + (custom[pulled] ? ' (' + custom[pulled] + ')' : '') + '.';
    });
    dataTable('censo', ['Categoria', '%', 'Pessoas'], cs.labels.map(function (l, i) {
      return [l, fmt(cs.pct[i], 1), cs.milhoes[i] ? fmt(cs.milhoes[i], 1) + ' milhões' : '—'];
    }));
    var n = document.createElement('p'); n.className = 'chart-frame__caption chart-frame__caption--note'; n.textContent = cs.nota;
    var slot = document.querySelector('[data-slot="censo"]'); if (slot) slot.appendChild(n);
  }

  /* ----------------------------------------------------------
     4. SÉRIES TEMPORAIS (gráficos 1, 2 e 4) com modos
        taxa · diferença (p.p.) · razão
  ---------------------------------------------------------- */
  var SERIES_META = {
    analf15: { div: 'plotAnalf15', cap: 'cap-analf15', hi: D.P, lo: D.B, yMax: 11, tick: '%' },
    analf60: { div: 'plotAnalf60', cap: 'cap-analf60', hi: D.P, lo: D.B, yMax: 35, tick: '%' },
    medio:   { div: 'plotMedio',   cap: 'cap-medio',   hi: D.B, lo: D.P, yMin: 55, yMax: 90, tick: '%' }
  };

  function derived(key) {
    var m = SERIES_META[key], s = D.series[key];
    var dif = D.YEARS.map(function (_, i) { return r(s[m.hi][i] - s[m.lo][i], 2); });
    var raz = D.YEARS.map(function (_, i) { return r(s[m.hi][i] / s[m.lo][i], 2); });
    return { dif: dif, raz: raz };
  }

  function plotSeries(key, mode) {
    var m = SERIES_META[key], s = D.series[key], dv = derived(key), last = D.YEARS.length - 1;
    var traces, lay, cap;
    var xa = axis({ tickvals: D.YEARS, ticktext: yearTicks(), range: [2014.6, 2025.9] });
    var first = D.YEARS[0], end = D.YEARS[last];
    if (mode === 'taxa') {
      traces = GROUPS.map(function (g) {
        var top = g === m.hi;
        return { x: D.YEARS, y: s[g], name: g, mode: 'lines+markers+text', line: { color: COLOR[g], width: 3 },
                 marker: { size: 8, color: COLOR[g], line: { color: C.card, width: 2 } },
                 text: s[g], texttemplate: '%{y:.1f}%', textposition: top ? 'top center' : 'bottom center',
                 textfont: { family: FONT, size: 11, color: COLOR[g] },
                 hovertemplate: '<b>' + g + '</b><br>%{x}: %{y:.1f}%<extra></extra>' };
      });
      lay = baseLayout({ xaxis: xa, yaxis: axis({ range: [m.yMin || 0, m.yMax], ticksuffix: m.tick }) });
      cap = D.B + ': ' + fmt(s[D.B][0], 1) + '% → ' + fmt(s[D.B][last], 1) + '% · ' + D.P + ': ' + fmt(s[D.P][0], 1) + '% → ' + fmt(s[D.P][last], 1) + '% (' + first + ' → ' + end + ').';
    } else if (mode === 'dif') {
      var nm = m.hi + ' − ' + m.lo;
      traces = [{ x: D.YEARS, y: dv.dif, name: nm, mode: 'lines+markers+text', line: { color: C.ghost, width: 3 },
                  marker: { size: 8, color: C.ghost, line: { color: C.card, width: 2 } },
                  text: dv.dif, texttemplate: '%{y:.1f} p.p.', textposition: 'top center', textfont: { family: FONT, size: 11, color: C.ghost },
                  hovertemplate: '<b>' + nm + '</b><br>%{x}: %{y:.1f} p.p.<extra></extra>' }];
      lay = baseLayout({ xaxis: xa, yaxis: axis({ range: [0, Math.ceil(Math.max.apply(null, dv.dif) * 1.25)], ticksuffix: ' p.p.' }) });
      cap = 'Diferença (' + nm + '): ' + fmt(dv.dif[0], 1) + ' p.p. (' + first + ') → ' + fmt(dv.dif[last], 1) + ' p.p. (' + end + ').';
    } else {
      var nr = 'Razão ' + m.hi + ' ÷ ' + m.lo;
      traces = [{ x: D.YEARS, y: dv.raz, name: nr, mode: 'lines+markers+text', line: { color: C.ghost, width: 3 },
                  marker: { size: 8, color: C.ghost, line: { color: C.card, width: 2 } },
                  text: dv.raz, texttemplate: '%{y:.2f}×', textposition: 'top center', textfont: { family: FONT, size: 11, color: C.ghost },
                  hovertemplate: '<b>' + nr + '</b><br>%{x}: %{y:.2f}×<extra></extra>' }];
      lay = baseLayout({ xaxis: xa, yaxis: axis({ range: [0, 4], ticksuffix: '×', dtick: 1 }) });
      cap = 'Razão: ' + fmt(dv.raz[0], 2) + '× (' + first + ') → ' + fmt(dv.raz[last], 2) + '× (' + end + '). Eixo iniciado em zero para não exagerar a variação.';
    }
    Plotly.react(m.div, traces, lay, CFG);
    $(m.cap).textContent = cap;
  }

  function initSeries() {
    Object.keys(SERIES_META).forEach(function (k) { plotSeries(k, 'taxa'); });
    document.querySelectorAll('.mode-btn[data-chart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.chart;
        document.querySelectorAll('.mode-btn[data-chart="' + key + '"]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        if (SERIES_META[key]) plotSeries(key, btn.dataset.mode);
        else if (key === 'jovens') plotJovens(btn.dataset.mode);
      });
    });
    ['analf15', 'analf60', 'medio'].forEach(function (k) {
      var s = D.series[k], dv = derived(k), m = SERIES_META[k];
      dataTable(k, ['Ano', D.B + ' (%)', D.P + ' (%)', 'Diferença (p.p.)', 'Razão'],
        D.YEARS.map(function (y, i) { return [y, fmt(s[D.B][i], 1), fmt(s[D.P][i], 1), fmt(dv.dif[i], 1) + (m.hi === D.B ? ' (B − PP)' : ' (PP − B)'), fmt(dv.raz[i], 2)]; }));
    });
  }

  /* ----------------------------------------------------------
     5. ESCOLARIDADE DE ADULTOS (gráficos 3a e 3b)
  ---------------------------------------------------------- */
  function plotAdultos() {
    var a = D.adultos;
    var traces = GROUPS.map(function (g) {
      var y = [a.anosEstudo[2016][g], a.anosEstudo[2025][g]];
      return { type: 'bar', x: ['2016', '2025'], y: y, name: g, marker: { color: COLOR[g] },
               text: y, texttemplate: '%{y:.1f}', textposition: 'outside', textfont: { family: FONT, size: 12, color: C.ink }, cliponaxis: false,
               hovertemplate: '<b>' + g + '</b><br>%{x}: %{y:.1f} anos<extra></extra>' };
    });
    Plotly.newPlot('plotAnosEstudo', traces, baseLayout({
      barmode: 'group', bargap: 0.3, bargroupgap: 0.08, margin: { l: 44, r: 16, t: 28, b: 52 },
      xaxis: axis({ type: 'category' }), yaxis: axis({ range: [0, 13.5], title: { text: 'anos de estudo', font: { size: 10 } } })
    }), CFG);

    var cats = ['Preta ou parda<br>(2016)', 'Preta ou parda<br>(2025)', 'Branca<br>(2025)'];
    var vals = [a.basicaCompleta2016PP, a.basicaCompleta2025[D.P], a.basicaCompleta2025[D.B]];
    Plotly.newPlot('plotBasica', [{
      type: 'bar', x: cats, y: vals, marker: { color: [C.old, C.P, C.B] },
      text: vals, texttemplate: '%{y:.1f}%', textposition: 'outside', textfont: { family: FONT, size: 12, color: C.ink }, cliponaxis: false,
      hovertemplate: '<b>%{x}</b><br>%{y:.1f}% com educação básica completa<extra></extra>'
    }], baseLayout({
      showlegend: false, bargap: 0.35, margin: { l: 44, r: 16, t: 28, b: 56 },
      xaxis: axis({ type: 'category' }), yaxis: axis({ range: [0, 78], ticksuffix: '%' })
    }), CFG);

    dataTable('anos', ['Ano', D.B + ' (anos)', D.P + ' (anos)', 'Diferença'],
      [2016, 2025].map(function (y) { var b = a.anosEstudo[y][D.B], p = a.anosEstudo[y][D.P]; return [y, fmt(b, 1), fmt(p, 1), fmt(b - p, 1) + ' ano']; }));
    dataTable('basica', ['Grupo', 'Ano', '% com educação básica completa'],
      [[D.P, 2016, fmt(a.basicaCompleta2016PP, 1)], [D.P, 2025, fmt(a.basicaCompleta2025[D.P], 1)], [D.B, 2025, fmt(a.basicaCompleta2025[D.B], 1)]]);
  }

  /* ----------------------------------------------------------
     6. JOVENS 18–24 (gráfico 5): barras empilhadas ou roscas
  ---------------------------------------------------------- */
  var CAT_COLORS = [C.B, C.moss, C.ghost, C.P];   /* etapa adequada, atraso, concluiu, não concluiu */

  function plotJovens(mode) {
    var j = D.jovens, div = 'plotJovens', traces, lay;
    if (mode === 'roscas') {
      traces = GROUPS.map(function (g, gi) {
        return { type: 'pie', hole: 0.52, labels: j.cats, values: j[g], sort: false, direction: 'clockwise',
                 domain: { x: gi === 0 ? [0, 0.47] : [0.53, 1], y: [0.04, 0.9] }, name: g,
                 marker: { colors: CAT_COLORS, line: { color: C.card, width: 2 } },
                 texttemplate: '%{value:.1f}%', textposition: j[g].map(function (v) { return v > 12 ? 'inside' : 'outside'; }),
                 textfont: { family: FONT, size: 11, color: j[g].map(function (v, i) { return (v > 12 && (i === 0 || i === 3)) ? C.dark : C.dark; }) },
                 showlegend: gi === 0,
                 hovertemplate: '<b>' + g + '</b><br>%{label}: %{value:.1f}%<extra></extra>' };
      });
      lay = baseLayout({
        margin: { l: 10, r: 10, t: 10, b: 70 },
        annotations: GROUPS.map(function (g, gi) { return { x: gi === 0 ? 0.235 : 0.765, y: 0.47, xref: 'paper', yref: 'paper', showarrow: false, text: '<b>' + g.replace(' ou ', '<br>ou ') + '</b>', font: { family: FONT, size: 11, color: C.ink } }; }),
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.02, yanchor: 'top', font: { size: 10.5, color: C.ink } }
      });
    } else {
      traces = j.cats.map(function (c, ci) {
        var x = GROUPS.map(function (g) { return j[g][ci]; });
        return { type: 'bar', orientation: 'h', y: ['Branca', 'Preta ou<br>parda'], x: x, name: c, marker: { color: CAT_COLORS[ci], line: { color: C.card, width: 1.5 } },
                 text: x.map(function (v) { return v >= (window.innerWidth < 600 ? 9 : 7) ? fmt(v, 1) + '%' : ''; }), textposition: 'inside', insidetextanchor: 'middle',
                 textfont: { family: FONT, size: 11, color: C.dark }, textangle: 0, constraintext: 'none',
                 hovertemplate: '<b>%{y}</b><br>' + c + ': %{x:.1f}%<extra></extra>' };
      });
      lay = baseLayout({
        barmode: 'stack', margin: { l: 84, r: 16, t: 14, b: 90 },
        xaxis: axis({ range: [0, 100], ticksuffix: '%', dtick: 20 }),
        yaxis: axis({ autorange: 'reversed', gridcolor: 'rgba(0,0,0,0)', tickfont: { size: 12, color: C.ink } }),
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2, yanchor: 'top', traceorder: 'normal', font: { size: 10.5, color: C.ink } }
      });
    }
    Plotly.react(div, traces, lay, CFG);
    $('cap-jovens').textContent = mode === 'roscas'
      ? 'Roscas: cada grupo soma 100%. Não concluiu e não frequenta: 70,1% (pretos ou pardos) vs. 55,0% (brancos).'
      : 'Cada grupo soma 100%. Não concluiu e não frequenta: 70,1% (pretos ou pardos) vs. 55,0% (brancos).';
  }

  function initJovens() {
    plotJovens('barras');
    var j = D.jovens;
    dataTable('jovens', ['Situação escolar', D.B + ' (%)', D.P + ' (%)'],
      j.cats.map(function (c, i) { return [c, fmt(j[D.B][i], 1), fmt(j[D.P][i], 1)]; })
        .concat([['Total', fmt(j[D.B].reduce(function (s, x) { return s + x; }, 0), 1), fmt(j[D.P].reduce(function (s, x) { return s + x; }, 0), 1)],
                 ['Taxa de escolarização', fmt(j.escolarizacao[D.B], 1), fmt(j.escolarizacao[D.P], 1)]]));
  }

  /* ----------------------------------------------------------
     7. ABANDONO (gráficos 6 e 7)
  ---------------------------------------------------------- */
  function groupedBars(div, cats, dataByGroup, yMax, hoverSuffix) {
    var traces = GROUPS.map(function (g) {
      return { type: 'bar', x: cats, y: dataByGroup[g], name: g, marker: { color: COLOR[g] },
               text: dataByGroup[g], texttemplate: '%{y:.1f}%', textposition: 'outside', textfont: { family: FONT, size: 12, color: C.ink }, cliponaxis: false,
               hovertemplate: '<b>' + g + '</b><br>%{x}<br>%{y:.1f}%' + (hoverSuffix || '') + '<extra></extra>' };
    });
    Plotly.newPlot(div, traces, baseLayout({
      barmode: 'group', bargap: 0.3, bargroupgap: 0.08, margin: { l: 44, r: 16, t: 28, b: 86 },
      xaxis: axis({ type: 'category', tickfont: { size: 10.5, color: C.ink }, automargin: true }),
      yaxis: axis({ range: [0, yMax], ticksuffix: '%' }),
      legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.3, yanchor: 'top', font: { size: 11, color: C.ink } }
    }), CFG);
  }

  function plotAbandono() {
    var a = D.abandono;
    var cats = ['População total<br>(Censo 2022)', 'Jovens 14–29 sem<br>ensino médio fora<br>da escola (2025)'];
    groupedBars('plotAbandono', cats, a, 90);
    dataTable('abandono', ['Recorte', D.B + ' (%)', D.P + ' (%)'], a.cats.map(function (c, i) { return [c, fmt(a[D.B][i], 1), fmt(a[D.P][i], 1)]; })
      .concat([['Jovens 14–29 sem ensino médio e fora da escola (milhões)', fmt(a.brMilhoes, 1) + ' mi', fmt(a.ppMilhoes, 1) + ' mi'],
               ['Total de jovens 14–29 nessa situação', fmt(a.totalMilhoes, 1) + ' milhões', '']]));

    var c = a.condicao;
    groupedBars('plotCondicao', c.cats.map(function (x) { return x.replace('Nem estudam nem estão ocupados', 'Nem estudam<br>nem estão ocupados'); }), c, 30);
    dataTable('condicao', ['Condição (15 a 29 anos)', D.B + ' (%)', D.P + ' (%)'], c.cats.map(function (x, i) { return [x, fmt(c[D.B][i], 1), fmt(c[D.P][i], 1)]; }));
  }

  /* ----------------------------------------------------------
     8. MEDIDAS: tabela conferida, série selecionada e boxplots
  ---------------------------------------------------------- */
  function computed(k) {
    var v = D.series[k[0]][k[1]];
    return { media: fmt(mean(v), 2), med: fmt(median(v), 1), amp: fmt(range(v), 1).replace(/,0$/, ''), vr: fmt(sampleVar(v), 2), dp: fmt(sd(v), 2), cv: fmt(sd(v) / mean(v) * 100, 1) };
  }

  function buildMedidasTable() {
    var tb = document.querySelector('#tblMedidas tbody'); if (!tb) return;
    var ok = 0;
    D.medidas.forEach(function (m, i) {
      var c = computed(m.k);
      var match = c.media === m.media && c.vr === m.var && c.dp.replace(/0$/, '').replace(/,$/, '') === m.dp.replace(/0$/, '') || c.dp === m.dp || (c.media === m.media && c.vr === m.var);
      if (match) ok++;
      var tr = document.createElement('tr'); tr.tabIndex = 0; tr.dataset.idx = i;
      tr.innerHTML = '<td>' + m.s + '</td><td>' + m.media + '</td><td>' + m.med + '</td><td>amodal</td><td>' + m.amp + '</td><td>' + m.var + '</td><td>' + m.dp + '</td><td>' + m.cv + '</td>';
      tb.appendChild(tr);
    });
    window.EST_CHECK = { medidasConferidas: ok, total: D.medidas.length };
  }

  function selectMedida(i) {
    var m = D.medidas[i], v = D.series[m.k[0]][m.k[1]], mu = mean(v), s = sd(v), col = COLOR[m.k[1]];
    document.querySelectorAll('#tblMedidas tbody tr').forEach(function (tr) { tr.classList.toggle('is-selected', +tr.dataset.idx === i); });
    $('ttlMedida').textContent = 'Série selecionada — ' + m.s + ' (%)';
    var x0 = 2015.5, x1 = 2025.5;
    var traces = [
      { x: [x0, x1, x1, x0, x0], y: [mu - s, mu - s, mu + s, mu + s, mu - s], mode: 'lines', fill: 'toself', fillcolor: 'rgba(169,194,198,0.13)', line: { width: 0 }, name: 'média ± 1 DP', hoverinfo: 'skip' },
      { x: [x0, x1], y: [mu, mu], mode: 'lines', line: { color: C.ghost, width: 2, dash: 'dash' }, name: 'média = ' + fmt(mu, 2) + '%', hoverinfo: 'skip' },
      { x: D.YEARS, y: v, mode: 'lines+markers+text', name: 'observações', line: { color: col, width: 3 }, marker: { size: 9, color: col, line: { color: C.card, width: 2 } },
        text: v, texttemplate: '%{y:.1f}%', textposition: 'top center', textfont: { family: FONT, size: 11, color: col },
        hovertemplate: '%{x}: %{y:.1f}%<extra></extra>' }
    ];
    var lo = Math.min(mu - s, Math.min.apply(null, v)), hi = Math.max(mu + s, Math.max.apply(null, v)), pad = (hi - lo) * 0.25;
    Plotly.react('plotMedida', traces, baseLayout({
      xaxis: axis({ tickvals: D.YEARS, ticktext: yearTicks(), range: [x0, x1] }), yaxis: axis({ range: [Math.max(0, lo - pad), hi + pad], ticksuffix: '%' }),
      margin: { l: 48, r: 16, t: 14, b: 76 }, legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.18, font: { size: 11, color: C.ink } }
    }), CFG);
    $('cap-medida').textContent = 'Média ' + m.media + ' · mediana ' + m.med + ' · amplitude ' + m.amp + ' p.p. · variância ' + m.var + ' · desvio-padrão ' + m.dp + ' · CV ' + m.cv + '.';
  }

  function plotBoxes() {
    var defs = [['plotBox1', 'analf15', 'Analfab. 15+ (%)'], ['plotBox2', 'analf60', 'Analfab. 60+ (%)'], ['plotBox3', 'medio', 'Ens. médio 15–17 (%)']];
    var rng = { analf15: [2, 10, 2], analf60: [5, 35, 5], medio: [60, 90, 5] };
    defs.forEach(function (d) {
      var traces = GROUPS.map(function (g) {
        var v = D.series[d[1]][g];
        return { type: 'box', y: v, name: g.replace(' ou ', '<br>ou '), boxpoints: 'all', jitter: 0.3, pointpos: -1.9, boxmean: true, width: 0.55,
                 marker: { color: COLOR[g], size: 7, line: { color: C.card, width: 1 } }, line: { color: COLOR[g], width: 2 },
                 fillcolor: g === D.B ? 'rgba(183,192,168,0.16)' : 'rgba(210,112,75,0.18)',
                 hovertemplate: '<b>' + g + '</b><br>%{y:.1f}%<extra></extra>' };
      });
      var rg = rng[d[1]];
      Plotly.newPlot(d[0], traces, baseLayout({
        showlegend: false, margin: { l: 46, r: 10, t: 40, b: 56 },
        title: { text: d[2], font: { family: FONT, size: 11.5, color: C.ink }, x: 0.5, y: 0.96 },
        yaxis: axis({ ticksuffix: '%', range: [rg[0], rg[1]], dtick: rg[2] }), xaxis: axis({ gridcolor: 'rgba(0,0,0,0)', tickfont: { size: 10, color: C.ink } })
      }), CFG);
    });
  }

  /* ----------------------------------------------------------
     9. SÍNTESE (tabela e gráfico 8)
  ---------------------------------------------------------- */
  function buildSinteseTable() {
    var tb = document.querySelector('#tblSintese tbody'); if (!tb) return;
    D.sintese.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + s.ind + '</td><td>' + fmt(s.b, 1) + '</td><td>' + fmt(s.p, 1) + '</td><td>' + s.dif + '</td><td>' + s.razao + '</td>';
      tb.appendChild(tr);
    });
  }

  function plotGap() {
    var rows = D.sintese.filter(function (s) { return s.difNum !== null; });
    var short = { 'Analfabetismo, 15+ (%)': 'Analfabetismo<br>15+', 'Analfabetismo, 60+ (%)': 'Analfabetismo<br>60+', 'Educação básica completa, 25+ (%)': 'Educação básica<br>completa, 25+',
                  'Frequência líquida ens. médio, 15–17 (%)': 'Ensino médio<br>(frequência), 15–17', 'Graduação concluída, 18–24 (%)': 'Graduação<br>concluída, 18–24',
                  'Fora da escola sem concluir a etapa, 18–24 (%)': 'Fora da escola sem<br>concluir etapa, 18–24' };
    var y = rows.map(function (s) { return short[s.ind] || s.ind; });
    Plotly.newPlot('plotGap', [{
      type: 'bar', orientation: 'h', y: y, x: rows.map(function (s) { return s.difNum; }), marker: { color: rows.map(function (s, i) { return i % 2 ? C.deep : C.P; }) },
      text: rows.map(function (s) { return s.dif; }), textposition: 'outside', textfont: { family: FONT, size: 11.5, color: C.ink }, cliponaxis: false,
      customdata: rows.map(function (s) { return [fmt(s.b, 1), fmt(s.p, 1)]; }),
      hovertemplate: '<b>%{y}</b><br>Branca: %{customdata[0]}% · Preta ou parda: %{customdata[1]}%<br>Diferença: %{x:.1f} p.p.<extra></extra>'
    }], baseLayout({
      showlegend: false, margin: { l: 140, r: 56, t: 10, b: 40 },
      xaxis: axis({ range: [0, 18.5], dtick: 5, title: { text: 'diferença em pontos percentuais (p.p.)', font: { size: 10 } } }), yaxis: axis({ autorange: 'reversed', gridcolor: 'rgba(0,0,0,0)', tickfont: { size: 11, color: C.ink }, automargin: true })
    }), CFG);
    dataTable('gap', ['Indicador', 'Branca', 'Preta ou parda', 'Diferença (p.p.)'], rows.map(function (s) { return [s.ind, fmt(s.b, 1), fmt(s.p, 1), fmt(s.difNum, 1)]; }));
  }

  /* ----------------------------------------------------------
     10. KATEX — fórmulas das medidas
  ---------------------------------------------------------- */
  function kx(id, latex) {
    var el = $(id); if (!el || typeof katex === 'undefined') return;
    try { katex.render(latex, el, { throwOnError: false, displayMode: true }); } catch (e) { el.textContent = latex; }
  }
  function initKatex() {
    kx('eq-media', '\\bar{x} = \\dfrac{1}{n}\\sum_{i=1}^{n} x_i');
    kx('eq-var', 's^2 = \\dfrac{1}{n-1}\\sum_{i=1}^{n}\\left(x_i-\\bar{x}\\right)^2');
    kx('eq-dp', 's = \\sqrt{s^2}\\qquad CV = \\dfrac{s}{\\bar{x}}\\times 100\\%');
    kx('eq-dif', '\\Delta = p_{PP} - p_{B}\\qquad R = \\dfrac{p_{PP}}{p_{B}}');
  }

  /* ----------------------------------------------------------
     11. INICIALIZAÇÃO
  ---------------------------------------------------------- */
  function init() {
    if (typeof Plotly === 'undefined') return;
    plotHero(); plotCenso(); initSeries(); plotAdultos(); initJovens(); plotAbandono();
    buildMedidasTable(); selectMedida(1); plotBoxes(); buildSinteseTable(); plotGap(); initKatex();
    document.querySelectorAll('#tblMedidas tbody tr').forEach(function (tr) {
      tr.addEventListener('click', function () { selectMedida(+tr.dataset.idx); });
      tr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMedida(+tr.dataset.idx); } });
    });
  }

  window.EST_CHARTS = { init: init };
})();
