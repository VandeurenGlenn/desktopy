import typescript from '@rollup/plugin-typescript'

export default [{
  input: ['./src/desktopy.ts', './src/server.ts'],
  output: {
    dir: './exports',
    format: 'es'
  },
  plugins: [
    typescript()
  ]
}]
