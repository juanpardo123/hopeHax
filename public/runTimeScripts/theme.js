import { globalTheme } from "../../app";

console.log(globalTheme);
if (globalTheme == 'watermelon'){
    var store = document.querySelector(':root');
    store.style.setProperty('--backdrop', '#3A6B35');
    store.style.setProperty(' --background-color', '#CBD18F');
    store.style.setProperty('--accent1', '#ff5656');
    store.style.setProperty('--accent2', '#5f5b5b');
    store.style.setProperty('--buttons', '#201f1f');
    // --backdrop: #3A6B35;
    // --background-color: #CBD18F;
    // --buttons: #201f1f;
    // --accent1: #ff5656;
    // --accent2: #5f5b5b ;
    
}
else if (globalTheme == 'purple'){
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#AA96DA');
  store.style.setProperty(' --background-color', '#C5FAD5');
  store.style.setProperty('--accent1', '#F92C85');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
  // --backdrop: #AA96DA;
  // --background-color: #C5FAD5;
  // --accent1: #F92C85;
  // --buttons: #201f1fc7;
  // --accent2: #5f5b5b ; 
  
}
else if (globalTheme == 'cyan'){
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#5EBEC4');
  store.style.setProperty(' --background-color', '#FDF5DF');
  store.style.setProperty('--accent1', '#F92C85');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
  // --backdrop:  #5EBEC4;
  // --background-color:#FDF5DF;
  // --accent1: #F92C85;
  // --accent2: #5f5b5b;
  // --buttons: #201f1fc7;
  
}
else if (globalTheme == 'lightBlue'){
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#7DA2A9');
  store.style.setProperty(' --background-color', '#F7F7F7');
  store.style.setProperty('--accent1', '#54a6c3');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
  // --backdrop:  #7DA2A9;
  // --background-color:#F7F7F7;
  // --accent1: #54a6c3;
  // --accent2: #5f5b5b;
  // --buttons: #201f1fc7;
  
}
else if (globalTheme == 'pumpking'){
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#D48166');
  store.style.setProperty(' --background-color', '#E6E2DD');
  store.style.setProperty('--accent1', '#646862');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
  // --backdrop:   #D48166;
  // --background-color:#E6E2DD ;
  // --accent1: #646862; 
  // --accent2: #5f5b5b;
  // --buttons: #201f1fc7;
  
}
else if (globalTheme == 'mango'){
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#EBA63F');
  store.style.setProperty(' --background-color', '#F7F4E9');
  store.style.setProperty('--accent1', '#E40C2B');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
  
  /* --backdrop:   #EBA63F;
  --background-color:#F7F4E9 ;
  --accent1: #E40C2B;
   --accent2: #5f5b5b;
  --buttons: #201f1fc7; */
  
}else{
  var store = document.querySelector(':root');
  store.style.setProperty('--backdrop', '#EBA63F');
  store.style.setProperty(' --background-color', '#F7F4E9');
  store.style.setProperty('--accent1', '#E40C2B');
  store.style.setProperty('--accent2', '#5f5b5b');
  store.style.setProperty('--buttons', '#201f1fc7');
}

