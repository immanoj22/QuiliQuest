import express from "express"
import bodyParser from "body-parser";
import path from "path"
import url from "url"

const __dirname=path.dirname(url.fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 3000;
const app=express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"public")))

app.use(bodyParser.urlencoded({extended:true}))

function getime(){
    let hr=new Date().getHours();
    let min=new Date().getMinutes();
    let sec=new Date().getSeconds();
    let parent=hr >= 12 ? "PM" : "AM";

    if(hr==12){
        hr=12;
    }
    else{
        hr=hr%12;
    }
    return `${hr}.${min}.${sec} ${parent}`
}



function getcurrentdate(){
    let date=new Date().getDate();
    let month=new Date().getMonth();
    let year=new Date().getFullYear();
    return `${date}/${month}/${year}`;
}
let allposts=[]
let viewarr=[]


function allpostintoarray(numberposta,time,title,content,currentdate){
    allposts.push({
        stringnumberofpost: `:${numberposta}`,
        numberofpost:numberposta,
        timeofposting:time,
        titleofpost:title,
        contentofpost:content,
        dateofposting:currentdate
    })
}

function viewarrposts(numberposta ,time ,title ,content ,currentdate){
    viewarr.push({
        stringnumberofpost: `:${numberposta}`,
        numberofpost:numberposta,
        timeofposting:time,
        titleofpost:title,
        contentofpost:content,
        dateofposting:currentdate
      })

      

}


let numberposta=0;




app.get("/",(req,res)=>{
    res.render("index.ejs")
})
app.get("/newpost",(req,res)=>{
    res.render("newpost.ejs")
})




app.post("/posting",(req,res)=>{
    
    let time=getime()
    let currentdate=getcurrentdate()
    const title=req.body["Title"];
    const content=req.body["content"]
    const num=numberposta;
    const regex = /\d/;
    const regex1=/^\d+$/;
    

    if(title.length<=0 || content.length <=0 ){
        res.redirect("/newpost")
    }
    else{
        allpostintoarray(numberposta,time,title,content,currentdate)
        viewarrposts(numberposta ,time ,title ,content ,currentdate)          
        res.render("succesfullposted.ejs",{
            htmloflist:numberposta
            
        })       
        numberposta++;   
    }

    
    
   
})


app.get("/Allpost",(req,res)=>{
    res.render("Allpost.ejs",{
        htmloflist: allposts   

    })
    
})


app.get("/home",(req,res)=>{
    res.render("index.ejs")
})

app.get('/viewthepost/:id',(req,res)=>{
    const post=allposts.find(p=>p.stringnumberofpost===req.params.id)
    
    res.render('viewpost.ejs',{
        headingofpost:post.titleofpost,
        contentofpost:post.contentofpost,
        dateofpostv:post.dateofposting
    })
})



app.get('/edithepost/:id',(req,res)=>{
    const post=allposts.find(p=>p.stringnumberofpost===req.params.id)
    
    res.render('Editpost.ejs',{
        postobject:post,
        htmloflist:req.params.id
    })
})

app.post('/updatedpost/:id',(req,res)=>{

    const post=allposts.find(p=>p.stringnumberofpost===req.params.id)
    post.titleofpost=req.body["Title"];
    post.contentofpost=req.body["content"]
    
    res.render("Allpost.ejs",{
        htmloflist: allposts   

    })

    
})

app.get('/delethepost/:id',(req,res)=>{
    const posts = allposts.pop(p => p.id == req.params.id); 
    res.render("Allpost.ejs",{
        htmloflist: allposts   

    })
})



app.listen(PORT,()=>{
    console.log(`The PORT is running on ${PORT}`)   
})
