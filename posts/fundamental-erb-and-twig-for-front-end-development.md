---
title: Fundamental ERB and Twig for Front-End Development
description: Your comprehensive cross-reference guide for Twig and ERB front-end view templates.
date: 2019-02-26
tags:
  - twig
  - front-end
  - erb
  - ruby
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/fundamental-erb-and-twig-for-front-end-development/
imageFilename: crocus.jpg
imageDetails:
  author: Auer, Alois, 1813-1869
  license:
    name: Public domain
  title: "Two entire flowering plants, a yellow crocus (Crocus species) and a herb Paris (Paris quadrifolia). Colour nature print by A. Auer, c. 1853"
  url: https://wellcomecollection.org/works/bqsnr8d4
id: 14378
---

Twig and ERB are the two front-end templating languages I use most when developing websites. Here I document the ways each write just about everything to build views: comments, conditionals, variables and undefined variables, interpolation, loops and the loop index, slicing, handling whitespace, retrieving an keyed values, and templating with blocks and partials. If you're familiar with one of Twig or ERB, use this as a cross-reference to translate your knowledge of the one language into the other. If you haven't used either, this should get you up and running quickly. Read on to learn more about ERB and Twig, or [skip ahead](#table-of-contents) to the code snippet reference section.

## What is Twig?

[Twig](https://twig.symfony.com/) is SensioLabs' Django- / Jinja-like templating language for PHP. The recommended extension for Twig files is `.twig`, `.<compiled_extension>.twig` is useful, and `.html` —though inaccurate— is common in front-end templating. It's used by SensioLabs' [Symfony](https://symfony.com/); by [Drupal 8](https://www.drupal.org/docs/8/creating-custom-modules/getting-started-background-prerequisites-drupal-8), which is built on Symfony; and by [Craft](https://craftcms.com/).

Twig is a great language for building web front ends: it is full-featured without having more than one person could hope to learn, it reads fairly closely to English, and it has great [official documentation](https://twig.symfony.com/doc/2.x/#reference). Twig is especially notable for its powerful support for complex inheritance across templates. Check out the [`use`](https://twig.symfony.com/doc/2.x/tags/use.html) tag, the [`embed`](https://twig.symfony.com/doc/2.x/tags/embed.html) tag, and the [`block()`](https://twig.symfony.com/doc/2.x/functions/block.html) function.

Twig even has Javascript implementations, making it easy to fit into projects built on the JS ecosystem. A quick overview to help you pick the one that best suits yours needs:

- Mozilla's [Nunjucks](https://mozilla.github.io/nunjucks/) is officially "jinja2 inspired" but it has [often followed Twig's lead](https://github.com/mozilla/nunjucks/issues?utf8=✓&q=is%3Aissue is%3Aclosed twig ) and is now close enough to Twig that [Blendid, Viget's build tool for painless local development](https://github.com/vigetlabs/blendid) of static, Craft, Drupal, or Rails sites uses it as Twig proxy (Nunjucks notably does not support Twig's horizontal `embed` inheritence). If you use Gulp in your build tools, you can use [gulp-nunjucks](https://github.com/sindresorhus/gulp-nunjucks).
- [Twig.js](https://github.com/twigjs/twig.js) is a popular JS port of Twig that sees [more active](https://github.com/twigjs/twig.js/graphs/code-frequency) development [than Nunjucks](https://github.com/mozilla/nunjucks/graphs/code-frequency) does. It does not reach full parity with Twig (as of this writing Twig.js notably still has some bugs with Twig's `embed` tag) but it currently comes closer than Nunjucks does and, since its goal is to duplicate Twig, it likely always will. The Twig.js Gulp plugin is [gulp-twig](https://github.com/zimmen/gulp-twig).
- [Twing](https://github.com/ericmorand/twing) is a Twig engine for Node.js written in TypeScript which aims to always maintain complete parity with Twig. It is described as "a maintainability-first engine that passes 100% of the TwigPHP integration tests, is as close as possible to its code structure and expose an as-close-as-possible API." Because Twing is able to essentially reuse much of Twig's codebase, adding new features as they are merged into Twig is straightforward. Twing is the youngest of these projects… Twig users, show it your love! [gulp-twing](https://github.com/ericmorand/gulp-twing) lets you use Twing with Gulp.

To learn Twig, read through the official documentation, and try things out in [twigfiddle](https://twigfiddle.com/).

## What is ERB?

ERB (Embedded Ruby) is a feature of Ruby that lets you —you guessed it!— embed Ruby in other files. ERB files have the extension `.<compiled_extension>.erb`. It is the language [HAML](http://haml.info/) and [Slim](http://slim-lang.com/) are shorthand for. ERB is commonly used for templating Views in Rails apps — at Viget we use it when building large sites with custom CMSes. (If that's something you do, check out [Colonel Kurtz](https://github.com/vigetlabs/colonel-kurtz), the block editor we often use for the client-facing admin area of Rails app sites.)

Because it can do anything Ruby can do, it's extremely powerful, has a much steeper learning curve than Twig, and can do a lot that isn't relevant to front-end templating. There's no cannonical ERB-for-front-end-developers documentation, and the Rails official documentation is immense and hard to dig through. Some resources if for learning ERB:

- APIdock's [ActionView](https://apidock.com/rails/ActionView)::[Layouts](https://apidock.com/rails/ActionView/Layouts) and their documentation for the "included modules" listed under [ActionView::Helpers](https://apidock.com/rails/v4.2.7/ActionView/Helpers) (the [UrlHelper](https://apidock.com/rails/ActionView/Helpers/UrlHelper)'s `link...` and `button_to` methods are essential.
- The APIdock [TagHelper](https://apidock.com/rails/ActionView/Helpers/TagHelper)'s documentation for the [`content tag`](https://apidock.com/rails/v4.2.7/ActionView/Helpers/TagHelper/content_tag) and [`tag`](https://apidock.com/rails/v4.2.7/ActionView/Helpers/TagHelper/tag) methods are useful.
- If you're building forms familiarize yourself with the methods of the [FormHelper](https://apidock.com/rails/ActionView/Helpers/FormHelper), [FormTagHelper](https://apidock.com/rails/ActionView/Helpers/FormTagHelper), and [FormOptionsHelper](https://apidock.com/rails/ActionView/Helpers/FormOptionsHelper)) (some will prefer the appearance of DevDocs — c.f. their [ActionView](http://devdocs.io/rails~5.1-actionview/) and [ActionView/Helpers](http://devdocs.io/rails~5.1-actionview-helpers/) documentation).
- LaunchSchool's [Loops & Iterators](https://launchschool.com/books/ruby/read/loops_iterators) is a good resource for understanding loops in Ruby.
- Mix & Go's [How to use link_to in Rails](https://mixandgo.com/blog/how-to-use-link_to-in-rails) is helpful for understanding `link_to`
- RailsGuides' [Action View Overview](https://guides.rubyonrails.org/action_view_overview.html) and [Layouts and Rendering in Rails](https://guides.rubyonrails.org/layouts_and_rendering.html) cover Rails views in depth, with clear examples.

## ERB and Twig Snippets: Contents

1. [Delimiters](#section--delimiters)
   - [Comments](#section--comments)
     - [Inline comments](#section--inline-comments)
     - [Block comments](#section--block-comments)
   - [Outputting values](#section--outputting-values)
   - [Execution (Control Code)](#section--execution)
2. [Conditionals](#section--conditionals)
   - [Single-statement conditionals](#section--single-statement-conditionals)
   - [Multi-statement conditionals](#section--multi-statement-conditionals)
   - [Conditionals with logical operators](#section--conditionals-with-logical-operators)
   - [Truth and falsity of zero in Boolean contexts](#section--truth-and-falsity-of-zero-in-boolean-contexts)
3. [Defining variables](#section--defining-variables)
   - [Line breaks within a variable's value](#section--line-breaks-within-a-variables-value)
   - [Dealing with undefined variables](#section--dealing-with-undefined-variables)
   - [Variable interpolation](#section--variable-interpolation)
4. [Concatenation](#section--concatenation)
5. [Iteration (loops)](#section--iteration-loops)
   - [Iterating over items](#section--iterating-over-items)
   - [Using the loop index, 0-indexed](#section--using-the-loop-index-0-indexed)
   - [Using the loop index, 1-indexed](#section--using-the-loop-index-1-indexed)
   - [Iterating a certain number of times](#section--iterating-a-certain-number-of-times)
6. [Inspecting data](#section--inspecting-data)
7. [Slicing](#section--slicing)
   - [Shorthand to slice the first count items](#section--shorthand-to-slice-the-first-count-items)
   - [Shorthand for everything after the start item](#section--shorthand-for-everything-after-the-start-item)
8. [Trimming whitespace](#section--trimming-whitespace)
   - [Trimming space between HTML elements](#section--trimming-space-between-html-elements)
9. [Keyed values](#section--keyed-values)
10. [Vertical inheritance](#section--vertical-inheritance)
    - [Vertical inheritance with default content in the parent](#section--vertical-inheritance-with-default-content-in-the-parent)
11. [Using partials](#section--using-partials)

## Delimiters

### Comments

#### Inline comments

- **ERB**: `<%# … %>`

  ```erb
  <%# comment %>
  ```

- **Twig**: `{% raw %}{# … #}{% endraw %}`

  ```twig
  {% raw %}{# comment #}{% endraw %}
  ```

#### Block comments

- **ERB**: `=begin`…`=end`

  *the opening and closing tags must be at the start of the line*

  ```erb
  <%
  =begin %>
                  block comment
      (both lines of both the begin and end tags must be at the start of their lines)
  <%
  =end %>
  ```

  *not*

  ```erb
                  <%
                  =begin %>
                  not a comment
                  <%
                  =end %>
  ```

- **Twig**: {% raw %}`{# … #}`{% endraw %}

  ```twig
  {% raw %}{#
  block comment
  #}{% endraw %}
  ```

  or

  ```twig
  not a comment {% raw %}{# block
  comment #}{% endraw %} not a comment
  ```

### Outputting values

- **ERB**: `<%= … %>`

  ```erb
  <%= "print this" %> <%# output: `"print this"` %>
  <%= 1 + 2 %>        <%# output: `3` %>
  ```

- **Twig**: {% raw %}`{{ }}`{% endraw %}

  ```twig
  {% raw %}{{ "print this" }} {# output: `print this` #}
  {{ 1 + 2 }}        {# output: `3` #}{% endraw %}
  ```

### Execution (Control Code)

- **ERB**: `<% … %>`

  ```erb
  <% if … do %> … <% end %>
  ```

- **Twig**: {% raw %}`{% … %}`{% endraw %}

  ```twig
  {% raw %}{% if … %} … {% endif %}{% endraw %}
  ```

## Conditionals

### Single-statement conditionals

- **ERB**: `if` and `unless`

  ```erb
  <%= 2 if true %> <%# output: `2` %>
  <%= 2 if false %> <%# output: `nil` %>
  <%= 2 unless true %> <%# output: `nil` %>
  <%= 2 unless false %> <%# output: `2` %>
  ```

### Multi-statement conditionals

- **ERB**: `if`…`elsif`…`end`

  ```erb
  <%# assuming x, y, z, and n are defined %>
  <% if x %>
      y
  <% elsif z == n %> <%# note the spelling of elsif %>
      0
  <% else %>
      1
  <% end %>
  ```

- **Twig**: `if`…`elseif`…`endif`

  ```twig
  {# assuming Twig's strict variables option is turned off OR x, y, z, and n are defined #}
  {% raw %}{% if x %}{% endraw %}
      y
  {% raw %}{% elseif z == n %}{# note the spelling of elseif #}{% endraw %}
      0
  {% raw %}{% else %}{% endraw %}
      1
  {% raw %}{% endif %}{% endraw %}
  ```

### Conditionals with logical operators

Both ERB and Twig support "condition `?` iftrue `:` iffalse", and "ifselftrue `?:` otherwise".

- ERB. Note that the "then" case `:` must be provided

  ```erb
  <%# assuming x, y, z, and n are defined %>
  <%# if x then y %>
  <%# omitting the "else" will throw an error #>
  <%= x ? y : '' %>
  <%# if x is true, y. otherwise, if z equals n then 0. otherwise 1 %>
  <%= x ? y : z == n ? 0 : 1 %>
  <%# ternary operator: x if x is true, otherwise y %>
  <%= x ?: y %>
  ```

- Twig

  ```twig
  {% raw %}
  {# assuming x, y, z, and n are defined and/or Twig's strict variables option is turned off #}
  {# if x then y #}
  {{ x ? y }}
  {# if x is true, y. otherwise, if z equals n then 0. otherwise 1 #}
  {{ x ? y : z == n ? 0 : 1 }}
  {# ternary operator: x if x is true, otherwise y #}
  {{ x ?: y }}
  {% endraw %}
  ```

### Truth and falsity of zero in Boolean contexts

- **ERB**: `0` is `True` in Boolean contexts

  ```erb
  <%= false ? 'truthy' : 'falsy' %> <%# output: `"falsy"` %>
  <%= 0 ? 'truthy' : 'falsy' %>     <%# output: `"truthy"` %>
  ```

- **Twig**: as in PHP generally, `0` is `False` in Boolean contexts

  ```twig
  {% raw %}{{ false ? 'truthy' : 'falsy' }} {# output: `falsy` #}
  {{ 0 ? 'truthy' : 'falsy' }}     {# output: `falsy` #}{% endraw %}
  ```

## Defining variables

- **ERB**: `=`

  ```erb
  <% var = 1 %>
  <% anotherVar = 0 %>
  <% falseVar = false %>
  <%= 2 if var %>          <%# output: `2` %>
  <%= 2 if anotherVar %>   <%# output: `2` %>
  <%= 2 if falseVar %>     <%# output: `` %>
  <%= 2 unless falseVar %> <%# output: `2` %>
  ```

- **Twig**: `set`

  ```twig
  {% raw %}{% set var = 1 %}
  {% set anotherVar = 0 %}
  {% set falseVar = false %}
  {{ var ? 2 }}           {# output: `2` #}
  {{ anotherVar ? 2 }}    {# output: null - Twig, unlike PHP, equates 0 with falsehood #}
  {{ falseVar ? '' : 2 }} {# output `2` #}{% endraw %}
  ```

  Twig can define multiple variables in a single call — just keep in mind that developers not used to this might overlook the multiple declarations!

  ```twig
  {% raw %}{% set x, y, z = 1, 2, 3 %}{% endraw %}
  ```

  (A value must be explicitly provided for each variable: `{% raw %}{% set x, y = 1 %}{% endraw %}` will error.)

### Line breaks within a variable's value

- **ERB**: multi-line blocks of markup can stored in an identifier with `content_for x do`…`end`

  ```erb
  <% content_for longVar do %>
    <div>
      …
    </div>
  <% end %>
  <%= content_for(longVar) %>
  ```

  *Note:* `content_for` is additive: each time you provide content for a given variable, that content is appeneded to what was there already. To use `content_for` to overwrite a global variable, use the `flush: true` option:

  ```erb
  <% content_for refreshedVar do %>
      a
  <% end %>
  <% content_for refreshedVar, flush: true do %>
      b
  <% end %>
  ```

- **Twig**: use the `set` tag's form `set x`…`endset` to capture chunks of text

  ```twig
  {% raw %}{% set longVar %}{% endraw %}
    <div>
      …
    </div>
  {% raw %}{% endset %}
  {{ longVar }}{% endraw %}
  ```

### Dealing with undefined variables

- **ERB**:

  - `defined?()`

    ```erb
    <%# output: the content if `var` is defined %>
    <% if defined?(var) %>
      …
    <% end %>
    <%# output: `var` if `var` is defined, otherwise `fallback` %>
    <%= defined?(var) ? var : fallback %>
    ```

  - `||=`, the OR Equal operator

    ```erb
    <%# output: `var` if it is defined and not nil and not false, otherwise `fallback` %>
    <% var ||= fallback %>
    <%
    =begin %> common front-end use cases:
    1. output a variable only if it is defined
    <%
    =end %>
    <% var ||= nil %>
    <%# set a variable with a fallback %>
    <% x = y ||= nil %>
    ```

- **Twig**:

  - `is defined`

    Especially useful when Twig's `strict variables` option is turned on, in which case referring to an undefined variable will throw an error.

    ```twig
    {% raw %}{# output: Twig_Error_Runtime: Variable "x" does not exist. #}
    {{ x }}
    {# output: the content if var is defined #}
    {% if var is defined %}
      …
    {% endif %}
    {# output: `advance` if var is defined, otherwise `fallback` #}
    {{ var is defined ? advance : fallback }}{% endraw %}
    ```

  - `??`, the null coalescing operator

    ```twig
    {% raw %}{# output: `var` if it is defined and not null, otherwise `fallback` #}
    {{ var ?? fallback }}
    {# common use cases:
    1. output a variable only if it is defined #}
    {{ var ?? null }}
    {# set a variable with a fallback #}
    {% set x = y ?? null %}{% endraw %}
    ```

### Variable interpolation

- **ERB**: `#{var}`

  ```erb
  <% x = 1 %>
  <%= "this is interpolated: #{x}" %><%# output: `this is interpolated: 1` %>
  ```

- **Twig**: `#{var}`

  ```twig
  {% raw %}{% set x = 1 %}
  {{ "this is interpolated #{x}" }}{# output: `this is interpolated: 1` #}{% endraw %}
  ```

## Concatenation

- **ERB**: `+` (plus). Note that to concatenate a string and a number in Ruby, the number must be converted to a string.

  ```erb
  <% string_variable = 'world' %>
  <% number_variable = 2 %>
  <%= 'hello ' + string_variable %>   <%# output: `"hello world"` %>
  <%= "example #{number_variable}" %> <%# output: `"example 2"` %>
  <%= 'example ' + 3.to_s %>          <%# output: `"example 3"` %>
  ```

- **Twig**: `~` (tilde). Note that strings and numbers can be freely concatenated.

  ```twig
  {% raw %}{% set string_variable = 'world' %}
  {% set number_variable = 2 %}
  {{ 'hello ' ~ string_variable }}   {# output: `hello world` #}
  {{ "example #{number_variable}" }} {# output: `example 2` #}
  {{ 'example ' ~ 3 }}               {# output: `example 3` #}{% endraw %}
  ```

## Iteration (loops)

### Iterating over items

- **ERB**: `n.each do |i|`…`end`

  ```erb
  <% items = ['a', 'b', 'c'] %>
  <%# output: `...` %>
  <% [0..items.length].each do %>.<% end %>
  <%# output: `a b c ` %>
  <% items.each do |item| %>
      <%= item %>
  <% end %>
  ```

- **Twig**: `for i in n`…`endfor`

  ```twig
  {% raw %}{% set items = ['a','b','c'] %}
  {# output: `...` #}
  {% for i in 0..items.length %}.{% endfor %}
  {# output: `a b c ` #}
  {% for item in items %}
      {{item}}
  {% endfor %}{% endraw %}
  ```

### Using the loop index, 0-indexed

- **ERB**:

  - `n.each_with_index do |i, index|`…`end`

    ```erb
    <%# output: `0. a 1. b 2. c ` %>
    <% items = ['a', 'b', 'c'] %>
    <% items.each_with_index do |item,index| %>
        <%= index %>. <%= item %>
    <% end %>
    ```

  - `n.times do |i|`…`end`

    ```erb
    <%# output: `0 1 2 3 4 5 6 7 8 9` %>
    <% 10.times do |i| %><%= i %> <% end %>
    ```

- **Twig**: `loop.index0`

  ```twig
  {% raw %}{% for item in items %}
      {{loop.index0}}. {{item}}
  {% endfor %}{% endraw %}
  ```

### Using the loop index, 1-indexed

- **ERB**:

  - `.each_with_index`'s `index` is always 0-indexed, so add `1`

    ```erb
    <% items.each_with_index do |item,index| %>
        <%= index + 1 %>. <%= item %>
    <% end %>
    ```

  - `n.times do |i|`…`end`

    ```erb
    <%# output: `1 2 3 4 5 6 7 8 9 10 ` %>
    <% 10.times do |i| %><%= i %> <% end %>
    ```

- **Twig**: `loop.index`

  ```twig
  {% raw %}{% for item in items %}
      {{loop.index}}. {{item}}
  {% endfor %}{% endraw %}
  ```

### Iterating a certain number of times

- **ERB**: `n.times do |i|`…`end`

  ```erb
  <% n = 3 %>
  <%# output: `...` %>
  <% n.times do %>.<% end %>
  <%# output: `1 2 3 ` %>
  <% n.times do |i| %>
      <%= i %>
  <% end %>
  ```

- **Twig**: `for i in n`…`endfor`

  ```twig
  {% raw %}{% set items = ['a','b','c'] %}
  {# output: `...` #}
  {% for i in 0..items.length %}.{% endfor %}
  {# output: `a b c ` #}
  {% for item in items %}
      {{item}}
  {% endfor %}{% endraw %}
  ```

## Inspecting data

- **ERB**: several options for formatting an object's data, notably: simply outputting, `.inspect`ing, and `debug()`ing. For basic data-checking purposes in a view, the essential difference is `debug()` returns YAML while `inspect` and printing return strings.

  ```erb
  <%# for some object `posts` %>
  <%= posts %>
  <%= posts.inspect %>
  <%= debug(posts) %>
  ```

- **Twig**:

  - The `|json_encode()` filter formats an object's data.

    ```twig
    {% raw %}{# for some object `posts` #}
    {{ posts|json_encode }}{% endraw %}
    ```

  - The `dump()` function outputs information about a variable.

    ```twig
    {% raw %}{# for some object `posts` #}
    {{ dump(posts) }}{% endraw %}
    ```

    *Note:* `dump` must be enabled. Some implementations make it available out of the box (for example, Craft in dev mode).

## Slicing

- **ERB**: `.slice(index)`, `.slice(start,count)`

  ```erb
  <%= [1,2,3,4].slice(1) %>   <%# output: `2` %>
  <%= [1,2,3,4].slice(1,2) %> <%# output: `[2,3]` %>
  ```

- **Twig**: `|slice(start,count)` or `[start:count]`

  ```twig
  {% raw %}{{ [1,2,3,4]|slice(1) }}   {# output: `Array` #}
  {{ [1,2,3,4]|slice(1,2) }} {# output: `Array` #}{% endraw %}
  ```

  *Note:* The output of the above Twig examples is `Array`, because in Twig the output of `{% raw %}{{ [anArray] }}{% endraw %}` is `Array`. If you need to print an array, use `|json_encode`:

  ```twig
  {% raw %}{{ [1,2,3,4]|slice(1)|json_encode() }}   {# output: `[2,3,4]` #}
  {{ [1,2,3,4]|slice(1,2)|json_encode() }} {# output: `[2,3]` #}{% endraw %}
  ```

  In execution, no special steps are necessary:

  ```twig
  {% raw %}{% set myArray = [1,2,3,4] %}{% endraw %}
  …
  ```

### Shorthand to slice the first `count` items

- **ERB**: `.take(count)` or `.first(count)`

  ```erb
  <%= [1,2,3,4].take(2) %>  <%# output: `[1,2]` %>
  <%= [1,2,3,4].first(2) %> <%# output: `[1,2]` %>
  ```

- **Twig**: `[:count]`

  ```twig
  {% raw %}{{ [1,2,3,4][:2]|json_encode() }} {# output: `[1,2]` #}{% endraw %}
  ```

### Shorthand for everything after the `start` item

- **Twig**: `[start:]`

  ```twig
  {% raw %}{{ [1,2,3,4][2:]|json_encode() }} {# output: `[3,4]` #}{% endraw %}
  ```

## Trimming whitespace

- ERB

  If `trim_mode` is set to `-`, a `-` in the closing `erb` tag will trim *trailing* whitespace:

  ```erb
  <% something -%>
  1
  <%= something_else -%>
  2
  <% another_thing %>
  ```

  is equivalent to

  ```erb
  <% something %>1
  <%= something_else %>2
  <% another_thing %>
  ```

- Twig

  Trim *leading or trailing* whitespace by adding a `-` inside in an opening or close delimiter, respectively:

  ```twig
  {% raw %}{% something -%}
  1
  {%- something_else -%}
  2
  {%- last_thing %}{% endraw %}
  ```

  is equivalent to

  ```twig
  {% raw %}{% something %}1{% something_else %}2{% last_thing %}{% endraw %}
  ```

### Trimming space between HTML elements

- Twig

  Twig doesn't care what language you are compiling to, but it does provide a special `spaceless` tag for use with HTML.

  ```twig
  {% raw %}{% spaceless %}{% endraw %}
    <div>…</div>
    <span>…</span>
  {% raw %}{% endspaceless %}{% endraw %}
  ```

  is equivalent to

  ```twig
  <div>…</div><span>…</span>
  ```

  Note that this `spaceless` has limited powers:

  - it isn't recursive

    ```twig
    {% raw %}{% spaceless %}{% endraw %}
      <div>
        <div>
          …
        </div>
      <div>
      <span>…</span>
    {% raw %}{% endspaceless %}{% endraw %}
    ```

    is equivalent to

    ```twig
    <div><div>
        …
      </div><div><span>…</span>
    ```

  - and content between HTML tags will disrupt it

    ```twig
    {% raw %}{% spaceless %}{% endraw %}
      <div>…</div>
      sorry, spaceless
      <span>…</span>
    {% raw %}{% endspaceless %}{% endraw %}
    ```

    is equivalent to

    ```twig
    <div>…</div>
      sorry, spaceless
      <span>…</span>
    ```

## Keyed values

- **ERB**:

  Use a Symbol `:property` to look up an operation on a Hash:

  ```erb
  <% myHash = {hello: 'world'} %>
  <%= myHash[:hello] %> <%# output: "world" %>
  ```

- **Twig**:

  Use dot notation or subscript syntax to access attributes of a variable:

  ```twig
  {% raw %}{% set myVar = {hello: 'world'} %}
  {{ myVar.hello }} {# output: world #}
  {{ myVar['hello'] }} {# output: world #}{% endraw %}
  ```

## Vertical inheritance

For a `layout` file that pulls in `page`:

- **ERB**: `content_for` in child, `yield` in parent

  *layouts/layout.html.erb*

  ```erb
  <%= yield :myBlock %>
  ```

  *views/page.html.erb*

  ```erb
  <% content_for :myBlock do %>
      the content
  <% end %>
  ```

- **Twig**: `block` + `extends` in child, `block` in parent.

  *layout.html.twig*

  ```twig
  {% raw %}{% block myBlock '' %}
  {# or #}
  {% block myBlock %}{% endblock %}
  {# or #}
  {% block myBlock %}{% endblock myBlock %}{% endraw %}
  ```

  *page.html.twig*

  ```twig
  {% raw %}{% extends 'layout.html.twig' %}
  {% block myBlock %}
      the content
  {% endblock %}{% endraw %}
  ```

  or if all the content is a variable *x*, *page.html.twig*

  ```twig
  {% raw %}{% extends 'layout.html.twig' %}
  {% block myBlock x %}{% endraw %}
  ```

  or if all the content is a single string, *page.html.twig*

  ```twig
  {% raw %}{% extends 'layout.html.twig' %}
  {% block myBlock "#{x} content" %}
  {# or #}
  {% extends 'layout.html.twig' %}
  {% block myBlock x ~ "content" %}{% endraw %}
  ```

  or if all the content is a single literal string, *page.html.twig*

  ```twig
  {% raw %}{% extends 'layout.html.twig' %}
  {% block myBlock 'the content' %}
  {# or #}
  {% block myBlock "the content" %}{% endraw %}
  ```

### Vertical inheritance with default content in the parent

- ERB

  *layouts/layout.html.erb*

  ```erb
  <% if content_for?(:my_content) %>
      <%= yield :my_content %>
  <% else %>
      default content
  <% end %>
  ```

  *views/page.html.erb*

  ```erb
  <% content_for :my_content do %>
      the content
  <% end %>
  ```

- Twig

  *main.html.twig*

  ```twig
  {% raw %}{% block content %}
      default content
      {% block sub_content '' %}
  {% endblock %}{% endraw %}
  ```

  *override-content.html.twig*

  ```twig
  {% raw %}{% extends 'main.html.twig' %}
  {% block content %}
      the content
  {% endblock %}{% endraw %}
  ```

  Result of *override-content.html.twig*:

  ```
  default content
  ```

  *override-subcontent.html.twig*

  ```twig
  {% raw %}{% extends 'main.html.twig' %}
  {% block subcontent %}
      the sub-content
  {% endblock %}{% endraw %}
  ```

  Result of *override-subcontent.html.twig*:

  ```
  default content
    the sub-content
  ```

## Using partials

- **ERB**:

  `render` will output the contents of another file

  ```erb
  <%= render 'path/to/x' %>
  ```

  To pass values to the rendered file, define them:

  ```erb
  <% a = 1 %>
  <% b = 2 %>
  <%= render 'path/to/x', a:a, b:b %> <%# in path/to/x a=1 and b=2 %>
  ```

  If the rendered file expects different variable names, use those:

  ```erb
  <% a = 1 %>
  <% b = 2 %>
  <%= render 'path/to/x', y:a, z:b %> <%# in path/to/x y=1 and z=2 %>
  ```

- **Twig**:

  - `include` tag

    ```twig
    {% raw %}{% include 'path/to/x' %}{% endraw %}
    ```

  - `include` function

    ```twig
    {% raw %}{{ include('path/to/x') }}{% endraw %}
    ```

  The `include` tag passes the entire parent context to the included file by default:

  ```twig
  {% raw %}{% set a = 1 %}
  {% set b = 2 %}
  {% include 'path/to/x' %} {# in path/to/x a=1 and b=2 #}{% endraw %}
  ```

  To pass only certain data, use `include with only`:

  ```twig
  {% raw %}{% set a = 1 %}
  {% set b = 2 %}
  {% include 'path/to/x' with {a:a} only %}
  {# in path/to/x a=1 and b does not exist #}{% endraw %}
  ```

  Rename variables in the `with` (can be combined with `only`):

  ```twig
  {% raw %}{% set a = 1 %}
  {% include 'path/to/x' with {y:a} %} {# in path/to/x a=1 and y=1 #}
  {% include 'path/to/z' with {y:a} only %}
  {# in path/to/z y=1 and a does not exist  #}{% endraw %}
  ```

