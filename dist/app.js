const mutationData = {
  substitution: {
    label: 'Substituição: C → A',
    sequence: 'ATG CAT GAA TGC',
    explanation: '<strong>Uma base foi trocada.</strong> Isso pode ser silencioso, trocar um aminoácido ou criar um sinal de parada, dependendo do códon formado.'
  },
  insertion: {
    label: 'Inserção: + A',
    sequence: 'ATG ACC TGA ATG C…',
    explanation: '<strong>Uma base foi inserida.</strong> Como não foi adicionado um múltiplo de três, o quadro de leitura se desloca e os códons seguintes mudam.'
  },
  deletion: {
    label: 'Deleção: − C',
    sequence: 'ATG CTG AAT GC…',
    explanation: '<strong>Uma base foi removida.</strong> O quadro de leitura também se desloca; o efeito pode atingir vários aminoácidos depois da alteração.'
  }
};

document.querySelectorAll('[data-mutation]').forEach(button => {
  button.addEventListener('click', () => {
    const data = mutationData[button.dataset.mutation];
    document.querySelectorAll('[data-mutation]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelector('#result-label').textContent = data.label;
    document.querySelector('#mutated-sequence').textContent = data.sequence;
    document.querySelector('#mutation-explanation p').innerHTML = data.explanation;
  });
});

const phases = {
  g1: ['G1 — crescer e conferir', 'A célula aumenta de tamanho, produz proteínas e organelas. Antes de avançar, pontos de checagem avaliam se as condições são adequadas.'],
  s: ['S — copiar o DNA', 'O material genético é duplicado. Cada cromossomo passa a ter duas cromátides-irmãs, preparando a distribuição para as células-filhas.'],
  g2: ['G2 — revisar e preparar', 'A célula continua crescendo, produz componentes da divisão e verifica se a duplicação do DNA foi concluída corretamente.'],
  m: ['M — dividir', 'Na mitose, cromossomos duplicados são separados e o citoplasma é dividido. O resultado costuma ser duas células-filhas geneticamente semelhantes.'],
  g0: ['G0 — entrar em quiescência', 'A célula sai temporária ou permanentemente do ciclo proliferativo. Algumas podem retornar ao ciclo quando recebem sinais adequados.']
};

document.querySelectorAll('[data-phase]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-phase]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const [title, text] = phases[button.dataset.phase];
    document.querySelector('#phase-title').textContent = title;
    document.querySelector('#phase-text').textContent = text;
  });
});

let generation = 1;
let lightBeetles = 8;
let darkBeetles = 8;
const beetleField = document.querySelector('#beetle-field');

function renderBeetles() {
  beetleField.innerHTML = '';
  [...Array(lightBeetles)].forEach(() => {
    const beetle = document.createElement('span');
    beetle.className = 'beetle light';
    beetleField.appendChild(beetle);
  });
  [...Array(darkBeetles)].forEach(() => {
    const beetle = document.createElement('span');
    beetle.className = 'beetle dark';
    beetleField.appendChild(beetle);
  });
  const total = lightBeetles + darkBeetles;
  document.querySelector('#light-count').textContent = lightBeetles;
  document.querySelector('#dark-count').textContent = darkBeetles;
  document.querySelector('#light-bar').style.width = `${(lightBeetles / total) * 100}%`;
  document.querySelector('#dark-bar').style.width = `${(darkBeetles / total) * 100}%`;
  document.querySelector('#generation-number').textContent = generation;
}

document.querySelector('#run-selection').addEventListener('click', () => {
  if (generation >= 5) {
    document.querySelector('#selection-result').textContent = 'A simulação chegou à 5ª geração. Reinicie para observar novamente.';
    return;
  }
  generation += 1;
  lightBeetles = Math.max(2, lightBeetles - 1 - (generation > 3 ? 1 : 0));
  darkBeetles = Math.min(18, darkBeetles + 2);
  renderBeetles();
  document.querySelector('#selection-result').textContent = `Na geração ${generation}, besouros escuros representam uma fração maior. A camuflagem aumentou, em média, sua chance de sobreviver e deixar descendentes.`;
});

document.querySelector('#reset-selection').addEventListener('click', () => {
  generation = 1; lightBeetles = 8; darkBeetles = 8;
  renderBeetles();
  document.querySelector('#selection-result').textContent = 'A população começa com a mesma quantidade de cada variante.';
});
renderBeetles();

