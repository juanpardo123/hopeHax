import { globalTheme } from "../../app";

if (globalTheme){
    var store = document.querySelector(':root');
    store.style.setProperty('--backdrop', '#FDF5DF');
    store.style.setProperty(' --background-color', '#5EBEC4');
    store.style.setProperty('--accent1', '#F92C85');

    /* --backdrop:  #5EBEC4;
  --background-color:#FDF5DF;
  --accent1: #F92C85; color scheme 1 */
    
}
