// Simple Express backend for prototype
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname,'data','charts.json');

app.use(express.static(path.join(__dirname,'..','frontend')));
app.use(bodyParser.json());

function readData(){
  try{ return JSON.parse(fs.readFileSync(DATA_FILE)); }catch(e){ return { entries: [] }; }
}
function writeData(data){ fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2)); }

// endpoints
app.get('/api/charts/latest', (req,res)=>{
  const d = readData();
  res.json(d);
});

app.get('/api/charts/previous', (req,res)=>{
  const d = readData();
  // For prototype, return same data as previous; in real app you'd fetch the previous issue
  res.json(d);
});

app.post('/api/charts/save', (req,res)=>{
  const payload = req.body;
  try{
    writeData(payload);
    return res.json({ok:true});
  }catch(err){ return res.status(500).json({ok:false, error:String(err)}); }
});

// metadata endpoint: tries to fetch minimal metadata from Spotify/Apple via AllOrigins proxy if allowed
app.post('/api/metadata', async (req,res)=>{
  const { url } = req.body || {};
  if(!url) return res.status(400).json({error:'no url'});
  if(url.includes('spotify.com/track')){
    const idMatch = url.match(/track\/([A-Za-z0-9]+)/);
    return res.json({ title: null, artist: null, source: 'spotify', id: idMatch? idMatch[1] : null });
  }
  if(url.includes('apple.com')){
    return res.json({ title: null, artist: null, source: 'apple' });
  }
  return res.json({ title: null, artist: null, source: 'unknown' });
});

app.listen(PORT, ()=> console.log('Server started on port', PORT));
