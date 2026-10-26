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
  {topic:'Integração', mode:'mixed', q:'Qual conjunto reúne apenas evidências de evolução?', options:['Fósseis, homologia e semelhança molecular','Uso e desuso, desejo e necessidade','Metástase, mitose e telomerase','G0, apoptose e não disjunção'], answer:0, why:'Registro fóssil, anatomia comparada e dados moleculares são linhas independentes de evidência que convergem para a evolução e ancestralidade comum.'}
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
