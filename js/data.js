/* ============================================================
   DATA.JS — Dados do Trabalho de Estatística (ODS 18)
   Todos os valores foram transcritos do relatório (Relatorio_
   Estatistica_ODS18.docx) e dos gráficos nativos da apresentação
   (Apresentacao_Estatistica_ODS18.pptx). Nada aqui foi estimado.
   Fonte primária: IBGE — PNAD Contínua, Educação 2025 (IBGE, 2026)
   e Censo Demográfico 2022 (IBGE, 2023).
   ============================================================ */
window.EST_DATA = (function () {
  'use strict';

  var YEARS = [2016, 2019, 2022, 2024, 2025];
  var B = 'Branca', P = 'Preta ou parda';

  var series = {
    analf15: { title: 'Taxa de analfabetismo, 15 anos ou mais', unit: '%',
               Branca: [3.8, 3.3, 3.4, 3.1, 2.8], 'Preta ou parda': [9.2, 8.3, 7.4, 6.9, 6.5] },
    analf60: { title: 'Taxa de analfabetismo, 60 anos ou mais', unit: '%',
               Branca: [11.7, 9.5, 9.3, 8.1, 7.3], 'Preta ou parda': [30.7, 27.2, 23.3, 21.8, 20.6] },
    medio:   { title: 'Frequência escolar líquida no ensino médio, 15 a 17 anos', unit: '%',
               Branca: [76.1, 79.4, 80.8, 81.9, 84.9], 'Preta ou parda': [63.1, 66.7, 71.8, 73.7, 77.8] }
  };

  /* Censo 2022 — composição da população (IBGE, 2023) */
  var censo = {
    labels: ['Brancos', 'Pardos', 'Pretos', 'Demais (complemento)'],
    pct:    [43.5, 45.3, 10.2, 1.0],
    milhoes: [null, 92.1, 20.6, null],
    nota: 'Brancos 43,5%, pardos 45,3% (92,1 milhões) e pretos 10,2% (20,6 milhões). ' +
          'A fatia "demais" é o complemento até 100% (1,0%) e não consta do relatório como valor próprio.'
  };

  /* Escolaridade de adultos (25 anos ou mais) */
  var adultos = {
    anosEstudo: { 2016: { Branca: 10.1, 'Preta ou parda': 8.1 }, 2025: { Branca: 11.1, 'Preta ou parda': 9.5 } },
    basicaCompleta2025: { Branca: 64.9, 'Preta ou parda': 51.3 },
    basicaCompleta2016PP: 38.1,           /* único valor de 2016 citado no texto */
    difBasica2016: 16.4, difBasica2025: 13.6
  };

  /* Jovens de 18 a 24 anos, situação escolar, 2025 (%) */
  var jovens = {
    cats: ['Etapa adequada', 'Atraso escolar', 'Concluiu e não frequenta', 'Não concluiu e não frequenta'],
    Branca:          [33.4, 5.4, 6.2, 55.0],
    'Preta ou parda': [18.9, 8.0, 3.0, 70.1],
    escolarizacao: { Branca: 38.8, 'Preta ou parda': 26.9 }
  };

  /* Abandono escolar */
  var abandono = {
    cats: ['População total (Censo 2022)', 'Jovens 14–29 sem ensino médio e fora da escola (2025)'],
    Branca: [43.5, 26.4], 'Preta ou parda': [55.5, 72.8],
    totalMilhoes: 7.7, ppMilhoes: 5.6, brMilhoes: 2.0, motivoTrabalhar: 43.0,
    condicao: {   /* jovens de 15 a 29 anos */
      cats: ['Nem estudam nem estão ocupados', 'Estudam e trabalham'],
      Branca: [14.0, 19.7], 'Preta ou parda': [19.8, 14.7]
    }
  };

  /* Tabela 1 do relatório (valores como publicados) — conferidos por recálculo em charts.js */
  var medidas = [
    { s: 'Analfab. 15+ — Branca',        k: ['analf15', B], media: '3,28',  med: '3,3',  amp: '1',    var: '0,14',  dp: '0,37', cv: '11,3%' },
    { s: 'Analfab. 15+ — Preta ou parda', k: ['analf15', P], media: '7,66',  med: '7,4',  amp: '2,7',  var: '1,19',  dp: '1,09', cv: '14,3%' },
    { s: 'Analfab. 60+ — Branca',        k: ['analf60', B], media: '9,18',  med: '9,3',  amp: '4,4',  var: '2,79',  dp: '1,67', cv: '18,2%' },
    { s: 'Analfab. 60+ — Preta ou parda', k: ['analf60', P], media: '24,72', med: '23,3', amp: '10,1', var: '17,36', dp: '4,17', cv: '16,9%' },
    { s: 'Freq. ens. médio 15–17 — Branca',        k: ['medio', B], media: '80,62', med: '80,8', amp: '8,8',  var: '10,48', dp: '3,24', cv: '4%' },
    { s: 'Freq. ens. médio 15–17 — Preta ou parda', k: ['medio', P], media: '70,62', med: '71,8', amp: '14,7', var: '33,59', dp: '5,8',  cv: '8,2%' }
  ];

  /* Síntese 2025 (seção 3.8) */
  var sintese = [
    { ind: 'Analfabetismo, 15+ (%)',                         b: 2.8,  p: 6.5,  dif: '3,7 p.p.',  difNum: 3.7,  razao: '2,32' },
    { ind: 'Analfabetismo, 60+ (%)',                         b: 7.3,  p: 20.6, dif: '13,3 p.p.', difNum: 13.3, razao: '2,82' },
    { ind: 'Anos de estudo, 25+',                            b: 11.1, p: 9.5,  dif: '1,6 ano',   difNum: null, razao: '—' },
    { ind: 'Educação básica completa, 25+ (%)',              b: 64.9, p: 51.3, dif: '13,6 p.p.', difNum: 13.6, razao: '—' },
    { ind: 'Frequência líquida ens. médio, 15–17 (%)',       b: 84.9, p: 77.8, dif: '7,1 p.p.',  difNum: 7.1,  razao: '—' },
    { ind: 'Graduação concluída, 18–24 (%)',                 b: 6.2,  p: 3.0,  dif: '3,2 p.p.',  difNum: 3.2,  razao: '2,07' },
    { ind: 'Fora da escola sem concluir a etapa, 18–24 (%)', b: 55.0, p: 70.1, dif: '15,1 p.p.', difNum: 15.1, razao: '1,27' }
  ];

  return { YEARS: YEARS, B: B, P: P, series: series, censo: censo, adultos: adultos,
           jovens: jovens, abandono: abandono, medidas: medidas, sintese: sintese };
})();