const glossarySearch = document.querySelector('#glossary-search');
glossarySearch.addEventListener('input', () => {
  const query = glossarySearch.value.trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  document.querySelectorAll('#glossary-grid article').forEach(card => {
    const match = card.textContent.toLocaleLowerCase('pt-BR').includes(query);
    card.hidden = !match;
    if (match) visible += 1;
  });
  document.querySelector('#no-glossary-results').hidden = visible !== 0;
});

const studyChecks = [...document.querySelectorAll('[data-study-check]')];
let studyState = {};
try { studyState = JSON.parse(localStorage.getItem('biolab-study') || '{}'); } catch { studyState = {}; }

function updateStudyProgress() {
  studyChecks.forEach(check => { check.checked = Boolean(studyState[check.dataset.studyCheck]); });
  const completed = studyChecks.filter(check => check.checked).length;
  const percent = Math.round((completed / studyChecks.length) * 100);
  document.querySelector('#study-progress-fill').style.width = `${percent}%`;
  document.querySelector('#study-progress-value').textContent = `${percent}%`;
  localStorage.setItem('biolab-study', JSON.stringify(studyState));
}

studyChecks.forEach(check => check.addEventListener('change', () => {
  studyState[check.dataset.studyCheck] = check.checked;
  updateStudyProgress();
}));
updateStudyProgress();

document.querySelectorAll('.flashcard').forEach(card => {
  card.setAttribute('aria-pressed', 'false');
  card.addEventListener('click', () => {
    const flipped = card.classList.toggle('flipped');
    card.setAttribute('aria-pressed', String(flipped));
  });
});

