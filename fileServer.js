/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module
  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
    - For any other route not defined in the server return 404
    Testing the server - run `npm run test-fileServer` command in terminal
 */

    const express = require('express');
    const fs=require('fs');
    const bodyParser = require('body-parser');
    const path=require('path')
    const app = express();
    app.use(bodyParser.json());
    const filePath="todos.json";
  
    app.get('/todos',(req,resp)=>{
      fs.readFile(filePath,"utf8",(err,data)=>
      {
        if(err)
        throw err
        
        resp.status(200).json(JSON.parse(data));
      });
    });
  
  
    app.get('/todos/:id',(req,resp)=>
    {
      const id=req.params.id;
      let index=-1;
      fs.readFile(filePath,"utf8",(err,data)=>{
        if(err)throw err;
        const todos=JSON.parse(data);
        for(let i=0;i<todos.length;i++)
        {
          if(todos[i].id==id)
          {
            index=i;
            break;
          }
        }
        if(index==-1)
        {
          resp.status(404).send();
        }
        else
        {
          resp.json(todos[index]);
        }
      });
  
    });
  
    app.post("/todos", (req,resp)=>
    {
      const newData={
        id:Math.floor(Math.random()*100000),
        title:req.body.title,
        Discription:req.body.Discription      
  
      };
         fs.readFile(filePath,'utf8',(err,data)=>
         {
          if(err)throw err;
          const todo=JSON.parse(data);       
          todo.push(newData);
          // const updatedData=JSON.stringify(todo);
           fs.writeFile(filePath,JSON.stringify(todo),(err)=>
           {
            if(err)throw err;
             resp.status(201).json(newData);
           });
         });   
    });
    
  
    app.put("/todos/:id",(req,resp)=>
    {
      const id=req.params.id;
      console.log("You reached to server"+"    "+id);
      fs.readFile(filePath,"utf8",(err,data)=>
      {
        if(err)throw err;
        const todos=JSON.parse(data);
        let index=-1;
        for(let i=0;i<todos.length;i++)
        {
  
          if(todos[i].id==id)
          {
            todos[i].id=req.body.id;
            todos[i].title=req.body.title;
            todos[i].Discription=req.body.Discription;
            index=i;
            console.log(todos[i])
            break;
          }
  
        }
        if(index==-1)
        {
          resp.status(404).send()
        }
        else
        {
          fs.writeFile(filePath,JSON.stringify(todos),(err)=>
          {
            if(err)throw err;
            resp.status(200).json(todos[index]);
          });
        }
        
      });
    });
  
    app.delete('/todos/:id',(req,resp)=>{
      const id=req.params.id;
      fs.readFile(filePath,"utf8",(err,data)=>
      {
           if(err)throw err;
           const todos=JSON.parse(data);
           let index=-1;
           let newTodo=[];
           for(let i=0;i<todos.length;i++)
           {
              if(todos[i].id==id)
              {
                index=i;
              }
              else
              {
                   newTodo.push(todos[i]);
              }
           }
           if(index==-1)
           {
              resp.status(404).send();
           }
           else
           {
            fs.writeFile(filePath,JSON.stringify(newTodo),(err)=>
            {
              if(err)
              {
                throw err;
              }
              else
              {
                resp.status(200).send();
              }
            });
           }
      });
    });
  
    app.get("/",(req,resp)=>
{
  resp.sendFile(path.join(__dirname,"index.html"));
})
    app.use((req,res,next)=>
    {
      res.status(404).send();
    });

    app.listen(3000,()=>
    {
      console.log('Server listening on port 3000! ')
    });

    // module.exports = app;