# Site de Estatística — ODS 18 (Igualdade Étnico-Racial na Educação)

Site estático (HTML/CSS/JS) com a identidade visual do site de Hipérboles e o conteúdo do trabalho de Estatística.

## Como executar
Abra `index.html` no navegador (precisa de internet para carregar Plotly, KaTeX e as fontes via CDN).
Opcional: `python3 -m http.server 8000` nesta pasta e acesse http://localhost:8000.

## Estrutura
- `index.html` — conteúdo, uma seção por fase do trabalho (ver "Mapa do trabalho" no topo do site)
- `css/style.css` — design cherry do site de Hipérboles + componentes novos
- `img/silent-hill.jpg` — imagem de referência visual
- `js/data.js` — todos os dados (transcritos do relatório/pptx; nada estimado). Fonte: IBGE (2023; 2026)
- `js/charts.js` — gráficos Plotly e tabelas; `js/app.js` — navegação, PPDAC, painéis

## Direção de arte (Silent Hill)
A paleta (preto-esverdeado, musgo, osso, azul-fantasma das mãos, ferrugem), as fontes (IM Fell English, Special Elite, Inter, JetBrains Mono), as superfícies escuras, o grão e a névoa lenta (só CSS) e o estilo dos 15 gráficos derivam da colagem. A imagem original (`img/silent-hill.jpg`) aparece uma única vez, pequena, nos créditos do rodapé.

## Gráficos
Donut do Censo 2022; linhas (analfabetismo 15+, 60+, ensino médio) com modos taxa / diferença / razão; barras agrupadas (anos de estudo, educação básica); barras empilhadas (jovens 18–24); barras agrupadas (abandono, condição 15–29); série com média ±1 DP; boxplots; barras de diferenças em p.p. Cada um tem "Ver dados do gráfico" e fonte.

## Limitações
- Nomes dos integrantes e tabela de participação: campos reservados para preencher.
- A fatia "demais (1,0%)" do Censo é o complemento até 100%.
- Diferenças e razões são derivadas dos dados publicados; quartis do boxplot pelo método do Plotly.
- Não há histograma nem dispersão: os dados (5 pontos por série) não comportam.
- Associação não implica causalidade.
