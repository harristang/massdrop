import express from 'express'
import bodyParser from 'body-parser'
import Job from './models/job.js'
import { processJobs } from './models/queue.js'

const app = express()
const PORT = process.env.PORT || 3000

// setup body-parser to get POST data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/assets', express.static('assets'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.route('/jobs/:id')
  .get((req, res) => {
    Job.getJob(
      req.params.id,
      (result) => {
        if (result) {
          if (result.content) {
            res.send(result.content)
          } else {
            res.send('Content not yet available.')
          }
        } else {
          res.send('Job not found.')
        }
      },
      error => res.status(500).json({ error })
    )
  })

// API Routes
const router = express.Router()

router.route('/jobs')
  .get((req, res) => {
    Job.getJobs(
      result => res.json(result),
      error => res.status(500).json({ error })
    )
  })
  .post((req, res) => {
    if (req.body.url) {
      Job.createJob(
        req.body.url,
        result => res.status(201).json(result.data),
        error => res.status(500).json({ error })
      )
    } else {
      res.status(400).json({ error: "'url' missing from post request." })
    }
  })

router.route('/jobs/:id')
  .get((req, res) => {
    Job.getJob(
      req.params.id,
      result => res.json(result),
      error => res.status(500).json({ error })
    )
  })

app.use('/api', router)

app.listen(PORT, function () {
  // start processing jobs
  processJobs()

  console.log(`Server running on port: ${PORT}`)
})
