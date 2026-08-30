---
tags:
- Nodejs
- Javascript
- API
- Umbler
- Break-changes
- Nestjs
title: Lookup não exite mais!
date: 2020-05-17T23:00:00.000+00:00
author: Acidiney Dias
featuredimg: "/assets/img/screenshot-2021-04-03-at-23-22-18.png"
featuredimgWidth: 3360
featuredimgHeight: 2100
summary: Break-changes no projecto lookup-ao
legacyPath: /2020/05/17/lookup-nao-exite-mais/

---
> Opa, boas?

**Nota**:Pessoal, nest post por mais que eu cite o serviço scrapper ele está focado na API Rest, então tem partes que não vou especificar...entendam, chama-se preguiça. 😁

Estou novamente aqui, empenhado em fazer meu corpo funcionar no mesmo nível que a cabeça 😂, são exatamente 01h quando decidi escrever esse artigo, para vos introduzir com uma mudança que aconteceu agora num projecto meu. 🤦‍♂️ Provavelmente tem aplicações que vão parar de funcionar por conta dessa loucura.

Recentemente estive a trabalhar num prova de conceito chamado de **lookup-ao** que consiste basicamente em dois módulos(micro-serviços), um serviço de _scrapping_ e uma API REST, eles são totalmente desacoplados e estão em locais diferentes, fiz isso por questões de segurança e de escalabilidade porque não queria que o projecto tivesse somente este foco, o modulo REST é aberto e está disponível no [github](https://github.com/acidiney/buscador-ao/).

Esse foi um breve resumo da existência do projecto, para situar todos.

### Quais mudanças aconteceram?

* Bem ...🤤, a primeira mudança que aconteceu é quanto ao nome do projecto que deixou de ser **lookup-ao** e passou a chamar-se **buscador-ao**, o porquê dessa mudança? Simples, eu falo português e o povo angolano tem como língua materna o português, então deixar em inglês seria um atentando para mim, que decidi escrever os meus artigo em português para atingir um publico especifico, e não um publico generalizado ^^.

  E sim, eu sei que faço algumas misturas, tipo escrever _post_ e não artigo... enfim, você entendeu😐.
* A segunda mudança é quanto a estrutura do projecto, na primeira versão do projecto eu usei o [express](https://expressjs.com/) para montar rápido, porque a grande dor de cabeça e a prova de tudo era o scrapper mesmo, então a API foi feita para ser simples e o `express` servia bem, porém, tenho agendado algumas mudanças e decide que o `express` e o `sqlite` não serviam para esse propósito, então migrei todo o _code base_ para [Nestjs](https://nestjs.org/) usando [Typescript](https://www.typescriptlang.org/) e [Mongodb](https://www.mongodb.com/), que acredito que são mais que suficiente para aguentar com os meus planos futuros para o projecto. (Em breve adicionarei eles no Github para todos que quiserem acompanhar o futuro do projecto).
* A terceira e a maior mudança no projecto que vem como `break-change` é o novo endereço. Sim, este projecto que era só um _mock_ ganhou um nome oficial e um domínio também.

  Ontem, fiz a migração deste portfolio para o [netlify](https://netlify.com/) e basicamente todos os _subdomains_ que tinha no _hosting_ antigo se perderam... Hoje a ver quais projectos valiam a pena resgatar me deparei com algo incrível que me motivou basicamente a fazer isso tudo. OS NÚMEROS DE ACESSO 😣.

  | Abril-Maio |
  | --- |
  | 406 acessos |

  [![image-20200518021449589](https://github.com/acidiney/acidiney.github.io/raw/master/images/blog/2020-05-18-a-quem-pertence-o-nif-lookup-ao-countries.png)](https://github.com/acidiney/acidiney.github.io/blob/master/images/blog/2020-05-18-a-quem-pertence-o-nif-lookup-ao-countries.png)

  Eu não sei o que aconteceu aqui 😂😂😂😂😂😂, o mês mau terminou e o número se revelou impressionante... para uma _mock_. ( Contando que o projecto não esta no ar a mais de um mês é muito bom na verdade ).

  Sem mais delongas apresento-vos o mais novo espaço do projecto: [https://buscador.ao](https://buscador.ao "https://buscador.ao")

  As rotas são as mesmas, então se fizer um [https://buscador.ao/nif/:seu-nif](https://buscador.ao "https://buscador.ao") o resultado será:

      {
        "data": {
          "_id": "5ec1bda72fe00d14dc81dc0a",
          "nif": "seu-nif",
          "name": "Acidiney Alvaro  Carvalho Soares Dias",
          "__v": 0
        },
        "source": "Buscador"
      }

  E sim, tem alguns campos a mais, talvez remova num futuro... mas pessoalmente, não vi nada de errado em manter eles aí, então yh.
* A outra mudança é quanto o _hosting_ , antes ele estava junto do meu meu portfolio na [namecheap](https://namecheap.com/) porém como literalmente não estou mais usando ele, quis procurar por outra alternativa, inicialmente até procurei espaço no [heroku](https://heroku.com/) mas só quem já tentou ligar um domínio comprado no [SEPE](https://sepe.gov.ao/) ao [heroku](https://heroku.com/) sabe as dores, basicamente para você que não sabe o [SEPE](https://sepe.gov.ao/) só te permite mexer nos _nameservers_ do domínio e o [heroku](https://heroku.com/) quer que você altere diretamente as configurações de _DNS_ porque o [heroku](https://heroku.com/) usa [DNSSEC](https://pt.wikipedia.org/wiki/DNSSEC), epah é isso que dá comprar domínio em sítios duvidosos. Eu até tentei usar um _addon_ lá no [heroku](https://heroku.com/) chamado [PointDNS](https://elements.heroku.com/addons/pointdns) que dava _nameservers_... mas como deves ter imaginado, não funcionou muito bem..

  Depois procurei alternativas aqui mesmo, e esquece a angoweb... Nem me macei ir lá, procurei na [iberweb](https://iberweb.co.ao/) e na [ngolaIT](https://ngolait.com/) e não tive um resultado satisfatório para o _host_. (Se você já usou alguma solução para node local e recomendas, por favor compartilhe nos comentários).

  Assim já desistindo me lembrei que tinha alguns créditos na [umbler](https://github.com/acidiney/acidiney.github.io/blob/master/content/umbler.com.br) que não estava a usar, então decidi colocar lá. A experiência é mesmo outra... e sim tive que bilar bué para tudo funcionar bem.

## E agora, o futuro?

Números! É o que sustenta o mundo... Enquanto tiver pessoas usando, o projecto ficará no ar. E sim desta vez não irei mudar o domínio novamente, PROMETO 🙈.

Um módulo que estive a pensar em implementar é algo como _authorization_ para pegar essas informações... As mesmas continuam livres, porém para ter maior controle de quem usa essas informações, pensei em algo assim.

Outra coisa é uma _lading page_ decente para o projecto, então se alguém se pré-dispor a fazer uma _lading page_ para o projecto, pode entrar em [contacto comigo](mailto:me@acidineydias.me) ou fazer uma PR directamente lá no projecto se tiver experiência com [Nestjs](https://nestjs.org/)... Ficarei eternamente grato ^^.

Outras coisa, aconselho a se manter ligado no github do projecto.

### LINKS

[Github do projecto](https://github.com/acidiney/buscador-ao/)

[Projecto](https://buscador.ao/)

E é isso por hoje, pessoal... Vou dormir agora, bye.
