const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));
// app.use(express.static('public'));   


app.use(express.json());
app.use(express.urlencoded({extended:true}));




// app.get('/',function(req,res){
//     res.render('index')
// })
//create :


app.get('/',function(req,res){
    fs.readdir(`./files`,function(err,files){
        if(err) return res.send("somethig went wrong");  
           
            res.render('index',{files});        
    })    
})
let date = "";


app.post('/create/khatabook',function(req,res){

    // console.log(req.body)
    // res.send("Hello")
    let { Createinput, Textarea } = req.body;
   
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let year = today.getFullYear();
    
    // console.log(`${day}-${month}-${year}.txt`);
    date = `${day}-${month}-${year}`;
    
    let fn = `${day}-${month}-${year}.txt`;
    // console.log(fn)
    let fileContent = `Input Content: ${Createinput} \n Textarea Content: ${Textarea}\n`;
    fs.writeFile(`./files/${fn}`,fileContent,function(err){
        if(err) return res.send("something went wrong");
        else {
            fs.readdir(`./files`,function(err,files){
                if(err) return res.send("somethig went wrong");  
                    res.render('index',{files});        
            })   
        }
    }) 
})

app.get('/create',(req,res)=>{
    res.render('create')
})
// date ="12-08-2020";
// app.get('/edit',function(req,res){
//     res.render('edit',{date});
// })


app.get('/delete/:filename',function(req,res){
    fs.unlink(`./files/${req.params.filename}`,function(err){
        if(err) return res.send(err);
        return res.redirect('/');
    })
})

app.post('/update/:filename',function(req,res){
    // console.log(req.body.updatdText)
    // res.send('hello world')
    fs.writeFile(`./files/${req.params.filename}`,req.body.updatdText,function(err){
        
        if(err) return res.send(err);
        return res.redirect('/');
    })
})


app.get('/edit/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err,data){
        if(err) res.send("error occur");
        else{

            
            res.render("edit",{date,data,filename: req.params.filename});
        }
    })
})

app.get('/hisaab/:hisaabid',function(req,res){

    fs.readFile(`./files/${req.params.hisaabid}`,"utf-8", function(err,data){
        if(err) return res.send("error occur");
        else{
            
             res.render('showHisaab',{date,data ,filename: req.params.hisaabid});
        }
    })
})




app.listen(3000, () => console.log("Server is running on the port 3000"));