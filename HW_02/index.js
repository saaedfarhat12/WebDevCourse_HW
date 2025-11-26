document.addEventListener("DOMContentLoaded", ()=>{

  pageLoaded();
  //..
});

let txt1;
let txt2;
let btn;
let lblRes;


function pageLoaded() 
{
  txt1 = document.getElementById("txt1");
  txt2 = document.querySelector("#txt2");
  btn = document.getElementById("btnCalc");
  lblRes = document.getElementById("lblRes");
  btn.addEventListener("click", calculate); 
  txt1.addEventListener("input", () => validateInput(txt1));
  txt2.addEventListener("input", () => validateInput(txt2));
  
}


 // Function to calculate the result
// Attach the button event ONLY once
// document.getElementById("btnCalc").onclick = calculate;

function calculate() {
  const n1 = parseFloat(document.getElementById("txt1").value);
  const n2 = parseFloat(document.getElementById("txt2").value);
  const op = document.getElementById("operator").value;
  let result;

  if (isNaN(n1) || isNaN(n2)) {
    const logs = document.getElementById("logs");

    document.getElementById("lblRes").innerText = "Invalid input";

    // Add error message to logs
    logs.value += `Error: invalid input → "${document.getElementById("txt1").value}" , "${document.getElementById("txt2").value}"\n`;

    return;
}

  switch (op) {
    case "+":
      result = n1 + n2;
      break;
    case "-":
      result = n1 - n2;
      break;
    case "*":
      result = n1 * n2;
      break;
    case "/":
      result = n2 !== 0 ? n1 / n2 : "Error: divide by zero";
      break;
  }

  // Show result in the result output area
  document.getElementById("lblRes").innerText = result;

  // Add operation to logs ONLY ONCE
  const logs = document.getElementById("logs");
  logs.value += `${n1} ${op} ${n2} = ${result}\n`;
}


function print(msg) {

  //--Get TextArea Element Reference
  const ta = document.getElementById("output");

  //--Write the MESSAGE to the TEXTAREA
  if (ta) ta.value = msg;
  //--Write to CONSOLE if no TEXTAREA
  else console.log(msg);

  
}
function validateInput(input) {
  const value = input.value.trim();

  if (!isNaN(value) && value !== "") {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
      return true;
  } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      return false;
  }
}

// //
// // =============================================
// // STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// // =============================================
// function demoNative() {
//   let out = "=== STEP 1: NATIVE TYPES ===\n";

//   // String
//   const s = "Hello World";
//   out += "\n[String] s = " + s;
//   out += "\nLength: " + s.length;
//   out += "\nUpper: " + s.toUpperCase();

//   // Number
//   const n = 42;
//   out += "\n\n[Number] n = " + n;

//   // Boolean
//   const b = true;
//   out += "\n\n[Boolean] b = " + b;

//   // Date
//   const d = new Date();
//   out += "\n\n[Date] now = " + d.toISOString();

//   // Array
//   const arr = [1, 2, 3, 4];
//   out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
//   out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
//   out += "\nMap x2 → " + arr.map(x=>x*2).join(", ");

//   // Functions as variables
//   const add = function(a,b){ return a+b; };
//   out += "\n\n[Function as variable] add(3,4) = " + add(3,4);

//   // Callback
//   function calc(a,b,fn){ return fn(a,b); }
//   const result = calc(10,20,(x,y)=>x+y);
//   out += "\n[Callback] calc(10,20, x+y ) = " + result;

//   //--Print to log/output
//   print(out);
// }