const questions = [
  {topic:'Mutações', mode:'mutation', q:'Qual mutação pode ser transmitida aos descendentes?', options:['Uma mutação em célula da pele','Uma mutação em célula germinativa','Toda mutação somática','Apenas mutações benéficas'], answer:1, why:'Mutações germinativas podem estar presentes nos gametas e chegar ao descendente após a fecundação. Mutações somáticas, em geral, ficam restritas ao indivíduo.'},
  {topic:'Mutações', mode:'mutation', q:'Uma inserção de uma única base dentro de uma região codificadora tende a causar o quê?', options:['Sempre nenhum efeito','Troca de cromossomo inteiro','Deslocamento do quadro de leitura','Duplicação do genoma'], answer:2, why:'Como códons são lidos em trincas, inserir uma base muda o agrupamento das bases seguintes. Isso é chamado de frameshift ou mudança do quadro de leitura.'},
  {topic:'Mutações', mode:'mutation', q:'A trissomia do cromossomo 21 é um exemplo de:', options:['Euploidia','Aneuploidia','Inversão','Translocação'], answer:1, why:'Aneuploidia é a alteração no número de cromossomos individuais. Na trissomia 21 há uma cópia extra do cromossomo 21.'},
  {topic:'Mutações', mode:'mutation', q:'Qual alternativa descreve uma inversão cromossômica?', options:['Perda de um segmento','Repetição de todo o genoma','Trecho reinserido em orientação invertida','Adição de uma base'], answer:2, why:'Na inversão, um segmento se rompe e se reintegra com orientação oposta. É uma alteração estrutural, não uma mudança no número total de cromossomos.'},
  {topic:'Câncer', mode:'cancer', q:'Por que a perda de função do gene TP53 pode favorecer o câncer?', options:['Impede toda replicação do DNA','Facilita a eliminação de células alteradas','Permite que células com dano escapem da parada ou apoptose','Destrói diretamente os telômeros'], answer:2, why:'A proteína p53 ajuda a interromper o ciclo e pode induzir apoptose diante de dano. Sem esse controle, células alteradas podem continuar se dividindo.'},
  {topic:'Câncer', mode:'cancer', q:'Qual característica diferencia principalmente um tumor maligno?', options:['Ter qualquer tamanho','Possuir células em divisão','Invadir tecidos e poder formar metástases','Ser formado por células humanas'], answer:2, why:'Tumores malignos apresentam invasão e podem disseminar células, formando metástases. Tumores benignos tendem a permanecer localizados.'},
  {topic:'Câncer', mode:'cancer', q:'Qual é a relação entre telomerase e muitas células cancerosas?', options:['A telomerase bloqueia toda divisão','Sua reativação ajuda a manter os telômeros e muitas divisões','Ela transforma RNA em proteína','Ela causa apoptose imediata'], answer:1, why:'Muitas células cancerosas reativam a telomerase, reduzindo o encurtamento dos telômeros e sustentando uma capacidade prolongada de proliferação.'},
  {topic:'Câncer', mode:'cancer', q:'Na analogia do controle celular, um oncogene funciona mais como:', options:['Um acelerador preso','Um freio reforçado','Um manual de reparo intacto','Um repouso em G0'], answer:0, why:'Oncogenes podem manter sinais de crescimento excessivamente ativos, como um acelerador preso. Genes supressores de tumor são comparáveis a freios.'},
  {topic:'Evolução', mode:'evolution', q:'Segundo Darwin, por que pescoços longos se tornariam mais comuns em certas populações de girafas?', options:['Cada girafa alongou o pescoço por esforço','Girafas decidiram se adaptar','Indivíduos com variações favoráveis deixaram mais descendentes','O ambiente criou a mutação necessária'], answer:2, why:'A seleção atua sobre variações herdáveis já existentes. Variantes vantajosas naquele ambiente podem deixar mais descendentes e aumentar de frequência.'},
  {topic:'Evolução', mode:'evolution', q:'Qual frase define melhor evolução na síntese moderna?', options:['Mudança de um indivíduo durante sua vida','Mudança nas frequências alélicas de uma população ao longo das gerações','Aumento obrigatório de complexidade','Sobrevivência do indivíduo mais forte'], answer:1, why:'Evolução é uma mudança populacional e geracional. Não exige progresso, maior complexidade ou força física.'},
  {topic:'Evidências', mode:'evolution', q:'Braço humano e nadadeira de baleia são homólogos porque:', options:['Têm exatamente a mesma função','Possuem origem evolutiva comum','Têm o mesmo tamanho','Surgiram por convergência'], answer:1, why:'Estruturas homólogas compartilham origem ancestral, mesmo que hoje exerçam funções diferentes. Isso evidencia divergência evolutiva.'},
  {topic:'Evidências', mode:'evolution', q:'Asas de insetos e asas de aves são geralmente consideradas análogas porque:', options:['Têm mesma origem embrionária','São vestigiais','Têm função semelhante e origens diferentes','Provam uso e desuso'], answer:2, why:'Estruturas análogas têm função semelhante, mas evoluíram de origens diferentes — um caso de convergência adaptativa.'},
  {topic:'Integração', mode:'mixed', q:'Qual conexão entre mutações e evolução está correta?', options:['Toda mutação é uma adaptação','Mutações produzem variação sobre a qual a seleção pode atuar','A seleção cria mutações úteis','Mutações só ocorrem quando necessárias'], answer:1, why:'Mutações surgem sem direção em relação às necessidades do organismo e geram variantes. A seleção pode mudar a frequência dessas variantes.'},
  {topic:'Integração', mode:'mixed', q:'Uma mutação em uma célula somática que desativa controles do ciclo celular pode:', options:['Ser obrigatoriamente herdada pelos filhos','Contribuir para a formação de um tumor','Causar evolução imediata da espécie','Criar uma aneuploidia em todos os gametas'], answer:1, why:'Mutações somáticas em genes de controle podem permitir proliferação desregulada e contribuir para um tumor, mas não são normalmente transmitidas à prole.'},
  {topic:'Integração', mode:'mixed', q:'Em um solo escuro, besouros escuros deixam mais descendentes que os claros. O que se espera?', options:['Todos mudam de cor durante a vida','A frequência da variante escura aumenta nas gerações','A variação desaparece antes da seleção','O solo escolhe quais mutações surgem'], answer:1, why:'A reprodução diferencial altera a composição da população: a variante escura tende a aumentar de frequência ao longo das gerações.'},
  {topic:'Integração', mode:'mixed', q:'Qual conjunto reúne apenas evidências de evolução?', options:['Fósseis, homologia e semelhança molecular','Uso e desuso, desejo e necessidade','Metástase, mitose e telomerase','G0, apoptose e não disjunção'], answer:0, why:'Registro fóssil, anatomia comparada e dados moleculares são linhas independentes de evidência que convergem para a evolução e ancestralidade comum.'},
  {topic:'Mutações', mode:'mutation', q:'Por que uma substituição de base pode ser silenciosa?', options:['Porque todo DNA é não codificador','Porque códons diferentes podem indicar o mesmo aminoácido','Porque a célula remove todos os éxons','Porque substituições nunca são expressas'], answer:1, why:'O código genético é degenerado: mais de um códon pode codificar o mesmo aminoácido. Assim, a sequência muda, mas a proteína pode conservar aquele aminoácido.'},
  {topic:'Mutações', mode:'mutation', q:'Qual alteração é classificada como euploidia?', options:['Trissomia do cromossomo 21','Monossomia do X','Presença de três conjuntos cromossômicos completos (3n)','Perda de um segmento cromossômico'], answer:2, why:'Euploidias alteram conjuntos cromossômicos completos, como 3n ou 4n. Monossomias e trissomias de cromossomos individuais são aneuploidias.'},
  {topic:'Mutações', mode:'mutation', q:'Na translocação cromossômica, ocorre:', options:['Transferência de segmento para cromossomo não homólogo','Troca de uma única base','Duplicação obrigatória de todo o DNA','Separação normal das cromátides'], answer:0, why:'A translocação envolve a mudança de posição de um segmento, frequentemente entre cromossomos não homólogos. É uma mutação cromossômica estrutural.'},
  {topic:'Mutações', mode:'mutation', q:'A não disjunção durante a meiose pode produzir gametas:', options:['Sempre haploides normais','Com cromossomos a mais ou a menos','Sem qualquer DNA','Com mutações apenas gênicas'], answer:1, why:'Quando cromossomos ou cromátides não se separam corretamente, a distribuição fica desigual, formando gametas n+1 ou n−1.'},
  {topic:'Mutações', mode:'mutation', q:'A afirmação “o organismo produziu a mutação de que precisava” está:', options:['Correta para toda adaptação','Correta apenas em animais','Incorreta: mutações não surgem dirigidas pela necessidade','Incorreta porque mutações nunca afetam evolução'], answer:2, why:'Mutações surgem sem direção em relação às necessidades adaptativas. O ambiente seleciona entre variantes; não encomenda uma mutação específica.'},
  {topic:'Câncer', mode:'cancer', q:'Qual é a diferença entre proto-oncogene e oncogene?', options:['São exatamente sinônimos','Proto-oncogene é normal; sua ativação inadequada pode originar oncogene','Oncogene sempre interrompe a divisão','Proto-oncogene só existe em tumores'], answer:1, why:'Proto-oncogenes exercem funções normais de crescimento e sinalização. Alterações que os ativam em excesso podem convertê-los em oncogenes.'},
  {topic:'Câncer', mode:'cancer', q:'O que caracteriza a fase G0?', options:['Duplicação do DNA','Divisão do núcleo','Estado de quiescência fora do ciclo proliferativo','Formação obrigatória de tumor'], answer:2, why:'G0 é um estado sem divisão ativa. Algumas células podem voltar ao ciclo; outras permanecem em G0 por longos períodos.'},
  {topic:'Câncer', mode:'cancer', q:'Herdar uma variante de predisposição ao câncer significa que:', options:['A doença é inevitável','A pessoa já nasce com metástase','O risco pode aumentar, mas outras alterações costumam ser necessárias','Todos os descendentes terão o mesmo tumor'], answer:2, why:'Predisposição genética altera probabilidade, não determina o resultado. Em geral, o desenvolvimento tumoral envolve outras mutações somáticas e fatores adicionais.'},
  {topic:'Câncer', mode:'cancer', q:'Qual processo elimina de forma programada uma célula muito danificada?', options:['Apoptose','Metástase','Translocação','Aclimatação'], answer:0, why:'Apoptose é a morte celular programada. Ela funciona como uma barreira contra a permanência de células com danos graves.'},
  {topic:'Câncer', mode:'cancer', q:'Por que se diz que a carcinogênese é um processo em múltiplas etapas?', options:['Porque um tumor muda de órgão a cada hora','Porque várias alterações podem se acumular e favorecer clones sucessivos','Porque toda célula se torna maligna após uma mutação','Porque apenas a meiose forma tumores'], answer:1, why:'Mutações e alterações regulatórias acumuladas podem conferir vantagens sucessivas de crescimento, sobrevivência e invasão a determinados clones celulares.'},
  {topic:'Evolução', mode:'evolution', q:'Qual situação representa aclimatação, e não adaptação evolutiva?', options:['Aumento temporário da ventilação em grande altitude','Aumento de alelos vantajosos por gerações','Evolução de resistência bacteriana','Divergência de membros homólogos'], answer:0, why:'Aclimatação ocorre no indivíduo e pode ser reversível. Adaptação evolutiva envolve características herdáveis em populações ao longo das gerações.'},
  {topic:'Evolução', mode:'evolution', q:'A deriva genética é especialmente importante em:', options:['Populações pequenas, onde o acaso tem grande efeito','Indivíduos que treinam muito','Populações infinitas e sem reprodução','Apenas células somáticas'], answer:0, why:'Em populações pequenas, eventos aleatórios podem alterar fortemente as frequências alélicas, mesmo sem relação com vantagem adaptativa.'},
  {topic:'Evolução', mode:'evolution', q:'O fluxo gênico ocorre quando:', options:['Alelos se movem entre populações por migração e reprodução','Uma proteína é traduzida','Um cromossomo é duplicado','O ambiente produz o alelo ideal'], answer:0, why:'A migração de indivíduos ou gametas seguida de reprodução pode introduzir ou remover alelos de uma população.'},
  {topic:'Evolução', mode:'evolution', q:'Na seleção estabilizadora, são geralmente favorecidos:', options:['Os dois extremos','Apenas fenótipos novos','Fenótipos intermediários','Alelos por puro acaso'], answer:2, why:'A seleção estabilizadora reduz os extremos e favorece valores intermediários, diminuindo a dispersão em torno da média.'},
  {topic:'Evidências', mode:'evolution', q:'Em um cladograma, dois grupos são mais próximos quando:', options:['Aparecem lado a lado no papel','Têm o mesmo tamanho','Compartilham ancestral comum mais recente','Um vive atualmente dentro do outro'], answer:2, why:'O parentesco é determinado pelos nós e pela ancestralidade compartilhada, não pela proximidade visual das pontas ou por uma ordem de “progresso”.'},
  {topic:'Evidências', mode:'evolution', q:'O registro fóssil ajuda a estudar evolução porque:', options:['Mostra todos os organismos que já existiram sem lacunas','Registra restos e vestígios em contextos geológicos','Prova que espécies são imutáveis','Substitui todas as outras evidências'], answer:1, why:'Fósseis documentam parte da história da vida e, combinados com geologia e outras evidências, revelam mudanças, extinções e formas transicionais.'},
  {topic:'Integração', mode:'mixed', q:'Uma mutação em região regulatória pode:', options:['Nunca produzir efeito','Alterar quando ou quanto um gene é expresso','Sempre mudar a quantidade de cromossomos','Transformar diretamente um indivíduo em outra espécie'], answer:1, why:'Regiões regulatórias controlam a expressão gênica. Alterações nelas podem mudar intensidade, local ou momento de atividade de um gene.'},
  {topic:'Integração', mode:'mixed', q:'Quando um antibiótico elimina bactérias sensíveis e resistentes sobrevivem, o antibiótico:', options:['Criou resistência dirigida em todas as bactérias','Selecionou variantes resistentes já presentes ou surgidas antes','Fez cada bactéria se acostumar','Impediu qualquer evolução'], answer:1, why:'O antibiótico atua como pressão seletiva. Variantes resistentes sobrevivem e deixam mais descendentes; ele não cria a mutação porque ela é necessária.'},
  {topic:'Integração', mode:'mixed', q:'A expansão de um clone celular tumoral lembra seleção natural porque:', options:['Células com certas alterações podem proliferar mais que outras','Todas as células permanecem idênticas','O tecido escolhe conscientemente a mutação','A meiose ocorre dentro do tumor'], answer:0, why:'Dentro do tumor há variação e reprodução diferencial: clones com vantagens de proliferação ou sobrevivência podem aumentar de frequência.'},
  {topic:'Integração', mode:'mixed', q:'Por que sequências de DNA semelhantes apoiam parentesco evolutivo?', options:['Porque toda semelhança é coincidência','Porque sequências são herdadas e acumulam mudanças ao longo do tempo','Porque o DNA só existe em animais','Porque organismos próximos têm sempre aparência idêntica'], answer:1, why:'Sequências são transmitidas entre gerações. Padrões compartilhados e diferenças acumuladas permitem inferir ancestrais comuns e graus de parentesco.'}
];

