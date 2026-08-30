---
tags:
- programação
- javascript
- indexeddb
title: Um pouco sobre offline first e granularidade!
date: 2020-09-26T23:00:00.000+00:00
author: Acidiney Dias
featuredimg: "/assets/img/dados.png"
featuredimgWidth: 8687
featuredimgHeight: 5540
summary: "Hoje escrevo sobre um assunto que fiz uma POC, para perceber como poderia
  funcionar toda essa maracutaia que é offline first ( Esse assunto é absurdamente
  grande, o que vou trazer hoje é apenas um pedaço desse tópico ). Caso tenha interesse
  em saber mais sobre, podemos trocar umas ideias na secção dos comentários abaixo
  \U0001F609."
legacyPath: /2020/09/26/um-pouco-sobre-offline-first-e-granularidade/

---
> Opa boas?

\**_Nota: Estou a experimentar algumas ideias de como escrever artigos mais interativos, então vou escrever este artigo fazendo uso da metodologia storyline, ou seja, vou adicionar um personagem que questiona alguns pontos do artigo, que podem ser pontos que vocês tenham dúvidas ou não _**😉. _Irei chamar esse personagem de Joãozinho._

Sou eu novamente, nesta madrugada escrevendo mais um artigo... Faz tempo que não passo por aqui, tenho pensado em algumas coisas, e em breve ficarei muito feliz em anunciar 🤪.

Hoje escrevo sobre um assunto que fiz uma PoC ( Proof of concept - ou prova de conceito em português ), para perceber como poderia fazer funcionar toda essa maracutaia que é offline first ( Esse assunto é absurdamente grande, o que vou trazer hoje é apenas um pedaço desse tópico ). Caso tenha interesse em saber mais sobre, podemos trocar umas ideias na secção dos comentários abaixo 😉.

Então, o que eu vos trago hoje é a experiência de como foi fazer essa PoC ( tive muito pouco tempo para fazer mas acho que o resultado foi bem satisfatório para as metas que pretendia alcançar ).

Mas antes de entrar nesse artigo sobre a minha experiência, vou introduzir o assunto para que todos possamos ficar no mesmo nível da ideia do que se trata no final de contas esse artigo... Um exemplo para os mais desligados é o facebook,** com certeza já teve algum momento em que estavas conectado a Internet e precisou desligar a internet, mas, conseguia ter acesso às informações que já tinha? **

\[Joãozinho\]: 🧐 Mas Acidiney isso é cache !!!!

_( Cache é todo o dado que você já possui em memória, o que significa que eles podem desaparecer facilmente se você fizer lixo, ou, se o tempo de validade dele expirar), capiche? 🤓_

R: Ora ora, 😏 temos um Sherlock Holmes... Sim Joãozinho, é cache... o Cache é um recurso muito usado quando se trata de offline first. Muitas vezes as pessoas acabam resolvendo a maior parte de seus problemas somente usando cache.

Basicamente não importa muito como você aplica e quais técnicas você usa para transformar seu site ou app offline first porque você irá consumir algum recurso do teu cliente ( telefone, pc ou até fogão do usuário final ) para isso. Ou seja, offline first consiste na verdade em você ter uma certa granularidade de dados entre o servidor e o cliente.... Durante minhas pesquisas vi que já existem "muitas" formas catalogadas... Não existe a melhor forma de fazer isso, o que existe é a melhor forma para o teu projecto, cada projecto tem suas necessidades específicas, cabe ao desenvolvedor identificar elas, e aplicar a melhor solução para o seu problema.

Até aqui estamos de boa? easy?

\[ Joãozinho \]: 🤨 Essa conversa é muito bonita, mas como posso fazer de verdade esse troço?

Bem, sem tirar mérito de ninguém eu acredito que fazer offline em apps mobiles ou desktops sejam mais simples que fazer numa página web... até porque você consegue pelo menos aumentar um nível na veracidade dos dados e não ter que colocar aqueles textos vermelhos em alerta que o facebook ou twitter ou sei lá o que mostra quando você abre o dev tools do navegador.

Porquê eu acho isso? simples, permissões, infelizmente não há muita coisa a se fazer quanto a isso, nem agora e sinceramente não acredito que um dia teremos isso. Mas prontos vamos usar os recursos que temos então na web.

( Para quem procura como fazer offline first mobile, infelizmente não consigo ajudar porque ainda não é o meu interesse ).

# O que usei na PoC

Bem sempre que eu faço algo eu coloco no máximo três coisas para eu revisar ou aprender, principalmente nestes side-projects (projectos de estudos) , desta vez usei:

