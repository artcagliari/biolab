# BioLab — Mutação & Evolução

Site educacional interativo de Biologia para Ensino Médio, com conteúdos sobre mutações, câncer, teorias evolutivas e evidências da evolução.

## Recursos

- Explicações passo a passo e exemplos visuais
- Simuladores de mutações e seleção natural
- Flashcards e glossário pesquisável
- Banco com 36 questões comentadas
- Progresso de estudo salvo no navegador

## Desenvolvimento local

O site é estático e está dentro de `dist/`. Para visualizar localmente:

```bash
python3 -m http.server 4173 --directory dist
```

Depois, acesse `http://localhost:4173`.

## Deploy

O arquivo `vercel.json` configura a pasta `dist/` como saída publicada na Vercel.