const quizDialog = document.querySelector('#quiz-dialog');
const quizStart = document.querySelector('#quiz-start');
const quizGame = document.querySelector('#quiz-game');
const quizResult = document.querySelector('#quiz-result');
let round = [];
let currentQuestion = 0;
let score = 0;

function shuffle(items) { return [...items].sort(() => Math.random() - .5); }

function showQuizStart() {
  quizStart.hidden = false; quizGame.hidden = true; quizResult.hidden = true;
  const best = Number(localStorage.getItem('biolab-best') || 0);
  document.querySelector('#best-score').textContent = best ? `Melhor resultado salvo: ${best}/4 acertos.` : 'Seu melhor resultado aparecerá aqui.';
}

function openQuiz() { showQuizStart(); quizDialog.showModal(); }
document.querySelectorAll('[data-open-quiz]').forEach(button => button.addEventListener('click', openQuiz));
document.querySelector('.quiz-close').addEventListener('click', () => quizDialog.close());
quizDialog.addEventListener('click', event => { if (event.target === quizDialog) quizDialog.close(); });

document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  const mode = button.dataset.mode;
  const pool = mode === 'mixed' ? questions : questions.filter(item => item.mode === mode);
  round = shuffle(pool).slice(0, 4);
  currentQuestion = 0; score = 0;
  quizStart.hidden = true; quizResult.hidden = true; quizGame.hidden = false;
  renderQuestion();
}));

