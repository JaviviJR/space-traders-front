<script setup lang="ts">
interface Token {
  text: string
  class: string
}

const agent = {
  symbol: 'MI-AGENTE-1',
  headquarters: 'X1-DF55-A1',
  credits: 175000,
  shipCount: 2,
}

const punct = (text: string): Token => ({ text, class: 'text-code-punct' })
const key = (name: string): Token => ({ text: `"${name}"`, class: 'text-code-key' })

function value(v: string | number): Token {
  return typeof v === 'string'
    ? { text: `"${v}"`, class: 'text-code-string' }
    : { text: String(v), class: 'text-code-number' }
}

const entries = Object.entries(agent)

const lines: Token[][] = [
  [
    { text: 'HTTP/', class: 'text-slate-500' },
    { text: '1.1 200', class: 'text-code-number' },
    { text: ' OK', class: 'text-slate-500' },
  ],
  [punct(' ')],
  [punct('{')],
  [punct('  '), key('data'), punct(': {')],
  ...entries.map(([name, v], i) => [
    punct('    '),
    key(name),
    punct(': '),
    value(v),
    ...(i < entries.length - 1 ? [punct(',')] : []),
  ]),
  [punct('  }')],
  [punct('}')],
]

const lineNumbers = lines.map((_, i) => String(i + 1).padStart(2, '0'))
</script>

<template>
  <div
    aria-hidden="true"
    class="relative rounded-2xl bg-panel/80 ring-1 ring-white/10 backdrop-blur-sm"
  >
    <div
      class="absolute -top-px right-11 left-20 h-px bg-linear-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0"
    />
    <div
      class="absolute right-20 -bottom-px left-11 h-px bg-linear-to-r from-blue-400/0 via-blue-400 to-blue-400/0"
    />

    <div class="px-4 pt-4 pb-6">
      <div class="flex gap-1.5">
        <span
          v-for="n in 3"
          :key="n"
          class="size-2.5 rounded-full ring-1 ring-slate-500/40"
        />
      </div>

      <div class="mt-6 flex items-start font-mono text-sm leading-6">
        <div class="border-r border-slate-300/5 pr-4 text-slate-600 select-none">
          <span
            v-for="number in lineNumbers"
            :key="number"
            class="block"
            >{{ number }}</span
          >
        </div>
        <code class="overflow-x-auto pl-4">
          <span
            v-for="(line, i) in lines"
            :key="i"
            class="block whitespace-pre"
            ><span
              v-for="(token, j) in line"
              :key="j"
              :class="token.class"
              >{{ token.text }}</span
            ></span
          >
        </code>
      </div>
    </div>
  </div>
</template>