* [Svelte](https://svelte.dev/) ( frontend )
* IndexedDB ( usando o Dexie )
* Proxy ( Fiz um vídeo bem legal sobre no meu \[[YT](https://www.youtube.com/watch?v=Oh8dX3eza-U)\] )
* EXPRESS com SQLITE ( backend )

# Svelte

É um framework front end, como o Vue / React / Angular.... O grande diferencial dele é que ele não usa essas coisas de Virtual DOM, e outros… E usa as tecnologias nativas da web para fazer acontecer.

Na verdade eu acompanhei o lançamento no ano passado, e tinha lido alguma coisa mais o framework ainda era muito criança e o sapper nem estava completo então meio que encostei ele para o lado..

Decidi então ressuscitar nesse micro projeto e eu acho que ficou muito legal ^^

# IndexedDB

Então, para o browser eu poderia usar o LocalStorage Para armazenar os dados e talvez fosse mais tranquilo… Porém como o objectivo era ser uma PoC que usaria uma quantidade absurda de dados em um cenário real, por isso preferi ir de IndexedDB, se assemelhar a um ambiente parecido com o de produção e para aprender mais sobre como funciona... e vou te falar uma coisa... QUE NEGÓCIO RUIM 😫😫.

\[ Joãozinho \]: Então não recomendas, usar o IndexedDB?

Olha, assim dando spoiler, se for usar nativamente não, não recomendo! A API do

IndexedDB, é muita confusa e ainda temos o problema de cada navegador implementar a API como acha mais interessante. Então recomendo o uso de um wrapper para uniformizar o código, algumas soluções são o [pouchdb](https://pouchdb.com/) e o [dexie](http://dexie.org/), use o que você achar mais indicado. Para essa PoC eu usei o Dexie.
```js
    // offline.mjs
    export const select = () => db.todos.toArray()
```
Algo muito fixe no IndexedDB pelo menos no do Chromium é que ele é bem otimizado e bem inteligente quanto a fazer inserts e tal... deixou com certeza o meu trabalho mais simples.

## Proxy

O vídeo no YT explica melhor o que é... mas por agora entenda que uma proxy é basicamente um estrada essa estrada pode te levar por vários caminhos até você chegar ao seu destino final.

_(🥱 Estou orgulhoso dessa definição OMG 😱😱😱😱😱)_

### Onde eu usei

Eu usei como switch entre chamar os métodos que fazem a comunicação com o server e os métodos que fazem a comunicação com a DB Local.
```js
    // network.mjs
    
    import online from './online/index.mjs'
    import offline from './offline/index.mjs'
    
    const target = {
      online,
      offline
    }
    
    const checkNetworkState = () => navigator.onLine
    
    const handler = {
      get: function (obj, prop) {
        if (checkNetworkState()) return obj.online[prop]
        return obj.offline[prop]
      }
    }
    
    let api = new Proxy(target, handler);
    
    export default api
```

Basicamente se eu chamar o método `getTodos()` de `api` ele vai verificar se estou conectado ou não ( a internet )... e se vai executar o método com esse nome que está dentro dos métodos que disponibilizei no módulo online... com os `fetch` e todas as maracutaias, do contrário vai procurar e executar o método a partir da API de métodos offlines que eu disponibilizei e faz um select na DB do indexedDB.

***

Quanto ao Express e o Sqlite não tem muito a dizer, é só para o backend mesmo...

***

Uma vez que vocês já sabem qual é o segredo da minha PoC que foi o uso da `proxy` praticamente, fica mais simples explicar as funcionalidades. Para essa PoC fiz uma simples TODO APP.

## Recuperando dados

Basicamente quando eu estou conectado a Internet eu atualizo a minha BD local com as novas informações sempre:

_\[ Algo fixe que você pode fazer aqui é rodar uma lógica de updates recorrentes para garantir que a máquina do cliente esteja sempre atualizada \]_
```js
    // online.mjs
    import { API_URL } from '../../../constants.mjs'
    import { insertData } from '../../database/index.mjs'
    
    module.exports  = {
      /**
       * Retrive all todos from server
       * And save into local database
       */
      todos: () => {
        return fetch(API_URL)
          .then(requestModifier)
          .then((data) => data.map(todo => ({
            ...todo,
            diff: false
          })))
          .then(insertData)
      },
      // ...
    }
```
Já já explico o `diff`, por enquanto esqueça.

![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438302f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c617269646164.png)

Quando offline...
```js
    // offline.mjs
    import { select } from '../../database/index.mjs'
    
    module.exports  = {
      /**
       * Get all todos from local database
       */
      todos: function () {
        console.log('[Database]> Query local data')
        return select()
      },
      // ...
    }
 ```
 ```js
    // database.mjs
    
    /**
     *
     * Receive an array and save into local database
     *
     * @param { object[] } todos
     * @param { string } todos.todo
     * @param { boolean } todos.done
     */
    export const insertData = async (todos) => {
      db.todos.bulkPut(todos)
        .then(() => {
          console.log('[Database]> Updated')
        })
      return todos
    }
  
    /**
     * Returns an array of todos from local database
     *
     * @return { object[] }
     */
    export const select = () => db.todos.toArray()
```
    
```html
    <!-- app.svelte -->
    <script>
      import network from "../assets/js/resources/network/index.mjs";
      import { onMount } from "svelte";
    
      let todos = [];
    
      async function getTodos() {
        todos = await network.todos();
      }
    
      onMount(getTodos);
    </script>
```
![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438302f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c61726964-3.png)

Eu tinha de início usado aquele helper que o svelte tem para as chamadas, no template `#await`, mas depois de um tempo parou de me resolver... talvez tem alguma forma de continuar usando ele ... mas no meu contexto e para as minhas skills com ele não achei então foi pelo caminho os hooks mesmo, que é o normal e tal.O problema que ele não estava a resolver é quando eu precisava de sincronizar e atualizar a lista....

_\[ O problema que ele não estava a resolver é quando eu precisava de sincronizar e atualizar a lista.... \]_

## Modificando os dados

Bem, uma vez que eu já tenho os dados listados de boa e já tenho a minha BD atualizada chegou a hora de modificar esses dados... Até aqui tranquilo... foi um método no online, outro no offline e o um update no meu `database.mjs`.
```js
    //online.mjs
    // ... imports
    import { updateTodoLocal } from '../../database/index.mjs'
    
    module.exports = {
      // ...
      /**
       * Change state of todo, and after update local database
       *
       * @param { number } id
       */
      updateTodo: (id) => {
        return fetch(API_URL + `/${id}`, {
          method: 'PUT'
        })
          .then(requestModifier)
          .then(todos => todos.map(todo => ({
            ...todo,
            diff: false
          })))
          .then(updateTodoLocal)
      }
    }
```
```js
Quando offline...

    // offline.mjs
    import { updateTodoLocal } from '../../database/index.mjs'
    import event from '../../eventjs'
    
    module.exports = {
      //...
    
      /**
       * Update `done` of todo locally and emit reload event
       * 
       * @param { number } id
       * @param { boolean } done
       */
      updateTodo: (id, done) => {
        done = !done
        updateTodoLocal([{ id, done, diff: true }])
        event.emit('reload') // este event usei o mitt para propagar o evento para atualizar a lista de todos
      }
    }
```

o `event.emit` é o vem do [mitt](https://github.com/developit/mitt) ele é um event emitter bem similar ao `vue.$emit` super recomendo.. eu usei ele para mandar a instrução para atualizar toda a lista no frontend quando a alteração for feita, isso porque ao contrário do server que me retornava o novo estado da da linha e eu fazia o update na base de dados local, ao usar a db local que é síncrona ele atualiza o banco porém a interface ficam os os dados anterior, o que faz com que se você tentar alterar o estado ele continua atualizando para os dados anteriores, o que é chato.
```js
    // database.mjs
    
    /**
     *
     * Get an array of todos and update in local database 
     *
     * @param { object[] } todos
     * @param { number } data.id
     * @param { string } data.done
     * @param { boolean } data.diff
     */
    export const updateTodoLocal = (todos) => {
      todos.forEach(todo => {
        db.todos.where('id').equals(todo.id).modify({ done: todo.done, diff: todo.diff ? 1 : 0 });
      });
    }
```
Por algum motivo muito estranho no dexie quando fazes queries e aplicas um boolean no where ele dá erro por isso tive que transformar em `0 e 1` o diff.
```html
    <!-- app.svelte -->
    <script>
      import network from "../assets/js/resources/network/index.mjs";
    
      function onChange(id, done) {
        network.updateTodo(id, done);
      }
    </script>
    
    <main>
      <table class="table is-striped mgh-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Todo</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        {#each todos as todo}
            <tr>
              <td>{todo.id}</td>
              <td>{todo.todo}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.done}
                  on:change={() => onChange(todo.id, todo.done)} />
              </td>
            </tr>
        {/each}
      </table>
    </main>
```
A API (interface de uso) do Svelte bebe muito da do Vuejs e do React então foi bem de boa ver as coisas e aplicar.

## Criar um novo todo

O dilema aqui era saber como eu sei que esse dado é novo? Tipo, o diff me ajuda a saber que ele foi modificado e o backend espera ele para fazer um update, mas se foi criado um novo como ele vai saber?

_Lembrando que essas analogias, é para o cenário que o usuário fez algumas ações offline e precisou sincronizar depois... _

Resolvi isso adicionando mais uma chave(key) no indexedDB chamado **created**, que só existe quando o usuário for criado.
```js
    /// online.mjs
    
    // ... imports
    import event from '../../event.js'
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    module.exports = {
      // ...
      createTodo: (todo) => {
        return fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({
            todo
          }),
          headers: myHeaders
        })
        .then(() => {
          event.emit('reload') // este event usei o mitt para propagar o evento para atualizar a lista de todos
        })
      }
    }
```
```js
Quando offline ...

    /// offline.mjs
    
    // ... imports
    import { insertData } from '../../database/index.mjs'
    import event from '../../event.js'
    
    module.exports = {
      // ...
      createTodo(todo) {
        return (new Promise(function () {
          insertData([{ todo, created: 1, diff: 1, done: 0 }])
          event.emit('reload') // este event usei o mitt para propagar o evento para atualizar a lista de todos
        }))
      }
    }
```
![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438302f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c61726964-4.png)

_Aqui eu passei o `diff` com o valor de `1`, mas poderia ser `true`, porque já tinha tratado lá dentro... viajei ... E quanto a interface estar desatualizada em relação a base de dados local o `mitt` resolveu o assunto._

Não colocarei o código da database por já ter mandado uma vez... só re-utilizei aqui 😉.
```html
    <!-- app.svelte -->
    <script>
      import network from "../assets/js/resources/network/index.mjs";
    
      let todo = "";
      let errorMessage = "";
    
      function onClick() {
        network.createTodo(todo).then(() => {
          todo = "";
        });
      }
    </script>
    
    <main>
      <div class="mb-3">
        <input required minlength="1" type="text" bind:value={todo} />
        <span class="error-message">{errorMessage}</span>
        <button on:click={onClick}>Criar todo</button>
      </div>
    </main>
```
Pensei em validar mais depois fiquei com preguiça kkkk, desculpa.

\[ Joãozinho \]: Preguiçoso 😑!

## Eliminando informação.

Bem, aqui temos uma armadilha... ou talvez não... não sei kkkk são 4h, e ainda não dormi.

O fluxo de eliminar é bem normal quando você está online, porém quando você está offline é que tem que se tomar cuidado porque você não apaga os dados (**NEVER DELETE**), porque quando for sincronizar o servidor precisa de saber que aquele dado foi apagado, para ele seguir caminho.
```js
    // online.mjs
    
    import { removeTodo } from '../../database/index.mjs'
    
    module.exports = {
      // ...
    
      /**
       * Remove todo from server, and emit reload event
       * 
       * @param { Number } id
       */
      deleteTodo: (id) => {
        return fetch(API_URL + `/${id}`, {
          method: 'DELETE'
        })
          .then(requestModifier)
          .then(() => {
            removeTodo(id)
            event.emit('reload')
          })
      },
    }
```
Quando offline ...
```js
    // offline.mjs
    import { updateTodoLocal } from '../../database/index.mjs'
    
    module.exports = {
      // ... 
      /**
       * When client is offline the logic is not remove but set a removed field to true
       * Will be removed in next sync
       *
       * @param { number } id
       */
      deleteTodo(id) {
        updateTodoLocal([{ id, removed: 1, diff: true, done: 1 }])
        event.emit('reload')
      },
    }
```
Eu resolvi o problema simplesmente adicionando uma propriedade `removed` que é o boolean também.

_Tanto no contexto do created quanto no do removed, precisam de uma atenção especial a nível de backend para saber como processar essas informações._
```js
    // database.mjs
    
    /**
     * Remove an todo from local database
     *
     * @param { number } id
     */
    export const removeTodo = (id) => {
      db.todos.where('id').equals(id).delete()
    }
```
E na view fiz um simples if para só listar o que não foi removido.
```html
    <!-- app.svelte -->
    {#if !todo.removed}
      <tr>
        <td>{todo.id}</td>
        <td>{todo.todo}</td>
        <td>
          <input
            type="checkbox"
            checked={todo.done}
            on:change={() => onChange(todo.id, todo.done)} />
        </td>
        <td>
          <button on:click={() => onDelete(todo.id)}>Eliminar</button>
        </td>
      </tr>
    {/if}
```
![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438322f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c61726964-2.png)

Com isso fechei os métodos básicos...

O ponto foi agora adicionar o mecanismo que sincroniza automaticamente quando o usuário está offline e muda para online por algum motivo…

## Sync

Bem, para isso um event listener chamado online, ele observa a mudança de estado da rede do computador do cliente, e ele só é chamado quando o cliente, volta a estar conectado a internet.
```js
    // network.mjs
    window.addEventListener('online', function () {
      api.sync()
    })
```
Basicamente quando ele está online ele pede para sincronizar chamando o método `sync` que só existe no `online.mjs`, até poderia padronizar e adicionar ele ao `offline.mjs` também, mas sinceramente, não acredito que para uma PoC seja algo realmente divisor de águas.

Então, basicamente é esta função faz isso aqui:
```js
    // online.mjs
    import { deleteAll } from '../../database/index.mjs'
    
    module.exports = {
      // ...
    
      /**
       * Syncronise local database with server and vice versa
       */
      sync: async () => {
        console.log('[app]> sync...')
    
        const todosWithDiff = await diffData()
    
        return fetch(API_URL, {
          method: 'PATCH',
          body: JSON.stringify({
            todos: todosWithDiff
          }),
          headers: myHeaders
        })
          .then(requestModifier)
          .then(todos => todos.map(todo => ({
            ...todo,
            diff: false
          })))
          .finally(() => {
            deleteAll() // Remove todos os todos registrados localmente, antes de atualizar
            event.emit('reload') // este event usei o mitt para propagar o evento para atualizar a lista de todos
            console.log('[app]> sync end :-)')
          })
      }
    }
```
E é aqui onde tudo se encaixa, as propriedades `diff`, `removed` e `created`, que até então existiam sem nenhum propósito. Basicamente eu envio todas as linhas que foram modificadas para o servidor, essas linhas podem ser updates, deletes ou create, eu sei isso no frontend pelo diff.
```js
    // database.mjs
    
    // Retorna todos os todos com o diff a true ou 1 em outras palavras ^^
    export const diffData = () => db.todos.where('diff').equals(1).toArray();
    
    // Talvez tenha outra forma de fazer isso com o dexie, mas eu não vi na doc... então apelei mesmo aqui kkkkk
    export const deleteAll = async () => {
      await db.todos.where("done").anyOf(1, 0).delete()
    }

e no servidor eu tenho o meu método que recebe e trata cada caso específico de atualização no arquivo.

    // algures no backend
    app.patch('/todos', function (req, res) {
      const { todos = [] } = req.body
      todos.forEach(todo => {
        if(todo.created) {
          db.create({ todo: todo.todo, done: todo.done })
          return
        }
    
        if (todo.removed) {
          db.delete(todo.id)
          return
        }
    
        db.update({ done: todo.done }, todo.id)
      });
      return res.json(todos)
    })
```
![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438322f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c61726964-1.png)

**_![](/assets/img/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f64736673666364796f2f696d6167652f75706c6f61642f76313630313539333438322f41636964696e6579446961732e6d652f323032302d31302d32372d637269616e646f2d756d612d706f632d64652d6772616e756c617269646164.png)_**

**_Nota: Para essa PoC não considerei o cenário de Database Lock, ou seja dois devices a usarem e ambos atualizarem, ao simplesmente confiar no cliente isso pode gerar uma desatualização dos dados do server... Para resolver isso, eu usaria um sistema de versionamento semelhante ao do `git` ou próximo, para os clientes... de modo a poder saber qual versão pretende modificar os dados... Mas isso é assunto para outro artigo. ^^_**

Depois de receber a confirmação de atualização do servidor, o frontend elimina todos os dados anteriores e recarrega a base de dados local enviando um event `reload` (Uma chamada ajax para atualizar os dados que estão na tela, não é uma atualização de página pelo amor de Deus kkkk) para o observador que executará essa chamada.

E é isso,

Um breve resumo de como foi fazer a PoC... Espero que tenham gostado e tenham aprendido alguma coisa comigo ^-^.

## Links úteis

* [Link do projecto no Github](https://github.com/acidiney/DATABASE-GRANULARITY)
* [Dexie](https://github.com/acidiney/acidiney.github.io/blob/master/content/dexie.org)
* [Design guide to offline first apps](https://hasura.io/blog/design-guide-to-offline-first-apps/)
* [Offline first](http://offlinefirst.org/)
* [Playlist Soul Coffee](https://open.spotify.com/playlist/37i9dQZF1DXaXDsfv6nvZ5?si=AWai2ghyRSSngJPf4rGOyg)

Gostaria de agradecer ao [Jovany Négocio](https://twitter.com/jovanynegocio) pelas dicas que me deu sobre o artigo...

Bye Bye...

Acidiney Dias
