import React, { useState } from "react";

function Todolist() {
  const [tasks, setTasks]= useState('');
  return (
    <>
      <div className="container">
        <div className="header">TODO LIST</div>
        <input type="text" placeholder="ADD YOUR TASKS"  value={tasks} onChange={(e)=>setTasks(e.target.value)}/>
      </div>
    </>
  );
}

export default Todolist;
