import React from "react";

 import Todolist from "./components/Todolist";


function App(){
  console.log("App")
  return <div className="app">{<Todolist /> }</div>;
}

export default App;
