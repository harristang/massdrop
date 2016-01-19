import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      newUrl: '',
      jobs: []
    }
    this.getJobs()
  }

  onUrlInputChange (event) {
    this.setState({ newUrl: event.target.value })
  }

  onUrlSubmit () {
    this.createJob(this.state.newUrl)
    this.setState({ newUrl: '' })
  }

  render () {
    return (
      <div>
        <div>
          Enter a URL:
          <input type='text' value={this.state.newUrl} onChange={this.onUrlInputChange.bind(this)} />
          <button onClick={this.onUrlSubmit.bind(this)} >submit</button>
        </div>
        <div>
          {
            this.state.jobs.map(job =>
              <div key={job.id}>
                <a href={`/jobs/${job.id}`}>{job.url}</a>
              </div>
            )
          }
        </div>
      </div>
    )
  }

  getJobs () {
    const url = 'http://localhost:3000/api/jobs'
    request.get(url, (err, res) => {
      if (err) throw err
      this.setState({jobs: res.body})
    })
  }

  createJob (url) {
    const apiUrl = 'http://localhost:3000/api/jobs'
    request.post(apiUrl)
    .set('Content-Type', 'application/json')
    .send({ url })
    .end(() => this.getJobs())
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
