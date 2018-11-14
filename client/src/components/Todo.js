import React, {Component} from 'react';
import Item from './Item.js';
import Form from './Form.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
const url = '/api/todo/';

const style = {
    height: "100%",
    width: "70vh",
    margin: "1em",
    padding: "3em",
    textAlign: 'center',
    display: 'inline-block',
  };

class Todo extends Component {
    constructor(props){
        super(props);
        this.state = {
            todo: []
        }
    }

    componentWillMount(){
        fetch(url)
        .then(res => {
            if(!res .ok){
                if(res.status >= 400 && res.status < 500) {
                   return res.json().then(data => {
                       let err = {error: data.message};
                       throw err;
                   })
                } else {
                    let err = {error: 'Sorry, the server is not responding. Please try again later.'}
                    throw err;
                }
            }
                return res.json();
            })
            .then(todo => {
                console.log(todo);
                return this.setState({todo});
    
            })
    }
    
    postTodo = (t) => {
        console.log('Todo POST', t)
        fetch(url,{
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({name: t})
        })
        .then(res => {
            if(!res .ok){
                if(res.status >= 400 && res.status < 500) {
                   return res.json().then(data => {
                       let err = {error: data.message};
                       throw err;
                   })
                } else {
                    let err = {error: 'Sorry, the server is not responding. Please try again later.'}
                    throw err;
                }
            }
                return res.json();
            })
            .then(t => {
              //  console.log(todo);
                return this.setState({todo: [...this.state.todo, t]});
            })
    }

    toggleTodo = (toggle, id) => {
       const path = '/' + id; 
        console.log("Toggle before", toggle, id)
       
        fetch(url + path,{
            method: 'put',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({completed: !toggle})
        })
        .then(res => {
            if(!res .ok){
                if(res.status >= 400 && res.status < 500) {
                   return res.json().then(data => {
                       let err = {error: data.message};
                       throw err;
                   })
                } else {
                    let err = {error: 'Sorry, the server is not responding. Please try again later.'}
                    throw err;
                }
            }
                return res.json();
            })
            .then(updated => {
                console.log('update', updated)
                //need to iterate through list to find modified Item and flip boolean
               
                const list = this.state.todo.map(todo => {
                    if(todo._id === updated._id){
                        return {...todo, completed: !todo.completed}
                    } else {
                        return todo;
                    }
                })
                
                return this.setState({todo: list});
            })
    
    }

    deleteTodo = ( id) => {
        const path = id; 
         console.log("delete before", id)
        
         fetch(url + path,{
             method: 'delete',
             headers: new Headers({
                 'Content-Type': 'application/json'
             }),
             
         })
         .then(res => {
             console.log('Then(res', res)
             if(!res .ok){
                 if(res.status >= 400 && res.status < 500) {
                    return res.json().then(data => {
                        let err = {error: data.message};
                        throw err;
                    })
                 } else {
                     let err = {error: 'Sorry, the server is not responding. Please try again later.'}
                     throw err;
                 }
             }
                 return res.json();
             })
             .then((x) => {
                 console.log('filter out deleted todo', x)
                 const list = this.state.todo.filter(t => t._id !== id);
                 console.log('list', list)
                 return this.setState({todo:list}) 
                 })
                 
             }
     
     
 

    render(){
        const list = this.state.todo.map((i) => (
            <Item
                key={i._id}
                {...i}error
                onClick = {this.toggleTodo}
                onDelete = {this.deleteTodo}
                />
        ));
        console.log(this.state.todo, 'state')
        
        return (
            <Paper
              style={style}
              elevation={12}>
                <Grid container 
                  justify = "center"
                  direction = "column"
                  spacing = "8">
             
                    <Grid item>
                        <Form postTodo={this.postTodo}/>
                    </Grid>

                    <Grid item>
                         {list}
                    </Grid>
                
                </Grid>
            </Paper>
        )
    }
}

export default Todo;