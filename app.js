alert("app.js start");
console.log("Storage =", typeof Storage);

(function(){

function today(){
return new Date().toISOString().slice(0,10);
}

let data = Storage.get("workout",{});
let date = today();

function save(){
Storage.set("workout",data);
}

function render(){

try{

```
const dayData = data[date] || [];

let html = `
  <h2>💪 訓練日誌</h2>

  <div class="card">
    <input type="date" id="date" value="${date}">
  </div>

  <div class="card">
    <input id="name" placeholder="動作">
    <input id="weight" placeholder="重量">
    <input id="reps" placeholder="次數">
    <input id="sets" placeholder="組數" value="3">
    <button id="add">新增</button>
  </div>
`;

dayData.forEach(ex=>{
  html += `<div class="card">
    <b>${ex.name}</b><br>
    ${ex.sets.map((s,i)=>`S${i+1} ${s.weight}kg x ${s.reps}`).join("<br>")}
    <button onclick="removeItem(${ex.id})">刪除</button>
  </div>`;
});

document.getElementById("app").innerHTML = html;

document.getElementById("date").onchange = (e)=>{
  date = e.target.value;
  render();
};

document.getElementById("add").onclick = ()=>{
  const name = document.getElementById("name").value;
  const weight = document.getElementById("weight").value;
  const reps = document.getElementById("reps").value;
  const sets = document.getElementById("sets").value;

  if(!name) return;

  const entry = {
    id:Date.now(),
    name,
    sets:Array.from({length:parseInt(sets)||1}).map(()=>({
      weight, reps
    }))
  };

  data[date] = [...(data[date]||[]),entry];
  save();
  render();
};
```

}catch(err){
document.getElementById("app").innerHTML =
"<h2>發生錯誤，請重新整理</h2>";
console.error(err);
}
}

window.removeItem = function(id){
data[date] = (data[date]||[]).filter(e=>e.id!==id);
save();
render();
};

render();

// PWA
if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js");
}

})();
