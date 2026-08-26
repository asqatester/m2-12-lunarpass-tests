# Análise dos elementos para automação — LunarPass

## Home Page

### Botão "Buscar missões"

* Possui a tag HTML `button` e o texto "Buscar missões", o que já é o suficiente para construir um bom locator.

### Checkbox de bases lunares

* Possui texto no `span`, no qual eu consigo identificar a base e, com `/..` do XPath, posso chegar ao `label` para clicar no botão.
* Se tiver um `ID` por base, fica mais prático.

### Caixa de seleção para ordenar data de missões

* `select` simples do HTML com `options` e também possui `id`.

---

## Página de resultados (`/missions`)

### Botão "Refinar"

* Possui a tag HTML `button` e o texto "refinar", o que já é o suficiente para construir um bom locator.
* O filtro de bases lunares já tem `id`.
* "Ordenar por" está usando `select` padrão do HTML.

> **OBS.:** Seria melhor padronizar os elementos de caixa de seleção de opções conforme o exemplo do filtro de bases lunares da página `/missions`. É mais elegante e tem um design mais sofisticado.

### Lista de missões

#### Item de cada missão

* A lista de missões é representada por uma `ul`. Seria ótimo se cada `li` tivesse uma propriedade com uma informação relacionada ao código da missão.
* **Título:** OK, usa um `h3`.
* **Descrição:** OK, usa um `p`.
* **Data de ida e volta:** ruim, porque é um `span` pobre e sem graça; poderia ter um `ID`.
* **Estadia:** ruim, porque é um `span` pobre e sem graça; poderia ter um `ID`.
* **Disponibilidade de assentos:** também é muito simples; poderia ter um `ID`.
* O botão "Reservar" possui no atributo `href` o código da missão (`a[href="/booking/LP-0127A"]`), o que torna o processo de automação muito simples.

### Caixa de resultado quando nenhuma missão é encontrada

* Verificar se é acessível para testes automatizados e, se possível, adicionar algum identificador.

---

# Página da missão (`/booking/LP-0127A`)

## Escolha de assentos

* Os botões de escolha de assento já têm `aria-label` com informações relevantes. Se der pra melhorar, OK.
* Ao fazer hover em um assento, o poover que mostra informações do assento escolhido não está acessível. Melhorar isso com urgência.

## Aside de resumo

* No 'aside' de resumo da compra, cada informação relevante da compra de passagem pode ter um identificador exclusivo. Isso vai facilitar muito as verificações.

## Reserva confirmada

* Na seção de reserva confirmada, cada informação relevante da passagem pode ter um identificador exclusivo. Isso vai facilitar muito as verificações.
