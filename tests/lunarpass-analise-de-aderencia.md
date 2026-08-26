# Análise de Aderência para Automação de Testes

O objetivo desta análise é avaliar se os elementos da aplicação oferecem atributos, semântica e identificadores suficientemente estáveis para a construção de testes automatizados confiáveis com Playwright.

A recomendação geral é priorizar, nesta ordem:

1. Elementos HTML semânticos.
2. `role` + nome acessível.
3. `label` associado ao elemento.
4. Atributos funcionais estáveis, como `href`.
5. `data-testid` quando não existir uma forma semântica confiável de localizar o elemento.

Deve-se evitar criar seletores dependentes da estrutura interna do DOM, como XPath utilizando `/..`, ou depender exclusivamente de classes CSS.

---

# Home Page

## Botão "Buscar missões"

### Situação atual

O elemento utiliza a tag HTML `button` e possui o texto `"Buscar missões"`.

### Avaliação

**Adequado para automação.**

Isso permite construir um locator semântico e bastante confiável:

```ts
page.getByRole('button', { name: 'Buscar missões' })
```

### Solicitação

Nenhuma alteração necessária.

---

## Seleção de bases lunares

### Situação atual

O nome da base lunar está disponível em um `span`.

Atualmente é possível localizar o texto da base e navegar pela estrutura do DOM utilizando XPath com `/..` até chegar ao `label`.

### Avaliação

**Funciona, mas não é uma boa estratégia para automação.**

Seletores que dependem da relação estrutural entre elementos ficam acoplados ao HTML e podem quebrar com pequenas alterações de layout ou refatorações.

Exemplo que deve ser evitado:

```xpath
//span[text()="Alpha"]/..
```

### Solicitação

Associar corretamente o texto da base ao respectivo `input` utilizando `label`.

Exemplo esperado:

```html
<label>
  <input type="checkbox" value="alpha" />
  Alpha
</label>
```

ou:

```html
<input id="base-alpha" type="checkbox" value="alpha" />
<label for="base-alpha">Alpha</label>
```

Isso permitiria utilizar:

```ts
page.getByRole('checkbox', { name: 'Alpha' })
```

ou:

```ts
page.getByLabel('Alpha')
```

Essa abordagem é mais resistente a alterações na estrutura do DOM.

---

## Ordenação das missões por data

### Situação atual

É utilizado um `select` padrão do HTML com elementos `option`.

O elemento também possui `id`.

### Avaliação

**Adequado para automação.**

O uso de `select` nativo simplifica bastante os testes com Playwright.

Caso exista um `label` corretamente associado ao elemento, o locator ideal seria:

```ts
page.getByLabel('Ordenar por')
```

seguido de:

```ts
selectOption(...)
```

### Solicitação

Garantir que o `select` possua um `label` associado.

O `id` pode permanecer, mas não deve ser a única estratégia disponível para identificação do componente.

---

# Página de Resultados (`/missions`)

## Botão "Refinar"

### Situação atual

O elemento utiliza a tag `button` e possui o texto `"Refinar"`.

### Avaliação

**Adequado para automação.**

Permite utilizar:

```ts
page.getByRole('button', { name: 'Refinar' })
```

### Solicitação

Nenhuma alteração necessária.

---

# Filtros

## Filtro de bases lunares

### Situação atual

O componente possui identificadores que permitem localizar as opções individualmente.

### Avaliação

**Bom nível de aderência para automação.**

### Solicitação

Utilizar esse componente como referência para padronização das demais caixas de seleção da aplicação.

Além da consistência visual, a padronização dos componentes reduz a quantidade de estratégias diferentes necessárias na suíte de automação.

---

## Ordenar por

### Situação atual

Utiliza um `select` padrão do HTML.

### Avaliação

**Adequado para automação.**

### Solicitação

Garantir apenas a existência de um `label` associado ao `select`, permitindo a utilização de:

```ts
page.getByLabel('Ordenar por')
```

---

# Lista de Missões

## Estrutura da lista

### Situação atual

