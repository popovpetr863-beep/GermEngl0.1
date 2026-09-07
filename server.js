const express=require('express'),path=require('path');
const app=express(),PORT=process.env.PORT||3000;
app.use(express.json());app.use(express.static(path.join(__dirname,'public')));
app.post('/api/ai',(req,res)=>{
 const {message,language='en',level='A1'}=req.body||{};
 if(!message)return res.status(400).json({error:'Введите сообщение.'});
 const tip=language==='de'
 ? 'Versuche auf Deutsch zu antworten. Ich kann Grammatik, Wortschatz und kurze Dialoge üben.'
 : 'Try to answer in English. I can practise grammar, vocabulary and short dialogues with you.';
 res.json({reply:`${language==='de'?'Deutsch':'English'} • ${level}\n\n${tip}\n\nТы написал: «${message}»`});
});
app.listen(PORT,()=>console.log('LinguaHub on '+PORT));