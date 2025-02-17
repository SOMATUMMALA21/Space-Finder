'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function ToDos() {

    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    function addNewTodo() {
        if(newTodo && newTodo.length) {
            fetch("api/todos", { method: "post", body: JSON.stringify({value: newTodo, done: false}) } ).then((response) => {
                return response.json().then((newTodo) => {
                    setTodos([...todos, newTodo]);
                    setNewTodo('');
                });
            });  
        }
    }

    function removeTodo({ index }) {
        if (todos) {
            const cur_id = todos[index].id;
            fetch("api/todos/" + cur_id, { method: "delete" }).then((response) => response.ok && response.json()).then(
                () => {
                    setTodos(todos.filter((v,idx) => idx!==index));
                }
            );
        }
    }

    function updateTodo({ index }) {
        if (todos) {
            const cur_id = todos[index].id;
            const checked = todos[index].done;
            fetch("api/todos/" + cur_id, { method: "put", body: JSON.stringify({done: !checked}) }).then((response) => {
                return response.json().then(() => {
                    todos[index].done = !checked;
                    setTodos([...todos]);
                });
            });
        }
    }

    useEffect(() => {
        fetch("/api/todos", { method: "get" }).then((response) => response.ok && response.json()).then(
            todos => {
                todos && setTodos(todos);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const toDoItems = isLoading ? loadingItems : todos.map((todo, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeTodo(todo.id)}><DeleteForever/></IconButton>   
        }>  
            <ListItemButton onClick={() => checkItem(todo)}>
                <ListItemIcon>
                    <Checkbox checked={todo.done} onClick={() => updateTodo({index: idx})} disableRipple/>
                </ListItemIcon>
                <ListItemText primary={todo.value}/>
            </ListItemButton>
        </ListItem>;
    });

    return (
        <>
            <h2>My ToDos</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { toDoItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo}><AddBox/></IconButton>}>
                    <TextField label="New ToDo Item" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );
}