As missões são apresentadas dentro de uma `ul`, sendo cada missão representada por um `li`.

### Avaliação

A estrutura semântica da lista está correta.

Entretanto, atualmente não existe uma forma simples e determinística de localizar uma missão específica pelo seu código diretamente no elemento que representa o item.

### Solicitação

Adicionar ao elemento raiz de cada missão um identificador estável relacionado ao código da missão.

Exemplo:

```html
<li data-testid="mission-LP-0127A">
```

Outra possibilidade é utilizar um atributo de domínio:

```html
<li data-mission-code="LP-0127A">
```

Para automação, a segunda opção é especialmente interessante porque deixa explícito que aquele atributo representa uma informação funcional da aplicação.

Isso permitiria localizar diretamente uma missão:

```ts
page.locator('[data-mission-code="LP-0127A"]')
```

e realizar todas as verificações dentro daquele escopo.

---

## Título da missão

### Situação atual

Utiliza `h3`.

### Avaliação

**Adequado.**

A hierarquia semântica permite localizar o título utilizando:

```ts
page.getByRole('heading', { name: 'Nome da missão' })
```

### Solicitação

Nenhuma alteração necessária.

---

## Descrição

### Situação atual

Utiliza um elemento `p`.

### Avaliação

**Adequado.**

### Solicitação

Nenhuma alteração necessária.

---

## Data de ida e volta

### Situação atual

As informações são apresentadas em elementos `span`.

### Avaliação

O problema não é o uso de `span`.

Para automação, a dificuldade ocorre porque não existe uma forma clara de distinguir programaticamente cada informação.

Adicionar simplesmente um `id` resolveria parcialmente o problema, mas criaria dependência de identificadores específicos para cada missão.

### Solicitação

Adicionar atributos estáveis que indiquem semanticamente qual informação está sendo apresentada.

Exemplo:

```html
<span data-testid="departure-date">...</span>
<span data-testid="return-date">...</span>
```

Dentro do escopo da missão:

```ts
const mission = page.locator('[data-mission-code="LP-0127A"]')

await expect(
  mission.getByTestId('departure-date')
).toHaveText(...)
```

Isso evita a necessidade de criar IDs globais como:

```text
departure-date-LP-0127A
```

---

## Estadia

### Situação atual

A informação está disponível em um `span`, porém sem um identificador específico.

### Solicitação

Adicionar um identificador estável dentro do item da missão.

Exemplo:

```html
<span data-testid="mission-duration">
```

Permitindo:

```ts
mission.getByTestId('mission-duration')
```

---

## Disponibilidade de assentos

### Situação atual

A informação está disponível visualmente, porém não existe um identificador específico para automação.

### Solicitação

Adicionar um atributo estável.

Exemplo:

```html
<span data-testid="available-seats">
```

Permitindo:

```ts
mission.getByTestId('available-seats')
```

---

## Botão "Reservar"

### Situação atual

O link possui no atributo `href` o código da missão.

Exemplo:

```html
<a href="/booking/LP-0127A">
  Reservar
</a>
```

### Avaliação

**Excelente para automação.**

O próprio comportamento funcional da aplicação fornece um identificador extremamente estável.

É possível utilizar:

```ts
page.getByRole('link', { name: 'Reservar' })
```

dentro do item da missão ou, quando necessário:

```ts
page.locator('a[href="/booking/LP-0127A"]')
```

### Solicitação

Nenhuma alteração necessária.

---

# Estado sem resultados

## Caixa exibida quando nenhuma missão é encontrada

### Situação atual

Deve ser verificado se o componente possui alguma informação semântica ou identificador estável.

### Solicitação

Adicionar uma forma determinística de identificar o estado de busca sem resultados.

Exemplo:

```html
<div data-testid="missions-empty-state">
```

Permitindo:

```ts
page.getByTestId('missions-empty-state')
```

Também é recomendável que exista uma mensagem textual específica, por exemplo:

```text
Nenhuma missão encontrada
```

Nesse caso, o próprio texto também poderá ser utilizado como verificação funcional.

---

# Página da Missão (`/booking/LP-0127A`)

