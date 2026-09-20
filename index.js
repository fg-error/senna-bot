console.log('✅ Iniciando...')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import path from 'path'
import os from 'os'
import { promises as fsPromises } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

const app = express()
const port = process.env.PORT || 8080

say('Senna FG98', {
  font: 'pallet',
  align: 'center',
  gradient: ['red', 'magenta']
})

say('senna-bot By FG Ig: @fg.error', {
  font: 'console',
  align: 'center',
  gradient: ['cyan', 'magenta']
})

app.listen(port, () => {
  console.log(chalk.green(`🌐 Puerto ${port} está abierto`))
})

let isRunning = false
let isRestarting = false

async function start(file) {
  if (isRunning) return
  isRunning = true

  let args = [join(__dirname, file), ...process.argv.slice(2)]

  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  })

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })

  let p = fork()

  // 📩 MENSAJES DEL PROCESO HIJO
  p.on('message', data => {
    console.log('[RECEIVED]', data)

    switch (data) {
      case 'reset':
        isRestarting = true
        p.process.kill()
        break

      case 'uptime':
        p.send(process.uptime())
        break
    }
  })

  // ❌ CUANDO EL PROCESO MUERE
  p.on('exit', (code) => {
    isRunning = false

    if (isRestarting) {
      console.log(chalk.yellow('🔄 Reinicio manual detectado...'))
      isRestarting = false
      return start(file)
    }

    console.error('❎ Error inesperado:', code)

    if (code !== 0) {
      watchFile(args[0], () => {
        unwatchFile(args[0])
        console.log(chalk.blue('♻ Archivo actualizado, reiniciando...'))
        start(file)
      })
    }
  })

  // 🖥 INFO SISTEMA
  console.log(chalk.yellow(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`))
  console.log(chalk.yellow(`💾 RAM Total: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`))
  console.log(chalk.yellow(`💽 RAM Libre: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`))

  try {
    const packageJsonData = await fsPromises.readFile('./package.json', 'utf-8')
    const packageJsonObj = JSON.parse(packageJsonData)

    console.log(chalk.blue.bold('\n📦 Información del Paquete'))
    console.log(chalk.cyan(`Nombre: ${packageJsonObj.name}`))
    console.log(chalk.cyan(`Versión: ${packageJsonObj.version}`))
    console.log(chalk.cyan(`Autor: ${packageJsonObj.author?.name || 'No definido'}`))
  } catch (err) {
    console.error(chalk.red('❌ No se pudo leer package.json'))
  }

  console.log(chalk.blue.bold('\n⏰ Hora Actual'))
  console.log(
    chalk.cyan(
      new Date().toLocaleString('es-ES', {
        timeZone: 'America/Argentina/Buenos_Aires'
      })
    )
  )

  setInterval(() => {}, 1000)

  // 📟 Consola interactiva
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

  if (!opts['test'])
    if (!rl.listenerCount())
      rl.on('line', line => {
        p.emit('message', line.trim())
      })
}


//---sub bot 

///

start('main.js')