import Thinky from 'thinky'
import { addJobToQueue } from './queue.js'

// reference rethinkdb ORM driver instance
const thinky = Thinky()

// set up Job model
const type = thinky.type
const Job = thinky.createModel('Job', {
  id: type.string(),
  url: type.string(),
  content: type.string(),
  date: type.date().default(thinky.r.now())
})
Job.ensureIndex('date')

Job.getJobs = (onSuccess, onError) => {
  Job.orderBy({ index: thinky.r.desc('date') }).run()
    .then(result => onSuccess(result))
    .error(err => onError(err))
}

Job.createJob = (url, onSuccess, onError) => {
  // append protocol if not included in url
  const validUrl = /^https?:\/\//i.test(url) ? url : `http://${url}`

  const job = new Job({ url: validUrl })
  job.save()
    .then((result) => {
      addJobToQueue(result, onSuccess, onError)
    })
    .error(err => onError(err))
}

Job.getJob = (id, onSuccess, onError) => {
  Job.get(id).run()
    .then(job => onSuccess(job))
    .error(err => onError(err))
}

Job.setContent = (id, content, done) => {
  const jobData = {
    content,
    dateProcessed: thinky.r.now()
  }

  Job.get(id).update(jobData).run()
    .then(() => done())
}

export default Job
