///////////////////////////////////////////
// RASDASH API SERVER (C)2019: Ben Sykes //
///////////////////////////////////////////

// Import libraries.
const express = require('express')
const path = require('path')
const logger = require('./logger.js')
const si = require('systeminformation')

// Initialize the API.
logger.info('Initializing API...')
const api = express()
api.on('mount', (parent) => logger.state('API mounted to application.'))

// Configure API requests.
logger.info('Configuring API requests...')
const siError = 'error getting data'

// API requests: status.
api.get('/online', function(req, res) { // Server Status (online)
  res.status(200).send('true')
})

// API requests: hardware.
api.get('/hw/model', function(req, res) { // Device Model (hw/model)
  si.system()
    .then(data => res.send('\"' + data.model.toString() + '\"'))
    .catch(error => res.status(404).send(siError))
})

// API requests: CPU.
api.get('/cpu/temp', function(req, res) { // CPU Temperature in C (cpu/temp)
  si.cpuTemperature()
    .then(data => res.send(data.main.toString()))
    .catch(error => res.status(404).send(siError))
})
api.get('/cpu/usage', function(req, res) { // CPU Usage % (cpu/usage)
  si.currentLoad()
    .then(data => res.send(data.currentload.toString()))
    .catch(error => res.status(404).send(siError))
})

// API requests: file system.
api.get('/fs/:id/usage', function(req, res) { // File System Usage % (fs/[id]/usage)
  si.fsSize()
    .then(data => res.send(data[parseInt(req.params.id)].use.toString()))
    .catch(error => res.status(404).send(siError))
})
api.get('/fs/:id/used', function(req, res) { // Used GB in File System (fs/[id]/used)
  si.fsSize()
    .then(data => res.send((data[parseInt(req.params.id)].used/(1024*1024*1024)).toString()))
    .catch(error => res.status(404).send(siError))
})
api.get('/fs/:id/total', function(req, res) { // Total GB in File System (fs/[id]/used)
  si.fsSize()
    .then(data => res.send((data[parseInt(req.params.id)].size/(1024*1024*1024)).toString()))
    .catch(error => res.status(404).send(siError))
})

// API requests: RAM.
api.get('/ram/usage', function(req, res) { // RAM Usage % (ram/usage)
  si.mem()
    .then(data => res.send(((data.used/data.total)*100).toString()))
    .catch(error => res.status(404).send(siError))
})
api.get('/ram/used', function(req, res) { // Used RAM in MB (ram/used)
  si.mem()
    .then(data => res.send((data.used/(1024*1024)).toString()))
    .catch(error => res.status(404).send(siError))
})
api.get('/ram/total', function(req, res) { // Total RAM in MB (ram/total)
  si.mem()
    .then(data => res.send((data.total/(1024*1024)).toString()))
    .catch(error => res.status(404).send(siError))
})

module.exports = api;