import kue from 'kue'
import request from 'request'
import Job from './job.js'

const queue = kue.createQueue()

export const addJobToQueue = (jobData, onSuccess, onError) => {
  const job = queue.create('job', jobData)
    .save(err => err ? onError(err) : onSuccess(job))
}

export const processJobs = () => {
  queue.process('job', (job, done) => {
    setJobContent(job.data.url, job.data.id, done)
  })
}

function setJobContent (url, id, done) {
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      Job.setContent(id, body, done)
    }
  })
}