function renderQuestion() {
  const item = round[currentQuestion];
  document.querySelector('#quiz-counter').textContent = `Questão ${currentQuestion + 1} de 4`;
  document.querySelector('#quiz-score').textContent = `${score} ${score === 1 ? 'ponto' : 'pontos'}`;
  document.querySelector('#quiz-progress-bar').style.width = `${((currentQuestion + 1) / 4) * 100}%`;
  document.querySelector('#quiz-topic').textContent = item.topic.toUpperCase();
  document.querySelector('#quiz-question').textContent = item.q;
  document.querySelector('#quiz-feedback').hidden = true;
  document.querySelector('#next-question').hidden = true;
  const options = document.querySelector('#quiz-options');
  options.innerHTML = '';
  item.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>${option}`;
    button.addEventListener('click', () => answerQuestion(index, button));
    options.appendChild(button);
  });
}

function answerQuestion(index, selectedButton) {
  const item = round[currentQuestion];
  const optionButtons = [...document.querySelectorAll('#quiz-options button')];
  optionButtons.forEach(button => button.disabled = true);
  optionButtons[item.answer].classList.add('correct');
  const correct = index === item.answer;
  if (correct) score += 1; else selectedButton.classList.add('wrong');
  document.querySelector('#quiz-score').textContent = `${score} ${score === 1 ? 'ponto' : 'pontos'}`;
  document.querySelector('#feedback-icon').textContent = correct ? '✓' : '↳';
  document.querySelector('#feedback-title').textContent = correct ? 'Correto!' : 'Quase — veja o raciocínio';
  document.querySelector('#feedback-text').textContent = item.why;
  document.querySelector('#quiz-feedback').hidden = false;
  document.querySelector('#next-question').hidden = false;
  document.querySelector('#next-question').textContent = currentQuestion === 3 ? 'Ver resultado →' : 'Próxima questão →';
}

document.querySelector('#next-question').addEventListener('click', () => {
  if (currentQuestion < 3) { currentQuestion += 1; renderQuestion(); } else { showResult(); }
});

function showResult() {
  quizGame.hidden = true; quizResult.hidden = false;
  const previous = Number(localStorage.getItem('biolab-best') || 0);
  if (score > previous) localStorage.setItem('biolab-best', score);
  document.querySelector('#result-score').textContent = `${score}/4`;
  const titles = ['Vamos construir a base', 'Bom começo!', 'Muito bem!', 'Excelente domínio!', 'Perfeito!'];
  const messages = [
    'Revise as ideias-chave dos módulos e tente novamente. Leia o feedback: ele mostra exatamente o ponto a ajustar.',
    'Você já reconhece parte dos conceitos. Volte aos exemplos visuais e faça uma nova rodada.',
    'A base está ficando sólida. Observe com atenção as diferenças entre conceitos parecidos.',
    'Ótimo resultado. Tente o desafio misto para conectar os diferentes temas.',
    'Você conectou os conceitos com precisão. Agora tente explicar cada resposta em voz alta, sem consultar o material.'
  ];
  document.querySelector('#result-title').textContent = titles[score];
  document.querySelector('#result-message').textContent = messages[score];
}

document.querySelector('#retry-quiz').addEventListener('click', showQuizStart);
document.querySelector('#close-result').addEventListener('click', () => quizDialog.close());
document.querySelectorAll('[data-reset-progress]').forEach(button => button.addEventListener('click', () => {
  localStorage.removeItem('biolab-best');
  localStorage.removeItem('biolab-study');
  studyState = {};
  updateStudyProgress();
  button.textContent = 'Progresso limpo ✓';
  setTimeout(() => button.textContent = 'Limpar progresso', 1800);
}));

const observedSections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
observedSections.forEach(section => sectionObserver.observe(section));
