# Revisão do texto de interface

## Objetivo

Rever todo o texto público do site que não pertence aos artigos ou poemas. A escrita deve ser simples, pessoal e coerente. Frases com voz própria permanecem. Frases abstratas, genéricas ou demasiado polidas são reescritas.

## Escopo

Inclui:

- navegação, footer e acessibilidade;
- página inicial e índice de artigos;
- pesquisa e respetivos estados;
- newsletter, comentários e publicidade;
- página 404;
- arquivo, paginação e páginas de assuntos;
- índice vazio de poemas;
- descrições públicas em metadados e RSS;
- labels e chamadas para leitura nos componentes de artigos.

Exclui:

- `src/content/blog/*` e `src/content/poems/*`;
- títulos, resumos e tags provenientes do frontmatter;
- corpo dos artigos e poemas;
- alterações de layout, tipografia ou comportamento.

## Voz

- Português claro e direto.
- Primeira pessoa quando o autor é o sujeito.
- Frases curtas, sem tom publicitário.
- Sem personificações abstratas, listas decorativas ou dramatização vazia.
- Sem linguagem de produto numa publicação pessoal.
- Os termos usados na navegação, nos títulos e nas chamadas devem ser consistentes.

## Frases que permanecem

- “Escrevo sobre software, trabalho e as coisas que tento perceber melhor.”
- “Há páginas que começam em silêncio.”
- “Neste artigo”
- Títulos, resumos e tags dos artigos.

## Alterações principais

| Atual | Novo |
|---|---|
| Tags | Assuntos |
| Artigos para ler sem pressa. | Todos os artigos. |
| Mais recentes | Do arquivo |
| Ler texto / Continuar a ler | Ler artigo |
| Assuntos que regressam. | Todos os assuntos. |
| Ideias, código e vida em curso. | Textos sobre software, trabalho, dinheiro e vida. |
| Esta página saiu da margem. | Esta página não está aqui. |
| O endereço pode ter mudado, ou talvez nunca tenha existido. | O endereço pode estar errado ou a página deixou de existir. |
| Procure uma ideia… | Escreva uma palavra ou título |
| Novos textos, sem ruído. | Novos textos por email. |
| Receba um aviso quando uma ideia nova encontrar forma. | Envio um email quando publico um texto novo. |
| Este espaço ainda não tem poemas publicados. | Ainda não publiquei poemas aqui. |
| Quando houver palavras para este ritmo, elas viverão aqui — sem anúncios, comentários ou interrupções. | Quando publicar o primeiro poema, ele aparecerá aqui. |
| Enquanto isso, leia os artigos | Até lá, leia os artigos |

## Regras por área

### Navegação e assuntos

“Assuntos” substitui “Tags”, “Tag” e “Temas” no texto público. Os URLs e os nomes técnicos permanecem iguais. A contagem de artigos não muda.

### Índice de artigos

As chamadas para abrir um artigo usam “Ler artigo”. A secção que contém os artigos mais antigos passa a chamar-se “Do arquivo”, porque “Mais recentes” descreve incorretamente o seu conteúdo.

### Pesquisa

A pesquisa usa instruções concretas. O placeholder diz o que pode ser escrito. Os estados indicam pesquisa em curso, ausência de resultados ou falha sem linguagem burocrática.

### Newsletter

O texto explica a ação sem prometer uma experiência abstrata. O título é “Novos textos por email.” e a descrição é “Envio um email quando publico um texto novo.”

### Poemas

O título principal permanece. O estado vazio usa primeira pessoa e descreve apenas o que existe agora e o que acontecerá quando houver um poema publicado.

### Metadados e RSS

As descrições identificam o autor e os temas reais do site. Não usam expressões como “crescimento pessoal”, “em preparação” ou “pensamentos em andamento” quando uma descrição concreta é possível.

## Verificação

- Nenhum ficheiro em `src/content/` é alterado.
- A pesquisa, a navegação, os feeds e as rotas continuam funcionais.
- Os testes que dependem de labels ou texto são atualizados sem perder cobertura.
- `pnpm check`, `pnpm test`, `pnpm build` e os testes E2E passam.
- Uma pesquisa final confirma que os textos substituídos já não aparecem no código público.
