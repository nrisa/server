import React, { Component } from 'react';
import './App.css';

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      member : [],
      first_name : '',
      last_name : '',
      btnDisable : false,
      formStatus : 'create',
      memberIdSelected : null
    }
  }

  // get https request
  componentDidMount(){
    fetch('https://reqres.in/api/users?page=1')
      .then(res => res.json())
      .then(res => {
        this.setState({
          member : res.data
        })
      })
      .catch(err => console.log(err))
  }

  // https request
  handleChangeName = e => {
    this.setState({ [e.target.name] : e.target.value })
  }

  handleSubmitEvent = e => {
    this.setState({btnDisable : true})
    e.preventDefault()
    let url;
    if(this.state.formStatus === 'create'){
      url = 'https://reqres.in/api/users'
      this.addMember(url)
    }else {
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`
      this.updateMember(url)
    }
  }
    

  // Post https request
  addMember = url => {
    let part = {
      method : 'POST',
      headers : {
        "Content-type": "application/json; charset=UTF-8"
      }, 
      body : JSON.stringify({
        first_name : this.state.first_name,
        last_name : this.state.last_name
      })
    }
    
    fetch(url, part)
      .then(res => res.json())
      .then(res => {
        alert('berhasil:)')
        let member = [...this.state.member]
        member.push(res)
        this.setState({
          member, 
          first_name : '',
          last_name : '',
          btnDisable : false
        })
      })
      .catch(err => console.log(err))
  }

  // Put https request
  updateMember = url => {
    let part = {
      method : 'PUT',
      headers : {
        "Content-type": "application/json; charset=UTF-8"
      }, 
      body : JSON.stringify({
        first_name : this.state.first_name,
        last_name : this.state.last_name
      })
    }
    
    fetch(url, part)
      .then(res => res.json())
      .then(res => {
        alert('berhasil:)')
        let member = [...this.state.member]
        let indexMember = member.findIndex(m => m.id === this.state.memberIdSelected)

        member[indexMember].first_name = res.first_name;
        member[indexMember].last_name = res.last_name;

        this.setState({
          member, 
          first_name : '',
          last_name : '',
          btnDisable : false,
          formStatus : 'create'
        })
      })
      .catch(err => console.log(err))
  }

  deleteMember = id => {
    let url = `https://reqres.in/api/users/${id}`
    let part = {
      method : 'DELETE',
      headers : {
        "Content-type": "application/json; charset=UTF-8"
      }, 
    }

    fetch(url, part)
    .then(res => {
      if(res.status === 204) {
        let member = [...this.state.member]
        let index = member.findIndex(m => m.id === id)
        member.splice(index, 1)
        this.setState({ member })
      }
    })
  }

  // update event
  handleUpdateEvent = member => {
    this.setState({
      first_name : member.first_name,
      last_name : member.last_name,
      formStatus : 'edit',
      memberIdSelected : member.id
    })
  }

  // HTML 
  render(){
    return (
      <div className="App"> 

        {/* form component */}

        <h1>Data {this.state.formStatus}:</h1>
        <form onSubmit={this.handleSubmitEvent}>
          <small>first name</small><br />
          <input 
          type="text" 
          name="first_name" 
          value={this.state.first_name}
          onChange={this.handleChangeName}
          />
          <br />
          <small>last name</small><br />
          <input 
          type="text" 
          name="last_name" 
          value={this.state.last_name}
          onChange={this.handleChangeName}
          />
          <br /><br />
          <button 
          className='btn' 
          type="submit" 
          disabled={this.state.btnDisable}
          >
            submit
          </button>
        </form>

        {/* list component */}

        <h1>List on Server</h1>
        <div className="container">
          {this.state.member.map((member, index) => 
          <div key={member.id} className="card">
            <ul>
              <li>no : {index+1}</li>
              <li>nama : {member.first_name} {member.last_name}</li>
            </ul>
            <button 
            type='button' 
            className='btn btn-pdt' 
            onClick={() => this.handleUpdateEvent(member) } 
            >edit</button>
            <button 
            type='button' 
            className='btn btn-dlt' 
            onClick={()=> this.deleteMember(member.id)}
            >
              delete
            </button>
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