# Escolha de assentos

## Botões de assento

### Situação atual

Os botões já possuem `aria-label` contendo informações relevantes sobre cada assento.

### Avaliação

**Muito bom para automação.**

Exemplo:

```ts
page.getByRole('button', { name: /Assento A1/ })
```

### Solicitação

Manter o `aria-label` com uma estrutura consistente para todos os assentos.

Idealmente, o nome acessível deve conter informações previsíveis, como:

```text
Assento A1
Assento A2
Assento B1
```

Informações adicionais podem existir, desde que a estrutura permaneça consistente.

---

# Popover de informações do assento

### Situação atual

Ao realizar `hover` sobre um assento, um popover apresenta informações adicionais.

Entretanto, atualmente não existe uma relação clara entre o assento e o conteúdo apresentado no popover.

### Avaliação

**Precisa ser melhorado.**

Esse comportamento dificulta bastante a automação porque obriga o teste a depender da estrutura visual ou de elementos genéricos do DOM.

### Solicitação prioritária

O conteúdo apresentado deve possuir um identificador estável.

Exemplo:

```html
<div role="tooltip" data-testid="seat-tooltip">
```

Quando possível, o botão do assento também pode estabelecer uma relação com o tooltip utilizando:

```html
aria-describedby="seat-A1-tooltip"
```

Exemplo:

```html
<button
  aria-label="Assento A1"
  aria-describedby="seat-A1-tooltip"
>
```

```html
<div
  id="seat-A1-tooltip"
  role="tooltip"
>
  ...
</div>
```

Isso cria uma relação explícita entre o elemento e suas informações complementares.

---

# Aside de resumo da compra

### Situação atual

O resumo contém diferentes informações relacionadas à missão, assentos e valores.

### Avaliação

A utilização do elemento `aside` é positiva, porém cada dado precisa ser identificado individualmente para permitir verificações confiáveis.

### Solicitação

Adicionar atributos estáveis às informações relevantes.

Exemplo:

```html
<aside>
  <span data-testid="summary-mission-code">LP-0127A</span>
  <span data-testid="summary-departure-date">...</span>
  <span data-testid="summary-return-date">...</span>
  <span data-testid="summary-selected-seats">...</span>
  <span data-testid="summary-passengers">...</span>
  <span data-testid="summary-total-price">...</span>
</aside>
```

Isso permitirá realizar assertions específicas sem depender da posição dos elementos ou de seletores CSS.

---

# Reserva Confirmada

### Situação atual

Após a conclusão da reserva são exibidas diversas informações da missão e da passagem.

### Avaliação

Esses dados fazem parte de uma etapa crítica da jornada E2E e devem possuir identificação individual.

### Solicitação

Adicionar identificadores estáveis às principais informações apresentadas na confirmação.

Exemplo:

```html
<span data-testid="reservation-code">
<span data-testid="reservation-mission-code">
<span data-testid="reservation-departure-date">
<span data-testid="reservation-return-date">
<span data-testid="reservation-seats">
<span data-testid="reservation-total-price">
```

Isso permitirá assertions diretas como:

```ts
await expect(
  page.getByTestId('reservation-code')
).toHaveText(expectedReservationCode)
```

---

# Recomendação Geral

Para esta aplicação, não é necessário adicionar `id` em todos os elementos.

Para automação com Playwright, deve-se priorizar seletores semânticos sempre que possível:

```ts
page.getByRole(...)
page.getByLabel(...)
page.getByText(...)
```

Quando o dado não possuir uma representação semântica adequada para automação, utilizar:

```html
data-testid
```

Para entidades de domínio, como uma missão específica, também é válido utilizar atributos explícitos:

```html
data-mission-code="LP-0127A"
```

A principal regra deve ser:

**O teste precisa conseguir localizar um elemento pela sua função ou significado, sem conhecer detalhes desnecessários da estrutura interna do HTML.**

Dessa forma, alterações de CSS, wrappers, `divs`, `spans` ou organização interna dos componentes terão impacto muito menor na suíte automatizada.
